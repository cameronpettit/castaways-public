const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.REGION || 'us-west-2'
});

// Environment variables
const BUCKET_NAME = process.env.BUCKET_NAME;
const SIGNED_URL_EXPIRATION = parseInt(process.env.SIGNED_URL_EXPIRATION) || 3600;

/**
 * Lambda handler for listing S3 objects with signed URLs
 * @param {Object} event - Lambda event object
 * @param {Object} context - Lambda context object
 * @returns {Object} Response with object list and signed URLs
 */
exports.handler = async (event, context) => {
  try {
    console.log('Event:', JSON.stringify(event, null, 2));

    // Extract parameters from event
    const {
      prefix = '',
      maxKeys = 100,
      continuationToken = null
    } = event.queryStringParameters || {};

    // List objects in S3 bucket
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: parseInt(maxKeys),
      ContinuationToken: continuationToken
    });

    console.log('Listing objects with params:', {
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: maxKeys
    });

    const listResponse = await s3Client.send(listCommand);

    if (!listResponse.Contents) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({
          objects: [],
          isTruncated: false,
          nextContinuationToken: null,
          totalCount: 0
        })
      };
    }

    // Generate signed URLs for each object
    const objectsWithSignedUrls = await Promise.all(
      listResponse.Contents.map(async (object) => {
        try {
          const getObjectCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: object.Key
          });

          const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
            expiresIn: SIGNED_URL_EXPIRATION
          });

          return {
            key: object.Key,
            size: object.Size,
            lastModified: object.LastModified,
            etag: object.ETag,
            storageClass: object.StorageClass || 'STANDARD',
            signedUrl: signedUrl,
            // Additional metadata
            fileName: object.Key.split('/').pop(),
            folder: object.Key.includes('/') ? object.Key.substring(0, object.Key.lastIndexOf('/')) : '',
            extension: object.Key.includes('.') ? object.Key.split('.').pop().toLowerCase() : null
          };
        } catch (urlError) {
          console.error(`Error generating signed URL for ${object.Key}:`, urlError);
          return {
            key: object.Key,
            size: object.Size,
            lastModified: object.LastModified,
            etag: object.ETag,
            storageClass: object.StorageClass || 'STANDARD',
            signedUrl: null,
            error: 'Failed to generate signed URL',
            fileName: object.Key.split('/').pop(),
            folder: object.Key.includes('/') ? object.Key.substring(0, object.Key.lastIndexOf('/')) : '',
            extension: object.Key.includes('.') ? object.Key.split('.').pop().toLowerCase() : null
          };
        }
      })
    );

    // Prepare response
    const response = {
      objects: objectsWithSignedUrls,
      isTruncated: listResponse.IsTruncated || false,
      nextContinuationToken: listResponse.NextContinuationToken || null,
      totalCount: objectsWithSignedUrls.length,
      prefix: prefix,
      bucket: BUCKET_NAME,
      // Summary statistics
      summary: {
        totalSize: objectsWithSignedUrls.reduce((sum, obj) => sum + (obj.size || 0), 0),
        fileTypes: [...new Set(objectsWithSignedUrls.map(obj => obj.extension).filter(ext => ext))],
        folders: [...new Set(objectsWithSignedUrls.map(obj => obj.folder).filter(folder => folder))]
      }
    };

    console.log(`Successfully listed ${objectsWithSignedUrls.length} objects`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Error in S3 list objects function:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        requestId: context.awsRequestId
      })
    };
  }
};