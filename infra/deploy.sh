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


#   Use a random bucket name, store in ".bucketname"
if ! [ -f $scriptdir/.bucketname ]
then
    random_name=$(cat /dev/urandom | tr -cd 'a-f0-9' | head -c 8)
    echo "nxjs-websocket-$random_name" > $scriptdir/.bucketname
    echo "Generated unique bucket name"
else
    echo "Unique bucket name already generated"
fi

export bucketname=$(cat $scriptdir/.bucketname)
echo "Unique bucket name: $bucketname"

if [ -z "$(aws s3api head-bucket --bucket $bucketname 2>/dev/null ||: )" ]
then
    echo "Bucket does not exist, creating: $bucketname"
    aws s3api create-bucket --bucket $bucketname --region $region --create-bucket-configuration LocationConstraint=$region
    aws s3api put-bucket-versioning --bucket $bucketname --region $region --versioning-configuration "MFADelete=Disabled,Status=Enabled"
fi

pushd .
cd $scriptdir

./terraform/deploy.sh

popd