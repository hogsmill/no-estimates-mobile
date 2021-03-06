
const teamFuns = require('./lib/teams.js')
const cardFuns = require('./lib/cards.js')
const pairingFuns = require('./lib/pairing.js')
const dependent = require('./lib/dependent.js')
const chat = require('./lib/chat.js')
const gameState = require('./lib/gameState.js')
const sourceFuns = require('./lib/sources.js')
const dbUpdate = require('./db/dbUpdate.js')

const initialTeams = [
  { name: 'Blue', include: true },
  { name: 'Green', include: true },
  { name: 'Purple', include: true },
  { name: 'Red', include: true },
  { name: 'Orange', include: false },
  { name: 'Black', include: false },
  { name: 'Grey', include: false },
  { name: 'Brown', include: false },
  { name: 'Magenta', include: false },
  { name: 'Salmon', include: false },
  { name: 'Teal', include: false },
  { name: 'Turquoise', include: false },
  { name: 'Navy', include: false },
  { name: 'Olive', include: false },
  { name: 'Turquoise', include: false },
  { name: 'Tan', include: false }
]

const initialColumns = [
  {name: 'design', order: 1, cards: []},
  {name: 'develop', order: 2, cards: []},
  {name: 'test', order: 3, cards: []},
  {name: 'deploy', order: 4, cards: []},
  {name: 'done', order: 5, cards: []}
]

const initialCards = [
  {number: 1, design: 6, develop: 7, test: 8, deploy: 2, urgent: false, teamDependency: 0},
  {number: 2, design: 0, develop: 8, test: 6, deploy: 4, urgent: false, teamDependency: 0},
  {number: 3, design: 10, develop: 9, test: 9, deploy: 3, urgent: true, teamDependency: 0},
  {number: 4, design: 4, develop: 9, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0},
  {number: 5, design: 4, develop: 10, test: 5, deploy: 2, urgent: false, teamDependency: 4, dependencyDone: 0},
  {number: 6, design: 1, develop: 8, test: 2, deploy: 5, urgent: false, teamDependency: 0},
  {number: 7, design: 1, develop: 10, test: 3, deploy: 1, urgent: false, teamDependency: 0},
  {number: 8, design: 0, develop: 4, test: 3, deploy: 5, urgent: false, teamDependency: 0},
  {number: 9, design: 10, develop: 4, test: 10, deploy: 6, urgent: false, teamDependency: 0},
  {number: 10, design: 1, develop: 7, test: 10, deploy: 8, urgent: true, teamDependency: 4, dependencyDone: 0},
  {number: 11, design: 8, develop: 10, test: 10, deploy: 1, urgent: false, teamDependency: 0},
  {number: 12, design: 3, develop: 8, test: 11, deploy: 3, urgent: false, teamDependency: 0},
  {number: 13, design: 0, develop: 6, test: 9, deploy: 4, urgent: false, teamDependency: 0},
  {number: 14, design: 1, develop: 6, test: 3, deploy: 1, urgent: false, teamDependency: 0},
  {number: 15, design: 10, develop: 1, test: 5, deploy: 2, urgent: true, teamDependency: 0},
  {number: 16, design: 2, develop: 5, test: 1, deploy: 5, urgent: false, teamDependency: 0},
  {number: 17, design: 3, develop: 6, test: 8, deploy: 4, urgent: false, teamDependency: 0},
  {number: 18, design: 0, develop: 7, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0},
  {number: 19, design: 5, develop: 9, test: 4, deploy: 7, urgent: true, teamDependency: 0},
  {number: 20, design: 8, develop: 8, test: 3, deploy: 7, urgent: false, teamDependency: 0},
  {number: 21, design: 1, develop: 6, test: 5, deploy: 1, urgent: false, teamDependency: 4, dependencyDone: 0},
  {number: 22, design: 0, develop: 10, test: 7, deploy: 7, urgent: false, teamDependency: 0},
  {number: 23, design: 5, develop: 10, test: 11, deploy: 8, urgent: false, teamDependency: 0},
  {number: 24, design: 0, develop: 6, test: 4, deploy: 6, urgent: false, teamDependency: 0},
  {number: 25, design: 3, develop: 2, test: 2, deploy: 4, urgent: false, teamDependency: 0}
]

