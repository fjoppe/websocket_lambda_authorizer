import { APIGatewayRequestAuthorizerEvent, Context } from "aws-lambda";

export async function handler(
  event: APIGatewayRequestAuthorizerEvent,
  context: Context
) {
  console.log("Authorizer");

  const { queryStringParameters } = event;

  const receivedToken = queryStringParameters!["token"];
  console.log(`Received toke: ${receivedToken}`);

  const correctToken = "123";

  const permission = correctToken === receivedToken ? "Allow" : "Deny";

  console.log(`Authorized: ${permission}`);

  //  always allow
  const policy = {
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: ["execute-api:Invoke"],
          Effect: permission,
          Resource: [event.methodArn],
        },
      ],
    },
    principalId: "user",
    context: null, //  has to be null
  };

  console.log(JSON.stringify(policy));
  return policy;
}
