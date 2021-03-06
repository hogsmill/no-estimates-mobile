#!/bin/bash

if [ "$1" == "-f" ]; then
  FORCE=true
fi

PORT=3007
PWD=`pwd`
APP=`basename $PWD`
GIT=`git pull`
echo $GIT
if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
  exit 0
fi

npm run build
rm /var/www/html/$APP/css/*
rm /var/www/html/$APP/js/*
cp -R dist/* /var/www/html/$APP
if [ -f "src/server.js" ]; then
  SERVER=`ps -ef | grep server.js | grep $PORT | awk {'print $2'}`
  if [ "$SERVER" != "" ]; then
    kill -9 $SERVER
  fi
  KEEP=`ps -ef | grep keep.sh | grep $PORT | awk {'print $2'}`
  if [ "$KEEP" != "" ]; then
    kill -9 $KEEP
  fi
fi
