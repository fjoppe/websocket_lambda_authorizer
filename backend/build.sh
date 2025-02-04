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


pushd .
cd $scriptdir

./lambdas/build.sh $@

packagedir=$scriptdir/../infra/terraform/.packages
if ! [ -d $packagedir ]
then
    mkdir -p $packagedir
fi
find ./lambdas -maxdepth 3 -name "*.zip" | while read package
do
    mv $package $packagedir/
done

popd