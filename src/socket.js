import io from 'socket.io-client'
import bus from './EventBus'

let connStr, gameConnstr
if (location.hostname == 'localhost') {
  connStr = 'http://localhost:3018'
  gameConnstr = 'http://localhost:3007'
} else {
  connStr = 'https://agilesimulations.co.uk:' + process.env.VUE_APP_PORT
  gameConnstr = 'https://agilesimulations.co.uk:' + process.env.VUE_APP_GAME_PORT
}
console.log('Connecting to: ' + connStr + ' (app)')
const socket = io(connStr)
console.log('Connecting app to: ' + gameConnstr + ' (game)')
const gameSocket = io(gameConnstr)

// -- Send --

bus.on('sendGetGames', (data) => { socket.emit('sendGetGames', data) })

bus.on('sendLoadGame', (data) => { socket.emit('sendLoadGame', data) })

bus.on('sendLoadTeam', (data) => { socket.emit('sendLoadTeam', data) })

bus.on('sendAddMyName', (data) => { socket.emit('sendAddMyName', data) })

bus.on('sendSetMyRole', (data) => { socket.emit('sendSetMyRole', data) })

bus.on('sendIncrementAutoDeploy', (data) => { gameSocket.emit('sendIncrementAutoDeploy', data) })

bus.on('emitUpdatePersonAutoDeployEffort', (data) => { gameSocket.emit('emitUpdatePersonAutoDeployEffort', data) })

bus.on('emitUpdatePersonEffort', (data) => { gameSocket.emit('emitUpdatePersonEffort', data) })

bus.on('sendUpdateEffort', (data) => { gameSocket.emit('sendUpdateEffort', data) })

bus.on('sendAddEffortToOthersCard', (data) => { gameSocket.emit('sendAddEffortToOthersCard', data) })

bus.on('emitUpdateOtherTeamEffort', (data) => { gameSocket.emit('emitUpdateOtherTeamEffort', data) })

// -- Receive --

socket.on('updateGames', (data) => { bus.emit('updateGames', data) })

socket.on('loadGame', (data) => { bus.emit('loadGameMobile', data) })

socket.on('loadTeam', (data) => { bus.emit('loadTeamMobile', data) })

gameSocket.on('loadTeam', (data) => { bus.emit('loadTeam', data) })

export default bus
