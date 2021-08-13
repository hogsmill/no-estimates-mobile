#!/bin/bash

FORCE=false
OUTDATED=true
while [ $1 ]
do
  echo $1
  if [ "$1" == "-f" ]; then
    FORCE=true
  fi
  if [ "$1" == "-o" ]; then
    OUTDATED=false
  fi
  shift
done

REPO="https://github.com/hogsmill/no-estimates-mobile.git"
APPS=(
  'no-estimates-mobile,noEstimatesGames,noEstimates,3007,3018,No Estimates'
  'no-estimates-mobile-new,noEstimatesNewGames,noEstimatesNew,3020,3021,No Estimates,No Estimates Private'
  'no-estimates-mobile-dex,noEstimatesDexGames,noEstimatesDex,3051,3052,No Estimates,No Estimates Dex'
  'no-estimates-mobile-ratesetter,noEstimatesRateSetterGames,noEstimatesRateSetter,3057,3073,No Estimates,No Estimates Ratesetter'
  'no-estimates-mobile-eagile,noEstimatesEverydayAgileGames,noEstimatesEverydayAgile,3065,3075,No Estimates,No Estimates Ratesetter'
  'kanban-playground-mobile,kanbanPlaygroundGames,kanbanPlayground,3030,3031,Kanban Playground'
  'kanban-playground-mobile-ratesetter,kanbanPlaygroundRateSetterGames,kanbanPlaygroundRateSetter,3058,3074,Kanban Playground'
  'kanban-playground-mobile-eagile,kanbanPlaygroundEverydayAgileGames,kanbanPlaygroundEverydayAgile,3066,3076,Kanban Playground'
)

for ((i = 0; i < ${#APPS[@]}; i++))
do
  REC="${APPS[$i]}"

  APP=`echo $REC | cut -d, -f1`
  GAMECOLLECTION=`echo $REC | cut -d, -f2`
  COLLECTION=`echo $REC | cut -d, -f3`
  GAMEPORT=`echo $REC | cut -d, -f4`
  PORT=`echo $REC | cut -d, -f5`
  APPTYPE=`echo $REC | cut -d, -f6`
  APPNAME=`echo $REC | cut -d, -f7`

  echo "------------------------------------------------"
  if [ -z "$APPNAME" ]; then
    echo "Installing $APPTYPE:$APP ($GAMECOLLECTION, $COLLECTION, $PORT, $GAMEPORT)"
  else
    echo "Installing $APPTYPE:$APP ($GAMECOLLECTION, $COLLECTION, $PORT, $GAMEPORT, $APPNAME)"
  fi
  echo "------------------------------------------------"

  DIR="/usr/apps/$APP"
  if [ ! -d $DIR ]; then
    git clone $REPO $DIR
  fi
  ENVFILE="$DIR/.env"
  echo "VUE_APP_PORT=$PORT" > $ENVFILE
  echo "VUE_APP_TYPE=$APPTYPE" >> $ENVFILE
  echo "VUE_APP_GAME_PORT=$GAMEPORT" >> $ENVFILE
  echo "VUE_APP_COLLECTION=$COLLECTION" >> $ENVFILE
  echo "VUE_APP_GAME_COLLECTION=$GAMECOLLECTION" >> $ENVFILE
  if [ ! -z "$APPNAME" ]; then
    echo "VUE_APP_NAME=$APPNAME" >> $ENVFILE
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

  npm install --legacy-peer-deps
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

if [ "$OUTDATED" == "true" ]; then
  php /usr/apps/monitor/src/lib/outdated.php &
fi
