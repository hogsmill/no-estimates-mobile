#!/bin/bash

if [ "$1" == "-f" ]; then
  FORCE=true
fi

REPO="https://github.com/hogsmill/no-estimates-mobile.git"
APPS=(
  'no-estimates-mobile,noEstimatesGames,noEstimates,3007'
  'no-estimates-mobile-new,noEstimatesNewGames,noEstimatesNew,3020,No Estimates Private,123456'
)

for REC in ${APPS[@]};
do
  APP=`echo $REC | cut -d, -f1`
  COLLECTION=`echo $REC | cut -d, -f2`
  GAMECOLLECTION=`echo $REC | cut -d, -f3`
  PORT=`echo $REC | cut -d, -f4`
  APPNAME=`echo $REC | cut -d, -f5`
  PASSWORD=`echo $REC | cut -d, -f6`

  echo "------------------------------------------------"
  echo "Installing $APP ($COLLECTION, $GAMECOLLECTION, $PORT, $PASSWORD)"
  echo "------------------------------------------------"

  DIR="/usr/apps/$APP"
  if [ ! -d $DIR ];then
    git clone $REPO $DIR
    $ENVFILE="$DIR/.env"
    if [ ! -f $ENVFILE ];then
      echo "VUE_APP_PORT=$PORT" > $ENVFILE
      echo "VUE_APP_COLLECTION=$COLLECTION" >> $ENVFILE
      echo "VUE_APP_GAME_COLLECTION=$GAMECOLLECTION" >> $ENVFILE
      if [ ! -z $APPNAME ]; then
        echo "VUE_APP_NAME=$APPNAME" >> $ENVFILE
      fi
      if [ ! -z $PASSWORD ]; then
        echo "VUE_APP_PASSWORD=$PASSWORD" >> $ENVFILE
      fi
    fi
  fi
  cd $DIR

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
