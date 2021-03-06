
function _cardIsPlayable(card) {
  let playable = false
  const cols = Object.keys(card.effort)
  for (let i = 0; i < cols.length; i++) {
    if (!card.blocked && card.effort[cols[i]] < card[cols[i]]) {
      playable = true
    }
  }
  return playable
}

function _memberHasEffort(member) {
  return member.effort.available > 1
}

module.exports = {

  dependency: function(game) {
    let card, found = false, i = 0
    while (!found && i < game.columns.length) {
      for (let j = 0; j < game.columns[i].cards.length; j++) {
        const colCard = game.columns[i].cards[j]
        if (colCard.teamDependency > 0 && colCard.dependencyDone < colCard.teamDependency) {
          card = colCard
          found = true
        }
      }
      i = i + 1
    }
    return card
  },

  noCardsLeft: function(game) {
    const column = game.columns.find(function(c) {
      return c.name == 'done'
    })
    // TODO: handle dependencies - 5 is the umber of cards with dependencies
    return column.cards.length == game.workCards.length - 5
  },

  aCardIsPlayable: function(game) {
    let playable = false
    for (let i = 0; i < game.columns.length - 1; i++) {
      const column = game.columns[i]
      for (let j = 0; j < column.cards.length; j++) {
        const card = column.cards[j]
        if (_cardIsPlayable(card)) {
          console.log('    Card #' + card.number + ' is playable')
          playable = true
        }
      }
    }
    console.log('playable', playable)
    return playable
  },

  effortCanBeAssigned: function(game) {
    let effortAvailable = false
    for (let i = 0; i < game.members.length; i++) {
      const member = game.members[i]
      // TODO: Make this allow other roles, i.e. 1 left
      if (member.effort.available > 1) {
        console.log('    ' + member.name + ' has ' + member.effort.available + ' effort available')
        effortAvailable = true
      }
    }
    return effortAvailable
  },

  cardIsPlayable: function(card) {
    return _cardIsPlayable(card)
  },

  memberHasEffort: function(member) {
    return _memberHasEffort(member)
  }

}
