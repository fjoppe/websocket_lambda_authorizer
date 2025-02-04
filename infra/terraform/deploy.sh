#!/bin/bash

set -e # set exit on any error

[[ "$@" =~ 'debug' ]] && set -x     #   runs script in debug mode when parameter is present 

#   this script was called from this dir
callerdir=`pwd`

#   this script is located in this dir
scriptdir=$(dirname -- $( readlink -f -- "$0"))

pushd .
cd $scriptdir

if ! [ -d .terraform ]
then
    terraform init
fi

terraform apply -var "bucket_name=$bucketname" 

popd