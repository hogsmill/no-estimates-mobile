
module.exports = {

  addMessage: function(messages, chattingTo, source, message) {
    const teamMessages = messages[chattingTo] ? messages[chattingTo] : []
    teamMessages.push({source: source, message: message, seen: false})
    messages[chattingTo] = teamMessages
    return messages
  },

  addFacilitatorMessage: function(messages, team, source, message) {
    messages.push({team: team, source: source, message: message, seen: false})
    return messages
  }
}
