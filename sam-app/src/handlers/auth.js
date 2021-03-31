// For input reference
// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-input.html
// And for output reference
// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html

function getAllowResponse(principal, resourceArn, apiKey) {
  return {
    principalId: principal, // The principal user identification associated with the token sent by the client.
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: resourceArn,
        },
      ],
    },
    usageIdentifierKey: apiKey,
  };
}

function getDenyResponse(principal, resourceArn) {
  return {
    principalId: principal, // The principal user identification associated with the token sent by the client.
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "DENY",
          Resource: resourceArn,
        },
      ],
    }
  };
}

exports.handler = async (inputObj) => {
  const tok = inputObj.authorizationToken;
  const resourceArn = inputObj.methodArn;
  if (tok && tok.toLowerCase() == "letmein") {
    return getAllowResponse("UNKNOWN", resourceArn, "THE-API-KEY")
  }
  return getDenyResponse("UNKNOWN", resourceArn);
};
