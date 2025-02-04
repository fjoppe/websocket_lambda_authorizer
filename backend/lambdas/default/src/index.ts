import {
  APIGatewayProxyEventBase,
  APIGatewayEventWebsocketRequestContextV2,
  Context,
} from "aws-lambda";
import * as apigwmanagementapi from "@aws-sdk/client-apigatewaymanagementapi";

const AWS_REGION = process.env.AWS_REGION!;
const WS_ENDPOINT = process.env.WS_ENDPOINT!;

const client = new apigwmanagementapi.ApiGatewayManagementApi({
  region: AWS_REGION,
  endpoint: WS_ENDPOINT.replace("wss://", "https://"),
});

export async function handler(
  event: APIGatewayProxyEventBase<APIGatewayEventWebsocketRequestContextV2>,
  context: Context
) {
  console.log("WS Default");
  console.log(JSON.stringify(event));

  const connectionId = event.requestContext.connectionId;

  await client.postToConnection({
    ConnectionId: connectionId,
    Data: Buffer.from(
      JSON.stringify({
        type: "echo",
        data: `Echo back from server: ${event.body}`,
      })
    ),
  });

  return {
    statusCode: 200,
    body: "OK",
  };
}
