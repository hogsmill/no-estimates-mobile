
const cardFuns = require('../lib/cards.js')

function pCorrelation(x, y) {
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0
  const minLength = x.length = y.length = Math.min(x.length, y.length),
  reduce = (xi, idx) => {
    const yi = y[idx]
    sumX += xi
    sumY += yi
    sumXY += xi * yi
    sumX2 += xi * xi
    sumY2 += yi * yi
  }
  x.forEach(reduce)
  return (minLength * sumXY - sumX * sumY) / Math.sqrt((minLength * sumX2 - sumX * sumX) * (minLength * sumY2 - sumY * sumY))
}

module.exports = {

  run: function(workCards) {
    const effort = [], deliveryTime = []
    for (let i = 0; i < workCards.length; i++) {
      if (workCards[i].delivery) {
        const card = workCards[i]
        effort.push(cardFuns.totalEffort(card))
        deliveryTime.push(card.delivery - card.commit)
      }
    }
    return effort.length == 0 ? 0 : pCorrelation(effort, deliveryTime).toFixed(2)
  }
}
