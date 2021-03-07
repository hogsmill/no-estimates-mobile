
const teamFuns = require('./lib/teams.js')
const cardFuns = require('./lib/cards.js')
const pairingFuns = require('./lib/pairing.js')
const dependent = require('./lib/dependent.js')
const chat = require('./lib/chat.js')
const gameState = require('./lib/gameState.js')
const sourceFuns = require('./lib/sources.js')

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

  addMyName: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addMyName', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const member = data.myName
        member.effort = teamFuns.initialEffort()
        member.otherRoles = []
        res.members.push(data.myName)
        updateTeam(db, io, res)
      }
    })
  },

  setMyRole: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setMyRole', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const members = []
        for (let i = 0; i < res.members.length; i++) {
          const member = res.members[i]
          if (member.id == data.myName.id) {
            member.role = data.myRole
          }
          members.push(member)
        }
        res.members = members
        updateTeam(db, io, res)
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
