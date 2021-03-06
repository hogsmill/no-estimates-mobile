
function getNoOfCardsForDay(cardsPerDay) {
  const index = parseInt(Math.random() * (cardsPerDay.length - 1))
  return cardsPerDay[index]
}

function getCardsToRunTo(config, cards) {
  let runConfig = {}
  if (config.runTo == 'Remaining') {
    runConfig = {
      from: cards.length,
      to: 25 - cards.length
    }
  } else {
    runConfig = {
      from: 0,
      to: parseInt(config.runTo)
    }
  }
  return runConfig
}

function monteCarloRun(cardsPerDay, noOfCards, startFrom) {
  let cardsDone = 0, day = startFrom
  while (cardsDone < noOfCards) {
    const cardsForDay = getNoOfCardsForDay(cardsPerDay)
    cardsDone = cardsDone + getNoOfCardsForDay(cardsPerDay)
    day = day + 1
  }
  return day
}

function monteCarlo(cards, cardsPerDay, startFrom, runs, cards) {
  const results = {}
  for (let i = 0; i < runs; i++) {
    const run = monteCarloRun(cardsPerDay, cards, startFrom)
    if (!results[run]) {
      results[run] = 1
    } else {
      results[run] = results[run] + 1
    }
  }
  return results
}

function cardsPerDayDistribution(cards, from) {
  const cardsPerDay = {}
  for (let i = 0; i < cards.length; i++) {
    if (!cardsPerDay[cards[i].delivery]) {
      cardsPerDay[cards[i].delivery] = 1
    } else {
      cardsPerDay[cards[i].delivery] = cardsPerDay[cards[i].delivery] + 1
    }
  }
  const days = [],
        min = from ? from : Math.min(...Object.keys(cardsPerDay))
        max = Math.max(...Object.keys(cardsPerDay))
  for (let j = min; j <= max; j++) {
    const day = cardsPerDay[j] ? cardsPerDay[j] : 0
    days.push(day)
  }
  return {
    startFrom: min,
    cards: days
  }
}

function percentages(counts, days, config) {
  const percentiles = {},
        _50 = config.runs * 0.5,
        _75 = config.runs * 0.75,
        _90 = config.runs * 0.90,
        _95 = config.runs * 0.95,
        _99 = config.runs * 0.99
  let count = 0
  for (let i = 0; i < config.runs; i++) {
    count = count + counts[i]
    if (count >= _99) {
      percentiles[99] = days[i]
    } else if (count >= _95) {
      percentiles[95] = days[i]
    } else if (count >= _90) {
      percentiles[90] = days[i]
    } else if (count >= _75) {
      percentiles[75] = days[i]
    } else if (count >= _50) {
      percentiles[50] = days[i]
    }
  }
  return percentiles
}

module.exports = {

  run: function(cards, config) {
    const data = {
      days: [],
      counts: [],
    }
    if (cards.length) {
      const cardsToRunTo = getCardsToRunTo(config, cards)
      const cardsPerDay = cardsPerDayDistribution(cards, cardsToRunTo.from)
      const results = monteCarlo(cards, cardsPerDay.cards, cardsPerDay.startFrom, config.runs, cardsToRunTo.to)
      const max = Math.max(...Object.keys(results))
      for (let i = cardsPerDay.startFrom; i <= max; i++) {
        data.days.push(i)
        const result = results[i] ? results[i] : 0
        data.counts.push(result)
      }
    }
    data.percentiles = percentages(data.counts, data.days, config)
    return data
  }

}
