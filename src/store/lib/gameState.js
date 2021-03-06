
function cardEffort(card) {
  return {
    effort: card.design + card.develop + card.test + card.deploy,
    done: card.effort.design + card.effort.develop + card.effort.test + card.effort.deploy
  }
}

function columnDetails(res) {
  const cols = {}
  for (let i = 0; i < res.columns.length; i++) {
    cols[res.columns[i].name] = []
    for (let j = 0; j < res.columns[i].cards.length; j++) {
      const card = res.columns[i].cards[j]
      let dependentOn = false
      if (card.dependentOn) {
        dependentOn = {
          team: card.dependentOn.name,
          effort: card.teamDependency,
          done: card.dependencyDone
        }
      }
      cols[res.columns[i].name].push({
        number: card.number,
        blocked: card.blocked,
        commit: card.commit,
        delivered: card.delivered,
        effort: cardEffort(card),
        urgent: card.urgent,
        dependentOn: dependentOn
      })
    }
  }
  return cols
}

function teamState(res) {
  const columns = columnDetails(res)
  return {
    name: res.teamName,
    currentDay: res.currentDay,
    currentWorkCard: res.currentWorkCard,
    otherCards: res.otherCards,
    autoDeploy: res.autoDeploy,
    members: res.members,
    columns: columns,
    projectEstimate: res.projectEstimate,
    mvpEstimate: res.mvpEstimate,
    reEstimate: res.reEstimate
  }
}

module.exports = {

  update: function(db, io, game) {

    db.collection('noEstimates').find({gameName: game.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        const teams = []
        for (let r = 0; r < res.length; r++) {
          teams.push(teamState(res[r]))
        }
        const data = {
          gameName: game.gameName,
          gameState: teams
        }
        io.emit('updateGameState', data)
      }
    })
  }
}
