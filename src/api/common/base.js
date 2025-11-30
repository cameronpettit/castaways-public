/**
 * Constructs a response object with the provided parameters.
 * @param {number} code - The HTTP status code of the response.
 * @param {*} data - The data payload of the response.
 * @param {string} message - The message associated with the response.
 * @param {string|null} error - The error message, if any, associated with the response.
 * @param {*} context - Additional context or metadata related to the response.
 * @param {*} [other=null] - Additional fields to include in the response body.
 * @returns {object} - The constructed response object.
 */
const sendResponse = function (code, data, message, error, context, other = null) {
  // All responses must include the following fields as a minimum.
  let body = {
    code: code,
    data: data,
    msg: message,
    error: error,
    context: context
  };
  // If other fields are present, attach them to the body.
  if (other) {
    body = Object.assign(body, other);
  }
  const response = {
    statusCode: code,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body),
  };
  return response;
};

module.exports = { sendResponse };