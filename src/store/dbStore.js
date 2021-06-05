
const teamFuns = require('./lib/teams.js')
const gameState = require('./lib/gameState.js')

function _getGames(db, io, data, debugOn) {

  if (debugOn) { console.log('getGames') }

  db.gamesCollection.find().toArray(function(err, res) {
    if (err) throw err
    if (res.length) {
      delete res._id
      io.emit('updateGames', res)
    }
  })
}

function updateTeam(db, io, res) {
  const id = res._id
  delete res._id
  db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err) {
    if (err) throw err
    io.emit('loadTeam', res)
    gameState.update(db, io, res)
  })
}

module.exports = {

  getGames: function(db, io, data, debugOn) {
    _getGames(db, io, data, debugOn)
  },

  loadGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadGame', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        console.log('Loading game \'' + data.gameName + '\'')
        io.emit('loadGame', res)
      }
    })
  },

  loadTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadTeam', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        console.log('Loading team \'' + data.gameName + ' - ' + data.teamName + '\'')
        io.emit('loadTeam', res)
      }
    })
  },

  addMyName: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addMyName', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const member = data.myName
        member.effort = teamFuns.initialEffort()
        member.otherRoles = []
        res.members.push(data.myName)
        updateTeam(db, io, res)
      }
    })
  },

  setMyRole: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setMyRole', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const members = []
        for (let i = 0; i < res.members.length; i++) {
          const member = res.members[i]
          if (member.id == data.myName.id) {
            member.role = data.myRole
          }
          members.push(member)
        }
        res.members = members
        updateTeam(db, io, res)
      }
    })
  },

  makeCaptain: function(db, io, data, debugOn) {

    if (debugOn) { console.log('makeCaptain', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const members = []
        for (let i = 0; i < res.members.length; i++) {
          const member = res.members[i]
          member.captain = member.id == data.myName.id
          members.push(member)
        }
        res.members = members
        updateTeam(db, io, res)
        io.emit('makeCaptain', data)
      }
    })
  }

}
