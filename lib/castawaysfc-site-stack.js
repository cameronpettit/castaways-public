const { Stack, CfnOutput } = require('aws-cdk-lib');

// CDK Resources
const { s3Setup } = require('./cdk/s3');
const { cloudFrontSetup } = require('./cdk/cloudfront');
const { apiSetup } = require('./cdk/api');
const { PingApiConstruct } = require('../src/api/ping/constructs');
const { S3AccessConstruct } = require('../src/api/s3/constructs');

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'castaways-public';


class CastawaysfcSiteStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // if offline, merge env vars
    if (props.env.IS_OFFLINE === 'true') {
      console.log('Running offline...');
      props.env = {
        ...process.env,
        ...props.env,
      };
      delete props.env.AWS_REGION;
      delete props.env.AWS_ACCESS_KEY_ID;
      delete props.env.AWS_SECRET_ACCESS_KEY;
    }


    // S3 setup
    const s3Resources = s3Setup(this, {
      env: props.env,
    });

    // CloudFront setup
    const cloudFrontResources = cloudFrontSetup(this, {
      env: props.env,
      castawaysFCDistBucket: s3Resources.castawaysfcDistBucket,
      castwaysfcLogsBucket: s3Resources.castwaysfcLogsBucket,
    });

    // API Gateway setup
    const apiResources = apiSetup(this, {
      env: props.env
    });

    // LAMBDAS

    // Ping
    new PingApiConstruct(this, 'PingApiFunction', {
      api: apiResources.api,
      environment: {
      }
    });

    new S3AccessConstruct(this, 'S3AccessFunction', {
      api: apiResources.api,
      bucket: s3Resources.castawaysfcDistBucket,
      environment: {
        S3_BUCKET_NAME: S3_BUCKET_NAME,
      }
    });


    new CfnOutput(this, 'ApiGatewayUrl', {
      value: apiResources.api.url,
      description: 'Base URL for the Castaways FC API'
    });
  }
}

module.exports = { CastawaysfcSiteStack };
