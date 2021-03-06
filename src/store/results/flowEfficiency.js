
function flowEfficiency(card) {
  return parseInt(100 * card.daysWorkedOn.length / (card.delivery - card.commit + 1)) / 100
}

module.exports = {

  run: function(columns, day) {
    let days = 0, maxDays = 0
    for (let i = 0; i < columns.length; i++) {
      for (let j = 0; j < columns[i].cards.length; j++) {
        days = days + columns[i].cards[j].daysWorkedOn.length
        maxDays = maxDays + day - columns[i].cards[j].commit
      }
    }
    return parseInt(100 * days / maxDays) / 100
  },

  cards: function(cards) {
    const results = []
    let minCard = { flowEfficiency: 1 }
    let maxCard = { flowEfficiency: 0 }
    let longestCard = { days: 0 }
    for (let i = 0; i < cards.length; i++) {
      const flow = flowEfficiency(cards[i])
      if (flow > maxCard.flowEfficiency) {
        maxCard = {
          card: cards[i],
          flowEfficiency: flow
        }
      }
      if (flow < minCard.flowEfficiency) {
        minCard = {
          card: cards[i],
          flowEfficiency: flow
        }
      }
      if (cards[i].daysWorkedOn.length > longestCard.days) {
        longestCard = {
          card: cards[i],
          flowEfficiency: flow,
          days: cards[i].daysWorkedOn.length
        }
      }
    }
    return [minCard, maxCard, longestCard]
  }
}
