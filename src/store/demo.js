
function randomCommit() {
  return parseInt(Math.random() * 20 + 1)
}

function randomDelivery(commit) {
  return parseInt(Math.random() * 10) + 2 + commit
}

function effort(card) {
  const effort = {}
  for (const key in Object.keys(card.effort)) {
    effort[key] = card[key]
  }
  return effort
}

function moveCardToDone(res, card) {
  const commit = randomCommit()
  const delivery = randomDelivery(commit)
  const columns = []
  for (let i = 0; i < res.columns.length; i++) {
    const column = res.columns[i]
    if (column.name == 'done') {
      const cards = column.cards
      card.commit = commit
      card.delivery = delivery
      card.done = true
      card.effort = effort(card)
      cards.push(card)
      column.cards = cards
    }
    columns.push(column)
  }
  res.columns = columns
  return res
}

function moveCardsToDone(res, n) {
  const cards = res.workCards
  for (let i = 0; i < n; i++) {
    res = moveCardToDone(res, cards[i])
  }
  return res
}

function updateTeam(db, io, res) {
  const id = res._id
  delete res._id
  db.collection('noEstimates').updateOne({'_id': id}, {$set: res}, function(err) {
    if (err) throw err
    io.emit('loadTeam', res)
  })
}

module.exports = {

  runDemoToMvp: function(db, io, data, debugOn) {

    if (debugOn) { console.log('runDemoToMvp', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res = moveCardsToDone(res, res.config.mvpCards)
        updateTeam(db, io, res)
      }
    })
  },

  runDemoToEnd: function(db, io, data, debugOn) {

    if (debugOn) { console.log('runDemoToEnd', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res = moveCardsToDone(res, res.workCards.length)
        updateTeam(db, io, res)

      }
    })
  }
}
