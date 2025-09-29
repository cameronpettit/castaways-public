/**
 * Builds the CloudFront resources for the Castaways FC Public Site stack.
 */

const cloudfront = require('aws-cdk-lib/aws-cloudfront');
const origins = require('aws-cdk-lib/aws-cloudfront-origins');
const { CfnOutput, Duration } = require('aws-cdk-lib');

function cloudFrontSetup(scope, props) {
  console.log('Setting up CloudFront resources...');

  /**
   * Creates a new CloudFront S3 Origin Access Control (OAC) for the Castaways FC site.
   * This OAC is used to securely grant CloudFront access to the S3 bucket origin.
   *
   * @type {cloudfront.S3OriginAccessControl}
   * @param {Construct} scope - The CDK construct scope in which this resource is defined.
   * @param {string} id - The unique identifier for this OAC construct.
   * @param {Object} props - The properties for configuring the OAC.
   * @param {string} props.description - A description for the OAC.
   */
  const castawaysfcOAC = new cloudfront.S3OriginAccessControl(scope, 'CastawaysFCOAC', {
    description: 'Castaways FC Site Origin Access Control (CDK)',
  });

  /**
   * Creates a CloudFront CachePolicy with the following configuration:
   * - Name: 'CastawaysFCCachePolicy'
   * - Caches all query string parameters.
   * - Does not cache cookies.
   * - Sets default TTL for cached responses to 1 hour.
   * - Sets minimum TTL to 1 minute.
   * - Sets maximum TTL to 2 hours.
   * - Enables Brotli and Gzip compression for cached responses.
   *
   * @constant
   * @type {cloudfront.CachePolicy}
   */
  const cachePolicy = new cloudfront.CachePolicy(scope, 'CastawaysFCCachePolicy', {
    cachePolicyName: 'CastawaysFCCachePolicy',
    queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(), // Cache all query strings
    cookieBehavior: cloudfront.CacheCookieBehavior.none(), // Do not cache cookies
    defaultTtl: Duration.hours(1), // Default TTL for cached responses
    minTtl: Duration.minutes(1), // Minimum TTL for cached responses
    maxTtl: Duration.hours(2), // Maximum TTL for cached responses
    enableAcceptEncodingBrotli: true, // Enable Brotli compression
    enableAcceptEncodingGzip: true, // Enable Gzip compression
  });

  /**
   * Creates an AWS CloudFront Distribution for the Castaways FC public site.
   *
   * @constant
   * @type {cloudfront.Distribution}
   * @param {cdk.Construct} scope - The CDK construct scope in which this distribution is defined.
   * @param {string} id - The unique identifier for this distribution.
   * @param {Object} props - The properties required to configure the distribution.
   * @param {s3.Bucket} props.castawaysFCDistBucket - The S3 bucket serving as the origin for the distribution.
   * @param {cloudfront.OriginAccessControl} castawaysfcOAC - The Origin Access Control for secure S3 access.
   * @param {s3.Bucket} props.castwaysfcLogsBucket - The S3 bucket for storing CloudFront access logs.
   *
   * @description
   * - Enables HTTP/2 and HTTPS redirection.
   * - Restricts access to users from Canada only (geo-restriction).
   * - Sets up caching and compression for optimized delivery.
   * - Handles 403 and 404 errors by serving the SPA entry point (`index.html`).
   * - Configures CORS to allow all origins.
   * - Logs requests to the specified S3 bucket without including cookies.
   * - Uses the S3 bucket as the origin with a specific path and access control.
   */
  const castawaysfcDistribution = new cloudfront.Distribution(scope, 'CastawaysFCDistribution', {
    enabled: true, // Enable the distribution
    httpVersion: cloudfront.HttpVersion.HTTP2, // Use HTTP/2 for better performance
    defaultBehavior: {
      origin: origins.S3BucketOrigin.withOriginAccessControl(props.castawaysfcDistBucket, {
        originPath: 'latest/castaways-public/browser',
        originAccessControl: castawaysfcOAC,
      }),
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS, // Allow GET, HEAD, and OPTIONS methods
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD, // Cache GET and HEAD methods
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, // Redirect HTTP to HTTPS
      responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS, // Allow CORS for all origins
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED, // Use the optimized cache policy
    },
    comment: 'Castaways FC Public Distribution (CDK)',
    compress: true, // Enable compression for better performance
    priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // Use Price Class 100 for cost efficiency
    // whitelist the countries that can access the distribution. Only Canada is allowed.
    geoRestriction: cloudfront.GeoRestriction.whitelist(
      'CA'
    ),
    defaultRootObject: 'index.html', // Default root object for the distribution
    errorResponses: [
      {
        httpStatus: 403,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
      },
      {
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
      },
    ],
    logBucket: props.castwaysfcLogsBucket, // S3 bucket for access logs
    logIncludesCookies: false, // Do not include cookies in logs
  });

  const castawaysfcFileHosting = new cloudfront.Distribution(scope, 'CastawaysFCFileHosting', {
    enabled: true, // Enable the distribution
    httpVersion: cloudfront.HttpVersion.HTTP2, // Use HTTP/2 for better performance
    defaultBehavior: {
      origin: origins.S3BucketOrigin.withOriginAccessControl(props.castawaysfcDistBucket, {
        originPath: 'docs/',
        originAccessControl: castawaysfcOAC,
      }),
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS, // Allow GET, HEAD, and OPTIONS methods
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD, // Cache GET and HEAD methods
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, // Redirect HTTP to HTTPS
      responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS, // Allow CORS for all origins
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED, // Use the optimized cache policy
    },
    comment: 'Castaways FC Public Distribution (CDK)',
    compress: true, // Enable compression for better performance
    priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // Use Price Class 100 for cost efficiency
    // whitelist the countries that can access the distribution. Only Canada is allowed.
    geoRestriction: cloudfront.GeoRestriction.whitelist(
      'CA'
    ),
    defaultRootObject: 'index.html', // Default root object for the distribution
    errorResponses: [
      {
        httpStatus: 403,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
      },
      {
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
      },
    ],
    logBucket: props.castwaysfcLogsBucket, // S3 bucket for access logs
    logIncludesCookies: false, // Do not include cookies in logs
  });

  // Outputs

  new CfnOutput(scope, 'Castaways FC Domain Name', {
    value: castawaysfcDistribution.domainName,
    description: 'Castaways FC Domain Name Reference',
    exportName: 'CastawaysFCDomainName',
  });

  new CfnOutput(scope, 'Castaways FC File Hosting Domain', {
    value: castawaysfcFileHosting.domainName,
    description: 'Castaways FC File Hosting Domain Name Reference',
    exportName: 'CastawaysFCFileHostingDomainName',
  });

  new CfnOutput(scope, 'Castaways FC Cache Policy', {
    value: cachePolicy.cachePolicyId,
    description: 'Castaways FC Cache Policy Reference',
    exportName: 'CastawaysFCCachePolicy',
  });

  return {
    castawaysfcDistribution: castawaysfcDistribution,
  };
}

module.exports = {
  cloudFrontSetup
};