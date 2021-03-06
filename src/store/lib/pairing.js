
function updateTodayCard(card, name) {
  const names = []
  for (let i = 0; i < card.names.length; i++) {
    if (card.names[i].name.id != name.id) {
      names.push(card.names[i])
    }
  }
  names.push(name)
  card.names = names
  return card
}

function updateTodayColumn(column, card, name) {
  const fullCard = {number: card.number, names: []}, cards = []
  for (let i = 0; i < column.cards.length; i++) {
    if (column.cards[i].number != fullCard.number) {
      cards.push(column.cards[i])
    } else {
      card = column.cards[i]
    }
  }
  cards.push(updateTodayCard(fullCard, name))
  column.cards = cards
  return column
}

function updateToday(today, column, card, name) {
  const fullColumn = {column: column.name, cards: []}, columns = []
  for (let i = 0; i < today.columns.length; i++) {
    if (today.columns[i].column == fullColumn.column) {
      column = today.columns[i]
    } else {
      columns.push(today.columns[i])
    }
  }
  columns.push(updateTodayColumn(fullColumn, card, name))
  today.columns = columns
  return today
}

module.exports = {

  updateTodaysEffort: function(res, column, card, name) {
    const day = res.currentDay, todaysEffort = []
    let today = {day: day, columns: []}
    for (let i = 0; i < res.daysEffort.length; i++) {
      if (res.daysEffort[i].day != day) {
        todaysEffort.push(res.daysEffort[i])
      } else {
        today = res.daysEffort[i]
      }
    }
    todaysEffort.push(updateToday(today, column, card, name))
    return todaysEffort
  },

  addSecondarySkill: function(members, column, name) {
    const role = column.charAt(0).toUpperCase() + column.slice(1) + 'er'
    const newMembers = []
    for (let j = 0; j < members.length; j++) {
      const member = members[j]
      if (member.id == name.id) {
        const otherRoles = member.otherRoles
        let found = false
        for (let k = 0; k < member.otherRoles.length; k++) {
          if (member.otherRoles[k] == role) {
            found = true
          }
        }
        if (!found) {
          otherRoles.push(role)
        }
        member.otherRoles = otherRoles
      }
      newMembers.push(member)
    }
    return newMembers
  }

}
