const { RestApi, LambdaIntegration, Cors } = require('aws-cdk-lib/aws-apigateway');
const { Duration } = require('aws-cdk-lib');

/**
 * Sets up API Gateway for Lambda functions
 * @param {Stack} stack - CDK Stack
 * @param {Object} props - Configuration properties
 * @returns {Object} API Gateway resources
 */
function apiSetup(stack, props) {
  const { env, lambdaFunctions } = props;

  // Create REST API
  const api = new RestApi(stack, 'CastawaysAPI', {
    restApiName: 'Castaways FC API',
    description: 'API for Castaways FC operations',
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token']
    }
  });

  return {
    api,
  };
}

module.exports = { apiSetup };