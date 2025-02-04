import {
  APIGatewayProxyEventBase,
  APIGatewayEventWebsocketRequestContextV2,
  Context,
} from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({});
const bucketname = process.env.bucketname!;

export async function handler(
  event: APIGatewayProxyEventBase<APIGatewayEventWebsocketRequestContextV2>,
  context: Context
) {
  console.log(`WS Connect, event: ${JSON.stringify(event)}`);

  console.log(`connectionId: ${event.requestContext.connectionId}`);
  const keyname = "wsConnectionId";

  const command = new PutObjectCommand({
    Bucket: bucketname,
    Key: keyname,
    Body: event.requestContext.connectionId,
  });

  try {
    const response = await client.send(command);
  } catch (error) {
    console.error(error);
  }

  return {
    statusCode: 200,
    body: "OK",
  };
}