function resetGame(game) {
  game.columns = JSON.parse(JSON.stringify(initialColumns))
  game.workCards = JSON.parse(JSON.stringify(initialCards))
  game.otherCards = []
  game.pairing = []
  game.daysEffort = []
  game.autoDeploy = {
    doing: false,
    effort: 0,
    done: false
  }
  game.canStartAutoDeploy = false
  game.concurrentDevAndTest = false
  game.currentDay = 1
  game.currentWorkCard = 0
  game.retrosDone = {}
  game.messages = {}
  game.wip = []
  game.cumulative = []
  game.mvpEstimate = null
  game.mvpActual = null
  game.projectEstimate = null
  game.projectActual = null
  game.reEstimate = null
  const members = []
  for (let i = 0; i < game.members.length; i++) {
    const member = game.members[i]
    member.effort = teamFuns.initialEffort()
    member.otherRoles = []
    members.push(member)
  }
  game.members = members

  return game
}

function newGame(data) {
  const game = {
    gameName: data.gameName,
    include: false,
    teams: JSON.parse(JSON.stringify(initialTeams)),
    facilitatorMessages: [],
    config: {
      facilitatorStarts: false,
      gameRunning: false,
      doRetros: false,
      retroDays: 7,
      retroTimer: false,
      retroTime: 0,
      mvpCards: 11,
      percentageBlocked: 0.05,
      percentageDeployFail: 0.5,
    },
    graphConfig: {
      wip: {
        useMovingAverage: true,
        useDays: true
      },
      cumulativeFlow: {
        useDays: true
      },
      cycleTime: {
        medium: 15,
        large: 20
      },
      monteCarlo: {
        runs: 1000,
        runTo: '50',
      }
    },
    stealth: false,
    created: new Date().toISOString(),
    restarted: [],
    lastaccess: new Date().toISOString()
  }

  return game
}

function newTeam(gameName, teamName, config) {
  const team = {
    gameName: gameName,
    teamName: teamName,
    members: [],
    columns: JSON.parse(JSON.stringify(initialColumns)),
    workCards: JSON.parse(JSON.stringify(initialCards)),
    pairing: [],
    recharting: false,
    otherCards: [],
    config: config,
    retrosDone: {},
    concurrentDevAndTest: false,
    canStartAutoDeploy: false,
    daysEffort: [],
    cardsWorkedOn: [],
    currentDay: 1,
    currentWorkCard: 0,
    messages: {},
    mvpEstimate: null,
    mvpActual: null,
    projectEstimate: null,
    projectActual: null,
    reEstimate: null,
    autoDeploy: {
      doing: false,
      effort: 0,
      done: false
    }
  }
  return team
}

function _getGames(db, io, data, debugOn) {

  if (debugOn) { console.log('getGames') }

  db.collection('noEstimatesGames').find().toArray(function(err, res) {
    if (err) throw err
    if (res.length) {
      delete res._id
      io.emit('updateGames', res)
    }
  })
}

function updateTeam(db, io, res) {
  const id = res._id
  delete res._id
  db.collection('noEstimates').updateOne({'_id': id}, {$set: res}, function(err) {
    if (err) throw err
    io.emit('loadTeam', res)
    gameState.update(db, io, res)
  })
}

function updateGame(db, io, res) {
  const id = res._id
  delete res._id
  db.collection('noEstimatesGames').updateOne({'_id': id}, {$set: res}, function(err) {
    if (err) throw err
    io.emit('loadGame', res)
  })
}

