
const initialEffort = {
  available: 4,
  assigned: 0
}

function getCapacity(data) {
  let capacity = 4
  if (data) {
    if (data.capacity == 'none') {
      capacity = 0
    } else if (data.capacity) {
      capacity = data.capacity
    }
  }
  return capacity
}

module.exports = {

  initialEffort: function() {
    return initialEffort
  },

  addMember: function(members, name, role) {
    const newMembers = []
    let found = false
    for (let i = 0; i < members.length; i++) {
      const member = members[i]
      if (member.id == name.id) {
        member.name = name.name
        member.captain = name.captain
        member.role = role
        member.host = name.host
        found = true
      }
      newMembers.push(member)
    }
    if (!found) {
      name.role = role
      name.otherRoles = []
      name.effort = initialEffort
      newMembers.push(name)
    }
    return newMembers
  },

  removeMember: function(members, name) {
    const newMembers = []
    for (let i = 0; i < members.length; i++) {
      if (members[i].id != name.id) {
        newMembers.push(members[i])
      }
    }
    return newMembers
  },

  updateTeamCapabilities: function(team, data) {
    if (data.autoDeploy) {
      team.autoDeploy.doing = true
    }
    if (data.canStartAutoDeploy) {
      team.canStartAutoDeploy = true
    }
    if (data.concurrentDevAndTest) {
      team.concurrentDevAndTest = true
    }
    if (data.recharting) {
      team.recharting = true
    } else {
      team.recharting = false
    }
    return team
  },

  decrementMyEffort: function(members, name, effort) {
    const newMembers = []
    for (let i = 0; i < members.length; i++) {
      const member = members[i]
      if (member.id == name.id && member.effort.available - effort >= 0) {
        member.effort.assigned = member.effort.assigned + effort
        member.effort.available = member.effort.available - effort
      }
      newMembers.push(member)
    }
    return newMembers
  },

  setTeamMembersEffort: function(members, data) {
    const newMembers = []
    for (let j = 0; j < members.length; j++) {
      let capacity = getCapacity(data)
      const member = members[j]
      if (member.role == 'Tester' && data.testCapacity) {
        capacity = data.testCapacity
        delete data.testCapacity
      }
      member.effort.available = capacity
      member.effort.assigned = 0
      newMembers.push(member)
    }
    return newMembers
  },

  reset: function(teams) {
    const newTeams = []
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i]
      const members = []
      for (let j = 0; j < teams[i].members.length; j++) {
        const member = teams[i].members[j]
        const role = member.effort ? member.effort.role : ''
        const effort = {
          assigned: 0,
          available: 4,
          role: role
        }
        member.effort = effort
        member.otherRoles = []
        members.push(member)
      }
      team.recharting = false
      team.concurrentDevAndTest = false
      team.canStartAutoDeploy = false
      team.autoDeploy = { doing: false, effort: 0, done: false }
      team.members = members
      team.otherCards = []
      newTeams.push(team)
    }
    return newTeams
  }
}
