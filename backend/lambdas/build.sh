#!/bin/bash

set -e # set exit on any error

[[ "$@" =~ 'debug' ]] && set -x     #   runs script in debug mode when parameter is present 

#   this script was called from this dir
callerdir=`pwd`

#   this script is located in this dir
scriptdir=$(dirname -- $( readlink -f -- "$0"))

pushd .

#   make sure to run in the scriptdir, now we can think in relative paths
cd $scriptdir

find . -maxdepth 2 -name "package.json" -type f | while read folder
do
    pushd .
        buildfolder=$(dirname -- $( readlink -f -- "$folder"))
        cd $buildfolder
        echo "Building: $PWD"
        npm i
        npm run build
        echo "Package to: ../$componentname.zip"
        componentname=`echo $folder | cut -d "/" -f 2`
        cd dist
        zip -r ../$componentname.zip .
    popd
done

popd