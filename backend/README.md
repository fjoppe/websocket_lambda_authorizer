# Build backend

The scripts in this folder compile the source code of the AWS backend.

## Build

To build the lambdas, in a bash terminal, in the `backend` folder:

```bash
./build.sh
```

## Remarks

A random bucket name is created in the `deploy.sh` script and provided via the Lambda's environment variables.
The `connect` and `disconnect` lambdas store/delete the `connectionId` in the s3 bucket created.
This `connectionId` is later used in the `sendmessages.sh` script as send-destination.
