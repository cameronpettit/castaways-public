const { Duration } = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');
const { NodejsFunction } = require('aws-cdk-lib/aws-lambda-nodejs');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const { Construct } = require('constructs');

class S3AccessConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, 'S3AccessConstruct');

    const api = props?.api;
    const bucket = props?.bucket;

    if (!api) {
      throw new Error('S3AccessConstruct: Missing required property "api" in props');
    }

    if (!bucket) {
      throw new Error('S3AccessConstruct: Missing required property "bucket" in props');
    }

    this.s3GetAccessFunction = new NodejsFunction(scope, id, {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'src/api/s3/GET/index.js',
      description: `Gets signed S3 object URLs from the specified bucket`,
      functionName: id,
      bundling: {
        externalModules: ['aws-sdk'],
      },
      timeout: Duration.seconds(10),
      environment: {
        ...props.environment,
      },
    });

    // Grant the Lambda function read permissions to the S3 bucket
    bucket.grantRead(this.s3GetAccessFunction);

    this.s3Resource = api.root.addResource('s3');

    this.s3Resource.addMethod('GET', new apigateway.LambdaIntegration(this.s3GetAccessFunction));
  }
}

module.exports = {
  S3AccessConstruct,
};