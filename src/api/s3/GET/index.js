// Get docs from S3 bucket

const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.REGION || 'ca-central-1'
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const SIGNED_URL_EXPIRATION = parseInt(process.env.SIGNED_URL_EXPIRATION) || 3600;

const validPaths = [
  'documents/bylaws',
  'documents/constitution',
  'documents/meeting-minutes',
]

exports.handler = async (event) => {
  try {
    console.log('Event:', JSON.stringify(event, null, 2));

    // Extract parameters from event
    const {
      prefix = '',
      maxKeys = 100,
      continuationToken = null
    } = event.queryStringParameters || {};

    if (!validPaths.includes(prefix)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid prefix parameter.' })
      };
    }

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
      listResponse.Contents.map(async (item) => {
        const getObjectCommand = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: item.Key
        });
        const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: SIGNED_URL_EXPIRATION });
        return {
          key: item.Key,
          lastModified: item.LastModified,
          size: item.Size,
          storageClass: item.StorageClass,
          signedUrl: signedUrl
        };
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({
        objects: objectsWithSignedUrls,
        isTruncated: listResponse.IsTruncated,
        nextContinuationToken: listResponse.NextContinuationToken || null,
        totalCount: listResponse.KeyCount || 0
      })
    };
  } catch (error) {
    console.error('Error listing S3 objects:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({ message: 'Internal server error.' })
    };
  }
};

