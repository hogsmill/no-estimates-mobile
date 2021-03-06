
const maths = require('./maths.js')

function calculateDays(results) {
  let day = results.cumulative.day[0]
  const newResults = {
    cumulative: {
      design: [],
      develop: [],
      test: [],
      deploy: [],
      done: []
    },
    labels: []
  }
  let result = {
    design: [],
    develop: [],
    test: [],
    deploy: [],
    done: []
  }
  for (let i = 0; i < results.labels.length; i++) {
    if (results.cumulative.day[i] == day) {
      result.design.push(results.cumulative.design[i])
      result.develop.push(results.cumulative.develop[i])
      result.test.push(results.cumulative.test[i])
      result.deploy.push(results.cumulative.deploy[i])
      result.done.push(results.cumulative.done[i])
    } else {
      newResults.cumulative.design.push(maths.average(result.design))
      newResults.cumulative.develop.push(maths.average(result.develop))
      newResults.cumulative.test.push(maths.average(result.test))
      newResults.cumulative.deploy.push(maths.average(result.deploy))
      newResults.cumulative.done.push(maths.average(result.done))
      newResults.labels.push(day)
      result = {
        design: [],
        develop: [],
        test: [],
        deploy: [],
        done: []
      }
      day = results.cumulative.day[i]
    }
  }
  return newResults
}

module.exports = {

  run: function(cumulative, useDays) {
    let results = {
      cumulative: {
        day: [],
        design: [],
        develop: [],
        test: [],
        deploy: [],
        done: []
      },
      labels: []
    }
    for (let i = 0; i < cumulative.length; i++) {
      results.cumulative.day.push(parseInt(cumulative[i].day))
      results.cumulative.design.push(parseInt(cumulative[i].design))
      results.cumulative.develop.push(parseInt(cumulative[i].develop))
      results.cumulative.test.push(parseInt(cumulative[i].test))
      results.cumulative.deploy.push(parseInt(cumulative[i].deploy))
      results.cumulative.done.push(parseInt(cumulative[i].done))
      results.labels.push(i)
    }
    if (useDays) {
      results = calculateDays(results)
    }
    return results
  }
}
