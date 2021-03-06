
const valueDelivered = require('./results/valueDelivered.js')
const correlation = require('./results/correlation.js')
const flowEfficiency = require('./results/flowEfficiency.js')
const cycleTime = require('./results/cycleTime.js')
const wipFuns = require('./results/wip.js')
const cumulativeFlow = require('./results/cumulativeFlow.js')
const distribution = require('./results/distribution.js')
const scatterPlot = require('./results/scatterPlot.js')
const monteCarlo = require('./results/monteCarlo.js')

function _loadGame(db, io, res) {
  const id = res._id
  delete res._id
  db.collection('noEstimatesGames').updateOne({'_id': id}, {$set: res}, function(err) {
    if (err) throw err
    io.emit('loadGame', res)
  })
}

function getQuery(data) {
  const query = {
    gameName: data.gameName
  }
  if (!data.team2 && !data.team3) {
    query.teamName = data.team1
  } else if (data.team2 && !data.team3) {
    query['$or'] = [
      {teamName: data.team1},
      {teamName: data.team2}
    ]
  } else if (data.team2 && data.team3) {
    query['$or'] = [
      {teamName: data.team1},
      {teamName: data.team2},
      {teamName: data.team3}
    ]
  }
  return query
}

module.exports = {

  showGameResult: function(db, io, data, debugOn) {

    if (debugOn) { console.log('showGameResult', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, gameRes) {
      if (err) throw err
      if (gameRes) {
        switch(data.result) {
          case 'sources-of-variation':
            data.results = gameRes.sourcesOfVariation
            break
        }
        io.emit('showResult', data)
      }
    })
  },

  showAllTeamsResult: function(db, io, data, debugOn) {

    if (debugOn) { console.log('showAllTeamsResult', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, gameRes) {
      if (err) throw err
      const include = {}
      for (let i = 0; i < gameRes.teams.length; i++) {
        include[gameRes.teams[i].name] = gameRes.teams[i].include
      }
      db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
        if (err) throw err
        if (res.length) {
          const results = {
            teams: [],
            value: []
          }
          for (let r = 0; r < res.length; r++) {
            switch(data.result) {
              case 'value-delivered':
                if (include[res[r].teamName]) {
                  results.teams.push(res[r].teamName)
                  results.value.push(valueDelivered.total(res[r]))
                }
                break
            }
          }
          data.results = results
          io.emit('showResult', data)
        }
      })
    })
  },

  showSingleTeamResult: function(db, io, data, debugOn) {

    if (debugOn) { console.log('showSingleTeamResult', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, gameRes) {
      if (err) throw err
      if (gameRes) {
        db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
          if (err) throw err
          if (res) {
            data.teamName = res.teamName
            const wip = res.wip ? res.wip : {}
            const cumulative = res.cumulative ? res.cumulative : {}
            const cards = res.columns.find(function(c) {
              return c.name == 'done'
            }).cards
            switch(data.result) {
              case 'wip':
                data.results = wipFuns.run(wip, gameRes.graphConfig.wip.useDays)
                break
              case 'flow-efficiency-cards':
                data.results = flowEfficiency.cards(cards)
                break
              case 'cumulative-flow':
                data.results = cumulativeFlow.run(cumulative, gameRes.graphConfig.cumulativeFlow.useDays)
                break
              case 'cycle-time':
                data.results = cycleTime.run(cards)
                break
              case 'distribution':
                data.results = distribution.run(cards)
                break
              case 'scatter-plot':
                data.results = scatterPlot.run(cards)
                if (data.results.length) {
                  data.limits = scatterPlot.limits(data.results)
                }
                break
              case 'monte-carlo':
                data.results = monteCarlo.run(cards, gameRes.graphConfig.monteCarlo)
                break
            }
            io.emit('showResult', data)
          }
        })
      }
    })
  },

  showMultipleTeamsResult: function(db, io, data, debugOn) {

    if (debugOn) { console.log('showMultipleTeamsResult', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, gameRes) {
      if (err) throw err
      if (gameRes) {
        const query = getQuery(data)
        db.collection('noEstimates').find(query).toArray(function(err, res) {
          if (err) throw err
          if (res.length) {
            const results = []
            for (let r = 0; r < res.length; r++) {
              data.teamName = res[r].teamName
              const cards = res[r].columns.find(function(c) {
                return c.name == 'done'
              }).cards
              switch(data.result) {
                case 'correlation':
                  results.push(correlation.run(cards))
                  break
                case 'flow-efficiency':
                  results.push(flowEfficiency.run(res[r].columns, res[r].currentDay))
                  break
              }
            }
            data.results = results
            io.emit('showResult', data)
          }
        })
      }
    })
  },

  showSourceOfVariation: function(db, io, data, debugOn) {

    if (debugOn) { console.log('showSourceOfVariation', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const sources = []
        for (let i = 0; i < res.sourcesOfVariation.length; i++) {
          const source = res.sourcesOfVariation[i]
          if (source.name == data.source.name) {
            source.show = true
          }
          sources.push(source)
        }
        db.collection('noEstimatesGames').updateOne({'_id': res._id}, {$set: {sourcesOfVariation: sources}}, function(err) {
          if (err) throw err
          data.results = sources
          io.emit('updateSourcesOfVariation', data)
        })
      }
    })
  },

  setWipUseMovingAverage: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setWipUseMovingAverage', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.wip.useMovingAverage = data.value
        _loadGame(db, io, res)
      }
    })
  },

  setWipUseDays: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setWipUseDays', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.wip.useDays = data.value
        _loadGame(db, io, res)
      }
    })
  },

  setCumulativeFlowUseDays: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setCumulativeFlowUseDays', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.cumulativeFlow.useDays = data.value
        _loadGame(db, io, res)
      }
    })
  },

  setCardSize: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setCardSize', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.cycleTime[data.size] = data.value
        _loadGame(db, io, res)
      }
    })
  },

  setMonteCarloRunTo: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setMonteCarloCards', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.monteCarlo.runTo = data.runTo
        _loadGame(db, io, res)
      }
    })
  },

  setMonteCarloRuns: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setMonteCarloRuns', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.monteCarlo.runs = data.runs
        _loadGame(db, io, res)
      }
    })
  }
}