module.exports = {

  gameState: function(db, io, data) {
    gameState.update(db, io, data)
  },

  getGameDetails: function(db, io, data, debugOn) {

    if (debugOn) { console.log('getGameDetails', data) }

    db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        const hosts = []
        for (let r = 0; r < res.length; r++) {
          const members = res[r].members
          for (let i = 0; i < members.length; i++) {
            if (members[i].host) {
              hosts.push(members[i].name)
            }
          }
        }
        const details = {
          hosts: hosts
        }
        io.emit('updateGameDetails', { gameName: data.gameName, details : details})
      }
    })
  },

  getGames: function(db, io, data, debugOn) {
    _getGames(db, io, data, debugOn)
  },

  loadGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadGame', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        console.log('Loading game \'' + data.gameName + '\'')
        io.emit('loadGame', res)
      }
    })
  },

  loadTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadTeam', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        console.log('Loading team \'' + data.gameName + ' - ' + data.teamName + '\'')
        io.emit('loadTeam', res)
      }
    })
  },

  makeCaptain: function(db, io, data, debugOn) {

    if (debugOn) { console.log('makeCaptain', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const members = []
        for (let i = 0; i < res.members.length; i++) {
          const member = res.members[i]
          member.captain = member.id == data.myName.id
          members.push(member)
        }
        res.members = members
        updateTeam(db, io, res)
        io.emit('makeCaptain', data)
      }
    })
  },

  restartGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('restartGame', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const restarted = res.restarted
        restarted.push(new Date().toISOString())
        res.restarted = restarted
        db.collection('noEstimatesGames').updateOne({'_id': res._id}, {$set: {restarted: restarted}}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
          db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, gameRes) {
            if (err) throw err
            if (gameRes.length) {
              for (let r = 0; r < gameRes.length; r++) {
                gameRes[r] = resetGame(gameRes[r])
                updateTeam(db, io, gameRes[r])
              }
            }
          })
        })
      }
    })
  },

  deleteGameMeta: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteGameMeta', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        db.collection('noEstimatesGames').deleteOne({'_id': res._id}, function(err, ) {
          if (err) throw err
          _getGames(db, io, data, debugOn)
        })
      }
    })
  },

  deleteGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteGame', data) }

    db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let i = 0; i < res.length; i++) {
          db.collection('noEstimates').deleteOne({'_id': res[i]._id}, function(err, ) {
            if (err) throw err
          })
        }
      }
    })
  },

  retroDone: function(db, io, data, debugOn) {

    if (debugOn) { console.log('retroDone', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.retrosDone[data.currentDay] = true
        updateTeam(db, io, res)
      }
    })
  },

  updateCurrentDay: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateCurrentDay', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const currentDay = res.currentDay + 1
        res = teamFuns.updateTeamCapabilities(res, data, res.daysEffort)
        const columns = res.columns, workCards = res.workCards
        for (let i = 0; i < columns.length; i++) {
          for (let j = 0; j < columns[i].cards.length; j++) {
            const card = columns[i].cards[j]
            const colName = columns[i].name
            if (card.blocked || card.failed || (card.dependentOn && colName == 'deploy')) {
              card.blocked = false
              card.failed = false
              if (cardFuns.cardCompleteInColumn(card, colName, res)) {
                cardFuns.moveCard(columns, workCards, card, i, res.currentDay)
              }
            }
          }
        }
        const actuals = cardFuns.calculateActuals(columns, res.workCards, res.config.mvpCards, res.currentDay, res.mvpActual, res.projectActual)
        res.currentDay = currentDay
        res.members = teamFuns.setTeamMembersEffort(res.members, data)
        res.columns = columns
        res.workCards = workCards
        res.mvpActual = actuals.mvp
        res.projectActual = actuals.project
        updateTeam(db, io, res)
      }
    })
  },

  pullInCard: function(db, io, data, debugOn) {

    if (debugOn) { console.log('pullInCard', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.currentWorkCard = res.currentWorkCard + 1
        res.columns = cardFuns.pullInCard(res.columns, res.workCards, res.currentWorkCard, res.currentDay, data.teams, data.teamName)
        res.wip.push(cardFuns.wip(res.columns, res.currentDay))
        res.cumulative.push(cardFuns.cumulative(res.columns, res.currentDay))
        updateTeam(db, io, res)
        const card = res.workCards.find(function(c) {
          return c.number == res.currentWorkCard
        })
        if (card.dependentOn) {
          db.collection('noEstimates').findOne({gameName: data.gameName, teamName: card.dependentOn.name}, function(err, depRes) {
            if (err) throw err
            if (depRes) {
              const depCard = depRes.workCards.find(function(c) {
                return c.number == res.currentWorkCard
              })
              depCard.team = data.teamName
              depRes.otherCards.push(depCard)
              updateTeam(db, io, depRes)
            }
          })
        }
      }
    })
  },

  updateEffort: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateEffort', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.members = teamFuns.decrementMyEffort(res.members, data.name, data.effort)
        const columns = res.columns, workCards = res.workCards
        let todaysEffort = []
        for (let i = 0; i < columns.length; i++) {
          for (let j = 0; j < columns[i].cards.length; j++) {
            if (columns[i].cards[j].number == data.workCard.number) {
              todaysEffort = pairingFuns.updateTodaysEffort(res, columns[i], data.workCard, data.name)
              let card = columns[i].cards[j]
              const colName = columns[i].name
              card.effort = data.workCard.effort
              card = cardFuns.addCardWorkedOnInDay(card, res.currentDay)
              card = cardFuns.addWorkedOn(card, data.column, data.name, data.role)
              if (cardFuns.cardCompleteInColumn(card, colName, res)) {
                cardFuns.moveCard(columns, workCards, card, i, res.currentDay)
              }
            }
          }
        }
        res.wip.push(cardFuns.wip(columns, res.currentDay))
        res.cumulative.push(cardFuns.cumulative(columns, res.currentDay))
        res.daysEffort = todaysEffort
        res.columns = columns
        res.workCards = workCards
        updateTeam(db, io, res)
      }
    })
  },

  pairingDay: function(db, io, data, debugOn) {

    if (debugOn) { console.log('pairingDay', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        let i, player
        const pairing = []
        for (i = 0; i < res.pairing.length; i++) {
          if (res.pairing[i].name.id == data.name.id) {
            player = res.pairing[i]
          } else {
            pairing.push(res.pairing[i])
          }
        }
        if (!player) {
          player = {name: data.name, columns: [{column: data.column, days: [data.day]}]}
        } else {
          let column
          for (i = 0; i < player.columns.length; i++) {
            if (player.columns[i].column == data.column) {
              column = player.columns[i]
            }
          }
          if (!column) {
            player.columns.push({column: data.column, days: [data.day]})
          } else {
            let dayDone = false
            for (i = 0; i < column.days.length; i++) {
              if (column.days[i] == data.day) {
                dayDone = true
              }
            }
            if (!dayDone) {
              column.days.push(data.day)
            }
            if (column.days.length >= 5) {
              res.members = pairingFuns.addSecondarySkill(res.members, column.column, data.name)
            }
            const columns = []
            for (i = 0; i < player.columns.length; i++) {
              if (player.columns[i].column == data.column) {
                columns.push(column)
              } else {
                columns.push(player.columns[i])
              }
            }
            player.columns = columns
          }
        }
        pairing.push(player)
        res.pairing = pairing
        updateTeam(db, io, res)
      }
    })
  },

  addEffortToOthersCard: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addEffortToOthersCard', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.card.team}, function(err, otherRes) {
      if (err) throw err
      if (otherRes) {
        otherRes.columns = dependent.addDependentEffort(otherRes.columns, data.card, data.effort, otherRes)
        updateTeam(db, io, otherRes)
      }
    })

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.otherCards = dependent.addOtherCardEffort(res.otherCards, data.card, data.effort)
        res.members = teamFuns.decrementMyEffort(res.members, data.myName, data.effort)
        updateTeam(db, io, res)
      }
    })
  },

  startAutoDeploy: function(db, io, data, debugOn) {

    if (debugOn) { console.log('startAutoDeploy', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.autoDeploy.doing = true
        updateTeam(db, io, res)
      }
    })
  },

  incrementAutoDeploy: function(db, io, data, debugOn) {

    if (debugOn) { console.log('incrementAutoDeploy', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const autoDeploy = res.autoDeploy
        autoDeploy.effort = autoDeploy.effort + 1
        if (autoDeploy.effort >= 8) {
          autoDeploy.doing = false
          autoDeploy.done = true
          io.emit('autodeployComplete', data)
        }
        res.autoDeploy = autoDeploy
        res.members = teamFuns.decrementMyEffort(res.members, data.name, data.effort)
        updateTeam(db, io, res)
      }
    })
  }

}
