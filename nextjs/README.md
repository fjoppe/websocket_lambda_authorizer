# Running the NextJS client in a web-browser

Prerequisite: deploy the backend before running the scripts in this dir.

This folder contains:

- A simple NextJS client application, which retrieves the websocket-url from the environment;
- scripts to run the NextJS application and send messages to the client;

Make sure to run the following in the right order:

1. start a bash terminal in the `nextjs` folder and run `./run.sh`
2. open the application in a browser at (in some cases, it may run on a different port): http://localhost:3000
3. in the client application, follow the instructions and connect to the webSocket;
4. start a new bash terminal in the `nextjs` folder and run `./sendmessages.sh`

## Remarks

The script `sendmessages.sh` retrieves the `connectionId` from the random s3 bucket created for this demo. This value should be written to the s3 bucket in the `connect` lambda, when client-connection succeeds.

It then sends messages from sub-folder `server-messages` to the target endpoint, which should arrive at the client.
