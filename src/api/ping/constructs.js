const { Duration } = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');
const { NodejsFunction } = require('aws-cdk-lib/aws-lambda-nodejs');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const { Construct } = require('constructs');

class PingApiConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, 'PingApiConstruct');

    const api = props?.api;

    if (!api) {
      throw new Error('PingApiConstruct: Missing required property "api" in props');
    }

    this.testLambdaFunction = new NodejsFunction(scope, id, {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'src/api/ping/GET/index.js',
      description: `Pings the api to ensure it is working`,
      functionName: id,
      bundling: {
        externalModules: ['aws-sdk'],
      },
      timeout: Duration.seconds(10),
    });

    this.pingResource = api.root.addResource('ping');

    this.pingResource.addMethod('GET', new apigateway.LambdaIntegration(this.testLambdaFunction));
  }
}

module.exports = {
  PingApiConstruct,
};