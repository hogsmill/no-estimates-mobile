
const cardFuns = require('../lib/cards.js')

module.exports = {

  run: function(workCards) {
    const results = {
      ids: [],
      effort: [],
      days: []
    }
    for (let i = 0; i < workCards.length; i++) {
      if (workCards[i].delivery) {
        results.ids.push('#' + workCards[i].number)
        results.effort.push(cardFuns.totalEffort(workCards[i]))
        results.days.push(workCards[i].delivery - workCards[i].commit)
      }
    }
    return results
  }
}
