
const gameUpdates = [

  {name: 'graphConfig', value: {
      'cycleTime': {
        medium: 15,
        large: 25
      },
    }
  },

  {name: 'graphConfig', value: {
      'wip': {
        useMovingAverage: true,
        useMoves: true,
        useDays: true
      },
      'cumulativeFlow': {
        useMoves: true,
        useDays: true
      }
    }
  },

  {name: 'demoConfig', value: {
      'runTo': 'MVP',
      'runToCards': 11,
      'stepThrough': false,
      'running': false
    }
  }
]

const teamUpdates = [

  {name: 'wip', value: []},
  {name: 'cumulative', value: []}
]

module.exports = {

  game: function(res) {
    console.log('Updating db (game)')
    for (let i = 0; i < gameUpdates.length; i++) {
      const update = gameUpdates[i]
      if (!res[update.name]) {
        console.log('  Adding "' + update.name + '" = "' + JSON.stringify(update.value) + '"')
        res[update.name] = update.value
      } else {
        const keys = Object.keys(update.value)
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          if (!res[update.name][key]) {
            console.log('  Adding "' + update.name + '.' + key + '" = "' + JSON.stringify(update.value) + '"')
            res[update.name][key] = update.value[key]
          }
        }
      }
    }
    return res
  },

  team: function(res) {
    console.log('Updating db (team)')
    for (let i = 0; i < teamUpdates.length; i++) {
      const update = teamUpdates[i]
      if (!res[update.name]) {
        console.log('  Adding "' + update.name + '" = "' + JSON.stringify(update.value) + '"')
        res[update.name] = update.value
      } else {
        const keys = Object.keys(update.value)
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          if (!res[update.name][key]) {
            console.log('  Adding "' + update.name + '.' + key + '" = "' + JSON.stringify(update.value) + '"')
            res[update.name][key] = update.value[key]
          }
        }
      }
    }
    return res
  }

}
