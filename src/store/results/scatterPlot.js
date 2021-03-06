
module.exports = {

  run: function(workCards) {
    const data = []
    for (let i = 0; i < workCards.length; i++) {
      if (workCards[i].delivery) {
        const card = workCards[i]
        const delivery = card.delivery
        const elapsed = card.delivery - card.commit
        data.push({
          x: delivery,
          y: elapsed,
          label: '#' + card.number + ' - ' +
          'Completed on day ' + delivery + ', ' +
          elapsed + ' days elapsed'
        })
      }
    }
    return data
  },

  limits: function(data) {
    data = data.sort(function(a, b) {
      return a.y - b.y
    })
    const len = data.length - 1
    const limits = {
      75: data[Math.round(len * 0.75)].y,
      90: data[Math.round(len * 0.90)].y,
      95: data[Math.round(len * 0.95)].y,
      99: data[Math.round(len * 0.99)].y
    }
    return limits
  }
}
