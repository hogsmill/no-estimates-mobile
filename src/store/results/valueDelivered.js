

module.exports = {

  total: function(res) {
    let total = 0
    for (let i = 0; i < res.workCards.length; i++) {
      if (res.workCards[i].value) {
        total += res.workCards[i].value
      }
    }
    return total
  }
/*
  : function(res) {
    const results = {
      teams: [],
      value: []
    }
    for (let i = 0; i < res.length; i++) {
      results.teams.push(res[i].teamName)
      results.value.push(total(res[i].workCards))
    }
    return results
  }
  */
}
