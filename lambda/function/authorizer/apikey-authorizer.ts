import {
  APIGatewayRequestAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from "aws-lambda";

const apiKey = "";

const generateAuthorizerResult = (
  effect: string,
  resource: string,
): APIGatewayAuthorizerResult => {
  const result = {
    principalId: "Authorizer",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  } as APIGatewayAuthorizerResult;

  return result;
};

export const handler = async (
  event: APIGatewayRequestAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  const headerApiKey = event?.headers?.["x-api-key"] ?? "";
  console.log(`API Key: ${headerApiKey}`);

  const isValidApiKey = headerApiKey === apiKey;

  if (!isValidApiKey) {
    return generateAuthorizerResult("Deny", event.methodArn);
  }
  return generateAuthorizerResult("Allow", event.methodArn);
};
