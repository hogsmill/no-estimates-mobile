
function maxDeliveryTime(workCards) {
  let max = 0
  for (let i = 0; i < workCards.length; i++) {
    if (workCards[i].delivery) {
      const delivery = workCards[i].delivery - workCards[i].commit
      if (delivery > max) {
        max = delivery
      }
    }
  }
  return max
}

module.exports = {

  run: function(workCards) {
    const results = {
      days: [],
      counts: []
    }
    const max = maxDeliveryTime(workCards)
    for (let i = 0; i < max; i++) {
      results.days.push(i + 1)
    }
    const counts = {}
    for (let i = 0; i < workCards.length; i++) {
      if (workCards[i].delivery) {
        const delivery = workCards[i].delivery - workCards[i].commit
        if (!counts[delivery]) {
          counts[delivery] = 1
        } else {
          counts[delivery] = counts[delivery] + 1
        }
      }
    }
    for (let j = 0; j < results.days.length; j++) {
      const count = counts[results.days[j]] ? counts[results.days[j]] : 0
      results.counts.push(count)
    }
    return results
  }
}
