import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    thisGame: 'No Estimates',
    connections: 0,
    walkThrough: false,
    currentTab: 'game',
    host: false,
    hostId: '',
    stealth: false,
    currency: '&#163;',
    gameName: '',
    members: [],
    myName: {id: '', name: '', captain: false, host: false},
    myRole: '',
    teamName: '',
    teams: [
      { name: 'Blue', include: true },
      { name: 'Green', include: true },
      { name: 'Purple', include: true },
      { name: 'Red', include: true },
      { name: 'Orange', include: false },
      { name: 'Black', include: false },
      { name: 'Grey', include: false },
      { name: 'Brown', include: false },
      { name: 'Magenta', include: false },
      { name: 'Salmon', include: false },
      { name: 'Teal', include: false },
      { name: 'Navy', include: false },
      { name: 'Olive', include: false },
      { name: 'Turquoise', include: false },
      { name: 'Tan', include: false }
    ],
    pairing: [],
    message: '',
    roles: [
      'Designer',
      'Developer',
      'Tester',
      'Deployer'
    ],
    columns: [
      {name: 'design', order: 1, cards: []},
      {name: 'develop', order: 2, cards: []},
      {name: 'test', order: 3, cards: []},
      {name: 'deploy', order: 4, cards: []},
      {name: 'done', order: 5, cards: []}
    ],
    currentDay: 1,
    eventCards: [
      {number: 1, text: 'Good Luck!<br/><br/>. Have you submitted an initial estimate for the project?<br/><br/>If not, click \'Report\' or \'Set Estimates\' and create your estimate now.'},
      {number: 2, text: 'Remember that manual deployments will fail a certain percentage of the time. In this case, you will need to re-do the deployment effort.'},
      {number: 3, function: 'Add 1 Point To Everyones Capacity', text: 'Pizza inspires your team to greatness! Add one to each person\'s capacity tomorrow.'},
      {number: 4, text: 'Did you remember that people can work in areas outside their speciality? They require two effort points to make one effort point in another area.'},
      {number: 5, function: 'Add 8 points to Deploy', confirm: true, autoDeployCard: true, text: 'You read that automating deployments can lead to better quality and more predictable delivery. If you\'d like to invest in that, you\'ll need to spend 8 effort points in Deploy (you can do this over multiple days)</br></br>(<em>You can do this later by clicking the \'*\' in the Deploy Column header</em>)'},
      {number: 6, text: 'Would someone like to learn a new skill? If a person spends five days working in a work stage different from his or her speciality, the person will be able to work in that state at a 1:1 effort ratio.'},
      {number: 7, text: 'Perhaps you have delivered at least one card? If so, are you able to forecast when you might deliver the Minimum Viable Product, which the Product Owner has defined as cards #1-11 '},
      {number: 8, text: 'In this game, you may have been committing to work on an individual work-item basis. Now a new Scrum Master has joined the company, and she wants you to do batch commitment (i.e. pull in as many stories at once as you believe you can accomplish in a week). Will you do this?'},
      {number: 9, function: 'Concurrent Dev and Test', confirm: true, text: 'Testers and Developers want to work together. You now have the option to do concurrent Dev and Test (i.e. no need to finish Development effort before beginning Testing). Do you want to do this?'},
      {number: 10, function: 'Spend a Day Estimating', text: 'Vince from the PMO says he\'s nervous that you\'re not producing enough according to your original estimate. As a result, he wants you to spend time re-estimating. Lock the team in a room for a day and do no delivery work tomorrow - update your estimate for delivering the entire project then click Next to go to the next day.'},
      {number: 11, text: 'Vince is satisfied with your estimate and sends it around to the business in an email titled \'Team commits to deadline\''},
      {number: 12, function: 'Lose Tester', text: 'Your organisation has lost a tester so if you have testers, one of them now has to support multiple teams. One tester loses two points of effort tomorrow.'},
      {number: 13, function: 'Recharting', text: 'Team rechartering! Would you like to restructure your team? Feel free to change role specialties (<i>click on \'Set Up\'</i>)  or negotiate with other teams to bring on new members. (Use the chat to talk to other teams!)'},
      {number: 14, text: 'If you restructured your team yesterday, how do you expect the change to impact your forecast?'},
      {number: 15, text: 'Jim from accounting sales sends an email directing employees to make sure they\'re fully utilised (i.e. follow a policy that you do not leave capacity on the table). Do you obey or silently ignore him?'},
      {number: 16, function: 'Show Cycle Time', height: 650, text: 'This graph shows how long each card took to complete, compared to their size - is there a relationship between size and time to complete?'},
      {number: 17, text: 'How much work in progress do you have? Has that changed from earlier?'},
      {number: 18, text: 'Many teams follow a batch-and-queue policy when it comes to deployment. That is, they develop work in sprints and then hand over the work to be deployed in a batch, often by a separate Operations group. What policy are you following in this game and why?'},
      {number: 19, text: 'Organizations often wonder what their delivery capacity is. Do you have a sense of your team\'s capacity? If so , how would you communicate it to stakeholders?'},

    ],
    workCards: [
      {number: 1, design: 6, develop: 7, test: 8, deploy: 2, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 2, design: 0, develop: 8, test: 6, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 3, design: 10, develop: 9, test: 9, deploy: 3, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 4, design: 4, develop: 9, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 5, design: 4, develop: 10, test: 5, deploy: 2, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 6, design: 1, develop: 8, test: 2, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 7, design: 1, develop: 10, test: 3, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 8, design: 0, develop: 4, test: 3, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 9, design: 10, develop: 4, test: 10, deploy: 6, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 10, design: 1, develop: 7, test: 10, deploy: 8, urgent: true, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 11, design: 8, develop: 10, test: 10, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 12, design: 3, develop: 8, test: 11, deploy: 3, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 13, design: 0, develop: 6, test: 9, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 14, design: 1, develop: 6, test: 3, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 15, design: 10, develop: 1, test: 5, deploy: 2, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 16, design: 2, develop: 5, test: 1, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 17, design: 3, develop: 6, test: 8, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 18, design: 0, develop: 7, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 19, design: 5, develop: 9, test: 4, deploy: 7, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 20, design: 8, develop: 8, test: 3, deploy: 7, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 21, design: 1, develop: 6, test: 5, deploy: 1, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 22, design: 0, develop: 10, test: 7, deploy: 7, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 23, design: 5, develop: 10, test: 11, deploy: 8, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 24, design: 0, develop: 6, test: 4, deploy: 6, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 25, design: 3, develop: 2, test: 2, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}}
    ],
    otherCards: [],
    currentWorkCard: 0,
    messages: {},
    facilitatorMessages: {},
    config: {
      facilitatorStarts: false,
      gameRunning: false,
      doRetros: false,
      retroDays: 7,
      retroTimer: false,
      retroTime: 0,
      mvpCards: 11,
      percentageBlocked: 0.05,
      percentageDeployFail: 0.5
    },
    sourcesOfVariation: [],
    graphConfig: {
      wip: {
        useMovingAverage: true,
        useDays: true
      },
      cumulativeFlow: {
        useDays: true
      },
      cycleTime: {
        small: 15,
        medium: 25
      },
      monteCarlo: {
        runs: 1000,
        runTo: '50'
      }
    },
    demoConfig: {
      runTo: 'MVP',
      runToCards: 11,
      stepThrough: false,
      running: false
    },
    selectedGraphTeam1: 'Blue',
    selectedGraphTeam2: 'Red',
    selectedGraphTeam3: 'Green',
    retrosDone: {},
    recharting: false,
    concurrentDevAndTest: false,
    autoDeploy: {
      doing: false,
      effort: 0,
      done: false
    },
    projectEstimate: 0,
    projectActual: 0,
    mvpEstimate: 0,
    mvpActual: 0,
    reEstimate: 0,
    gameState: [],
    games: []
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    getCurrentTab: (state) => {
      return state.currentTab
    },
    getWalkThrough: (state) => {
      return state.walkThrough
    },
    getHost: (state) => {
      return state.host
    },
    getHostId: (state) => {
      return state.hostId
    },
    getStealth: (state) => {
      return state.stealth
    },
    getCurrency: (state) => {
      return state.currency
    },
    getAvailableGames: (state) => {
      console.log(state)
      return state.availableGames
    },
    getGameName: (state) => {
      return state.gameName
    },
    getMyName: (state) => {
      return state.myName
    },
    getMyRole: (state) => {
      let role = ''
      const me = state.members.find(function(m) {
        return m.id == state.myName.id
      })
      role = me ? me.role : ''
      return role
    },
    getMyOtherRoles: (state) => {
      let roles = []
      const me = state.members.find(function(m) {
        return m.id == state.myName.id
      })
      roles = me ? me.otherRoles : []
      return roles
    },
    getMessage: (state) => {
      return state.message
    },
    getMyEffort: (state) => {
      let effort
      const me = state.members.find(function(m) {
        return m.id == state.myName.id
      })
      if (me) {
        effort = me.effort
      }
      return effort
    },
    getTeamName: (state) => {
      return state.teamName
    },
    getOtherCards: (state) => {
      return state.otherCards
    },
    getCapabilities: (state) => {
      return {
        concurrentDevAndTest: state.concurrentDevAndTest,
        autoDeploy: state.autoDeploy,
        recharting: state.recharting
      }
    },
    getMyTeamMembers: (state) => {
      let n = 0
      if (state.stealth) {
        for (let i = 0; i < state.members.length; i++) {
          if (!state.members[i].host) {
            n = n + 1
          }
        }
      } else {
        n = state.members.length
      }
      return n
    },
    getMembers: (state) => {
      const members = []
      for (let i = 0; i < state.members.length; i++) {
        if (!(state.stealth && state.members[i].host)) {
          members.push(state.members[i])
        }
      }
      return members
    },
    getTeams: (state) => {
      return state.teams
    },
    getActiveTeams: (state) => {
      const teams = []
      for (let i = 0; i < state.teams.length; i++) {
        if (state.teams[i].include) {
          teams.push(state.teams[i])
        }
      }
      return teams
    },
    getMessages: (state) => {
      return state.messages
    },
    getFacilitatorMessages: (state) => {
      return state.facilitatorMessages
    },
    getPairing: (state) => {
      return state.pairing
    },
    getFacilitatorStarts: (state) => {
      return state.config.facilitatorStarts
    },
    getGameRunning: (state) => {
      return state.config.gameRunning
    },
    getPercentageBlocked: (state) => {
      return state.config.percentageBlocked
    },
    getPercentageDeployFail: (state) => {
      return state.config.percentageDeployFail
    },
    getMvpCards: (state) => {
      return state.config.mvpCards
    },
    getDoRetros: (state) => {
      return state.config.doRetros
    },
    getRetroDays: (state) => {
      return state.config.retroDays
    },
    getRetroTimer: (state) => {
      return state.config.retroTimer
    },
    getRetroTime: (state) => {
      return state.config.retroTime
    },
    getRetrosDone: (state) => {
      return state.retrosDone
    },
    getGraphConfig: (state) => {
      return state.graphConfig
    },
    getDemoConfig: (state) => {
      return state.demoConfig
    },
    getSelectedGraphTeam1: (state) => {
      return state.selectedGraphTeam1
    },
    getSelectedGraphTeam2: (state) => {
      return state.selectedGraphTeam2
    },
    getSelectedGraphTeam3: (state) => {
      return state.selectedGraphTeam3
    },
    getCurrentDay: (state) => {
      return state.currentDay
    },
    getRoleNames: (state) => {
      return state.roles
    },
    getRoles: (state) => {
      const roles = []
      for (let r = 0; r < state.roles.length; r++) {
        const role = {
          role: state.roles[r]
        }
        const names = []
        const otherNames = []
        for (let i = 0; i < state.members.length; i++) {
          if (state.roles[r] == state.members[i].role) {
            names.push(state.members[i])
          }
          for (let j = 0; j < state.members[i].otherRoles.length; j++) {
            if (state.roles[r] == state.members[i].otherRoles[j]) {
              otherNames.push(state.members[i])
            }
          }
        }
        role.names = names
        role.otherNames = otherNames
        roles.push(role)
      }
      return roles
    },
    getColumns: (state) => {
      return state.columns
    },
    getCurrentEventCard: (state) => {
      const card = state.eventCards.find(function(c) {
        return c.number == state.currentDay
      })
      return card ? card : {number: state.currentDay}
    },
    getCurrentWorkCard: (state) => {
      if (state.currentWorkCard < state.workCards.length) {
        return state.currentWorkCard
      } else {
        return false
      }
    },
    getWorkCards: (state) => {
      return state.workCards
    },
    getNoOfDoneCards: (state) => {
      let n
      for (let i = 0; i < state.columns.length; i++) {
        if (state.columns[i].name == 'done') {
          n = state.columns[i].cards.length
        }
      }
      return n
    },
    getProjectEstimate: (state) => {
      return state.projectEstimate
    },
    getProjectActual: (state) => {
      return state.projectActual
    },
    getMvpEstimate: (state) => {
      return state.mvpEstimate
    },
    getMvpActual: (state) => {
      return state.mvpActual
    },
    getReEstimate: (state) => {
      return state.reEstimate
    },
    getGameState: (state) => {
      return state.gameState
    },
    getGames: (state) => {
      return state.games
    },
    getSourcesOfVariation: (state) => {
      return state.sourcesOfVariation
    },
    getAvailableGames: (state) => {
      const games = []
      for (let i = 0; i < state.games.length; i++) {
        if (state.games[i].include) {
          games.push(state.games[i].gameName)
        }
      }
      return games
    },
    getConnections: (state) => {
      return state.connections
    }
  },
  mutations: {
    updateCurrentTab: (state, payload) => {
      state.currentTab = payload
    },
    updateWalkThrough: (state, payload) => {
      state.walkThrough = payload
    },
    updateHost: (state, payload) => {
      state.host = payload
    },
    updateHostId: (state, payload) => {
      state.hostId = payload
    },
    updateStealth: (state, payload) => {
      state.stealth = payload.stealth
    },
    loadAvailableGames: (state, payload) => {
      state.availableGames = payload.games
    },
    loadMembers: (state, payload) => {
      state.members = payload.members
    },
    loadTeam: (state, payload) => {
      state.members = payload.members
      state.workCards = payload.workCards
      state.otherCards = payload.otherCards
      state.columns = payload.columns
      state.daysEffort = payload.daysEffort
      state.retrosDone = payload.retrosDone
      state.currentDay = payload.currentDay
      state.currentWorkCard = payload.currentWorkCard
      state.messages = payload.messages
      state.config = payload.config
      state.projectEstimate = payload.projectEstimate
      state.reEstimate = payload.reEstimate
      state.projectActual = payload.projectActual
      state.mvpEstimate = payload.mvpEstimate
      state.mvpActual = payload.mvpActual
      state.pairing = payload.pairing
      state.recharting = payload.recharting
      state.concurrentDevAndTest = payload.concurrentDevAndTest
      state.canStartAutoDeploy = payload.canStartAutoDeploy
      state.autoDeploy = payload.autoDeploy

      const member = state.members.find(function(m) {
        return m.id == state.myName.id
      })
    },
    loadGame: (state, payload) => {
      state.teams = payload.teams
    },
    updateGameName: (state, payload) => {
      state.gameName = payload
    },
    updateMyName: (state, payload) => {
      if (payload.uuid && payload.uuid == state.myName.uuid) {
        state.myName.name = payload.name
        state.myName.captain = payload.captain
        state.myName.host = payload.host
      } else {
        state.myName = payload
      }
    },
    updateMessage: (state, payload) => {
      state.message = payload
    },
    updateTeamName: (state, payload) => {
      state.teamName = payload
    },
    setSelectedGraphTeam: (state, payload) => {
      switch(payload.n) {
        case 1:
          state.selectedGraphTeam1 = payload.team
          break
        case 2:
          state.selectedGraphTeam2 = payload.team
          break
        case 3:
          state.selectedGraphTeam3 = payload.team
          break
      }
    },
    updateGameState: (state, payload) => {
      state.gameState = payload.gameState
    },
    updateGames: (state, payload) => {
      state.games = payload
    },
    updateGameDetails: (state, payload) => {
      for (let i = 0; i < state.games.length; i++) {
        if (state.games[i].gameName == payload.gameName) {
          state.games[i].hosts = payload.details.hosts
        }
      }
    },
    updateSourcesOfVariation: (state, payload) => {
      state.sourcesOfVariation = payload
    },
    updateConnections: (state, payload) => {
      state.connections = payload
    }
  },
  actions: {
    updateCurrentTab: ({ commit }, payload) => {
      commit('updateCurrentTab', payload)
    },
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
    },
    updateHostId: ({ commit }, payload) => {
      commit('updateHostId', payload)
    },
    updateStealth: ({ commit }, payload) => {
      commit('updateStealth', payload)
    },
    loadAvailableGame: ({ commit }, payload) => {
      commit('loadAvailableGame', payload)
    },
    loadGame: ({ commit }, payload) => {
      commit('loadGame', payload)
    },
    loadMembers: ({ commit }, payload) => {
      commit('loadMembers', payload)
    },
    loadTeam: ({ commit }, payload) => {
      commit('loadTeam', payload)
    },
    updateGameName: ({ commit }, payload) => {
      commit('updateGameName', payload)
    },
    updateMyName: ({ commit }, payload) => {
      commit('updateMyName', payload)
    },
    updateMessage: ({ commit }, payload) => {
      commit('updateMessage', payload)
    },
    updateTeamName: ({ commit }, payload) => {
      commit('updateTeamName', payload)
    },
    setSelectedGraphTeam: ({ commit }, payload) => {
      commit('setSelectedGraphTeam', payload)
    },
    updateGameState: ({ commit }, payload) => {
      commit('updateGameState', payload)
    },
    updateGames: ({ commit }, payload) => {
      commit('updateGames', payload)
    },
    updateGameDetails: ({ commit }, payload) => {
      commit('updateGameDetails', payload)
    },
    updateSourcesOfVariation: ({ commit }, payload) => {
      commit('updateSourcesOfVariation', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    }
  }
})
