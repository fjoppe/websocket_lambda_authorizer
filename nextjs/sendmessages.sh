#!/bin/bash

set -e # set exit on any error

[[ "$@" =~ 'debug' ]] && set -x     #   runs script in debug mode when parameter is present 

#   this script was called from this dir
callerdir=`pwd`

#   this script is located in this dir
scriptdir=$(dirname -- $( readlink -f -- "$0"))
infradir=$scriptdir/../infra

#   Check prerequirement: aws cli must be installed
awsversion=$(aws --version) # exits if error

#   Check prerequirement: aws cli must be configured
if ! [ -z "$(aws configure get region ||:)" ]
then
    echo "aws cli is properly configured."
else
    echo "aws cli is not properly configured, configure credentials and region with 'aws configure', then rerun this script"
    exit 1
fi


region=$(aws configure get region)

apiId=$(aws apigatewayv2 get-apis --query "Items[?Name=='nxt-ws-apigateway'].ApiId" --output text)


wsEndpoint="https://$apiId.execute-api.$region.amazonaws.com/stage/"


#   Use a random bucket name, store in ".bucketname"
if ! [ -f $infradir/.bucketname ]
then
    echo "Missing bucket name, first run /infra/deploy.sh"
    exit 1
fi

export bucketname=$(cat $infradir/.bucketname)
echo "Bucket name: $bucketname"

pushd .

if [ -z "$(aws s3api head-object --bucket $bucketname --key wsConnectionId 2>/dev/null ||:)" ]
then
    echo "ConnectionId not found, first connect to the websocket with the nextjs application, run.sh"
    exit 1
fi

cd $scriptdir

aws s3api get-object --bucket $bucketname --key wsConnectionId .connectionId

export connectionId=$(cat .connectionId)

echo "ConnectionId: $connectionId"

find ./server-messages -name "*.json" | sort -z | while read fn
do
    echo "Processing: $fn"
    sleep 1
    aws apigatewaymanagementapi post-to-connection --data $(base64 -w 0 $fn) --connection-id $connectionId --endpoint-url $wsEndpoint
done

popd