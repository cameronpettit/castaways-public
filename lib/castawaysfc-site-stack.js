const { Stack } = require('aws-cdk-lib');

// CDK Resources
const { s3Setup } = require('./cdk/s3');
const { cloudFrontSetup } = require('./cdk/cloudfront');

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
      castawaysfcDistBucket: s3Resources.castawaysfcDistBucket,
      castwaysfcLogsBucket: s3Resources.castwaysfcLogsBucket,
      castawaysfcFilesBucket: s3Resources.castawaysfcFilesBucket,
    });
  }
}

module.exports = { CastawaysfcSiteStack };
