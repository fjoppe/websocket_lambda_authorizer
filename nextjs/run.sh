#!/bin/bash

set -e # set exit on any error

[[ "$@" =~ 'debug' ]] && set -x     #   runs script in debug mode when parameter is present 

#   this script was called from this dir
callerdir=`pwd`

#   this script is located in this dir
scriptdir=$(dirname -- $( readlink -f -- "$0"))


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

apiiId=$(aws apigatewayv2 get-apis --query "Items[?Name=='nxt-ws-apigateway'].ApiId" --output text)

wsBaseEndpoint=$(aws apigatewayv2 get-api --api-id $apiiId --query "ApiEndpoint" --output text)
export NEXT_PUBLIC_wsEndpoint=$wsBaseEndpoint/stage

if [ -z $wsBaseEndpoint ]
then
    echo "Could not find websocket endpoint, did you run deploy first?"
    exit 1
else
    echo "Websocket base endpoint: $wsEndpoint"
fi

pushd .

cd $scriptdir
npm i
npm run dev

popd