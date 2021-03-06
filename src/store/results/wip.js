
const sma = require('sma')
const maths = require('./maths.js')

function calculateDays(results) {
  let day = results.day[0]
  const newResults = {
    wip: [],
    labels: []
  }
  let result = {
    wip: []
  }
  for (let i = 0; i < results.labels.length; i++) {
    if (results.day[i] == day) {
      result.wip.push(results.wip[i])
    } else {
      newResults.wip.push(maths.average(result.wip))
      newResults.labels.push(day)
      result = {
        wip: []
      }
      day = results.day[i]
    }
  }
  return newResults
}

module.exports = {

  run: function(wip, useDays) {
    let results = {
      day: [],
      wip: [],
      wipMovingAverage: [],
      average: 0,
      labels: [],
      labelsMovingAverage: []
    }
    let sum = 0
    for (let i = 0; i < wip.length; i++) {
      results.day.push(wip[i].day)
      results.wip.push(wip[i].overall)
      sum = sum + parseInt(wip[i].overall)
      results.labels.push(i)
    }

    if (useDays) {
      results = calculateDays(results)
    }
    results.wipMovingAverage = sma(results.wip, 12)
    results.labelsMovingAverage = results.labels.slice(6, results.labels.length - 6)
    results.average = sum == 0 ? 0 : Math.round((sum / wip.length) * 1000) / 1000
    return results
  }
}
