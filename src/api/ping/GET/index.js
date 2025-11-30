const { sendResponse } = require('../../common/base');

const apiName = process.env.API_NAME || 'Api';

exports.handler = async (event, context) => {
  console.log(`Event: ${JSON.stringify(event)}`);
  try{
    return sendResponse(200, `${apiName} ping success.`, 'Success', null, context);
  } catch (err) {
    console.log('Error in ping handler:', err);
    return sendResponse(400, [], 'Error', err, context);
  }
};