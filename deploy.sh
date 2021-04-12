#!/bin/bash

if [ "$1" == "-f" ]; then
  FORCE=true
fi

REPO="https://github.com/hogsmill/no-estimates-mobile.git"
APPS=('no-estimates-mobile' 'no-estimates-mobile-new')
for APP in ${APPS[@]};
do
  echo "------------------------------------------------"
  echo "Installing $APP"
  echo "------------------------------------------------"

  DIR="/usr/apps/$APP"
  if [ ! -d $DIR ];then
    git clone $REPO $DIR
  fi
  cd $DIR

  PORT=3007
  PWD=`pwd`
  APP=`basename $PWD`
  git stash
  GIT=`git pull`
  echo $GIT
  if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
    exit 0
  fi

  npm install
  npm run build
  if [ ! -d /var/www/html/$APP/ ]; then
    mkdir /var/www/html/$APP
  fi
  if [ -d /var/www/html/$APP/css ]; then
    rm /var/www/html/$APP/css/*
  else
    mkdir /var/www/html/$APP/css
  fi
  if [ -d /var/www/html/$APP/js ]; then
    rm /var/www/html/$APP/js/*
  else
    mkdir /var/www/html/$APP/js
  fi
  cp -R dist/* /var/www/html/$APP
  if [ -f "src/server.js" ]; then
    SERVER=`ps -ef | grep server.js | grep "/$APP/" | awk {'print $2'}`
    if [ "$SERVER" != "" ]; then
      kill -9 $SERVER
    fi
  fi

done

php /usr/apps/monitor/src/lib/outdated.php &
