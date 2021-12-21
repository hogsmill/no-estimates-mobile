#!/bin/bash

FORCE=false
NEW=false
while [ $1 ]
do
  echo $1
  if [ "$1" == "-f" ]; then
    FORCE=true
  fi
  shift
done

BASEPORT=4450
REPO="https://github.com/hogsmill/no-estimates-mobile.git"
BASEAPP="no-estimates-mobile"
MAINNOESTIMATESAPP="no-estimates-mobile"
MAINNOESTIMATESCOLLECTION="noEstimates"
MAINNOESTIMATESGAMECOLLECTION="noEstimatesGames"
MAINNOESTIMATESAPPNAME="No Estimates"
MAINKANBANAPP="kanban-playground-mobile"
MAINKANBANCOLLECTION="kanbanPlayground"
MAINKANBANGAMECOLLECTION="kanbanPlaygroundGames"
MAINKANBANAPPNAME="Kanban Playground"

# Note: Thes e*must* be the same as noestimates routes to calculate GAMEPORT correctly

ROUTES=(
  '','','No Estimates'
  'new','New','No Estimates'
  'dex','Dex','No Estimates'
  'zoran','Zoran',,'No Estimates'
  'abn','Abn','No Estimates'
  'ratesetter','Ratesetter','No Estimates'
  'eagile','EverydayAgile','No Estimates'
  'and','And','No Estimates'
  'richemont','Richemont','No Estimates'
  'bud','Bud','No Estimates'
  'matt-phillip','Matt Phillip','No Estimates'
  '','','Kanban Playground'
  'new','New','Kanban Playground'
  'dex','Dex','Kanban Playground'
  'zoran','Zoran','Kanban Playground'
  'abn','Abn','Kanban Playground'
  'ratesetter','Ratesetter','Kanban Playground'
  'eagile','EverydayAgile','Kanban Playground'
  'and','And','Kanban Playground'
  'richemont','Richemont','Kanban Playground'
  'bud','Bud','Kanban Playground'
  'matt-phillip','Matt Phillip','Kanban Playground'
)

for ((i = 0; i < ${#ROUTES[@]}; i++))
do
  REC="${ROUTES[$i]}"
  ROUTE=`echo $REC | cut -d, -f1`
  COLLECTIONSUFFIX=`echo $REC | cut -d, -f2`
  APPTYPE=`echo $REC | cut -d, -f3`

  if [ "$APPTYPE" == "No Estimates" ]; then
    APP=$MAINNOESTIMATESAPP
    COLLECTION=$MAINNOESTIMATESCOLLECTION
    GAMECOLLECTION=$MAINNOESTIMATESGAMECOLLECTION
    APPNAME=$MAINNOESTIMATESAPPNAME
  fi

  if [ "$APPTYPE" == "Kanban Playground" ]; then
    APP=$MAINKANBANAPP
    COLLECTION=$MAINKANBANCOLLECTION
    GAMECOLLECTION=$MAINKANBANGAMECOLLECTION
    APPNAME=$MAINKANBANAPPNAME
  fi

  if [ "$ROUTE" != "" ]; then
    APP="${APP}-${ROUTE}"
  fi
  if [ "$COLLECTIONSUFFIX" != "" ]; then
    COLLECTION="${COLLECTION}${COLLECTIONSUFFIX}"
  fi
  if [ "$COLLECTIONSUFFIX" != "" ]; then
    GAMECOLLECTION="${GAMECOLLECTION}${COLLECTIONSUFFIX}"
  fi
  let PORT=$BASEPORT+$i
  let GAMEPORT=$PORT-100

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

  rm $DIR/package-lock.json
  rm -rf $DIR/node_modules

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
  if [ $i == 0 ]; then
      rm -rf $DIR/node_modules/.cache
    else
      rm -rf node_modules
      ln -s ../$BASEAPP/node_modules node_modules
    fi
    rm -rf $DIR/dist
done

ps -ef | grep php | grep outdated
if [ $? -eq 1 ]; then
  php /usr/apps/monitor/src/lib/outdated.php &
fi
