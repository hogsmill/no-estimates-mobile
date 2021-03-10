<template>
  <div id="app" class="mobile rounded">
    <div class="header" :style="{ 'background-color': getHeaderColor() }">
      <i class="fas fa-user-friends" :class="{' selected': screen == 'thisTeam' }" @click="setScreen('thisTeam')" />
      <i class="fas fa-users" :class="{' selected': screen == 'otherTeams' }" @click="setScreen('otherTeams')" />
      <i class="fas fa-industry" v-if="capabilities && capabilities.autoDeploy.doing" :class="{' selected': screen == 'autoDeploy' }" @click="setScreen('autoDeploy')" />
      <i class="fas fa-cog" @click="toggleSettings()" />
    </div>
    <div v-if="showSettings" class="setup rounded-bottom">
      <Setup :socket="socket" />
    </div>
    <div v-if="!showSettings && !myName.id" class="game">
      <Intro />
    </div>
    <div v-if="!showSettings && myName.id" class="game">
      <Header />
      <Game v-if="screen == 'thisTeam'" :game-socket="gameSocket" />
      <GameOther v-if="screen == 'otherTeams'" :game-socket="gameSocket" />
      <AutoDeploy v-if="screen == 'autoDeploy'" :game-socket="gameSocket" />
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

import Intro from './components/Intro.vue'
import Setup from './components/Setup.vue'
import Header from './components/Header.vue'
import Game from './components/Game.vue'
import GameOther from './components/GameOther.vue'
import AutoDeploy from './components/AutoDeploy.vue'

export default {
  name: 'App',
  components: {
    Intro,
    Setup,
    Header,
    Game,
    GameOther,
    AutoDeploy
  },
  data() {
    return {
      showSettings: false,
      screen: 'thisTeam'
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    capabilities() {
      return this.$store.getters.getCapabilities
    }
  },
  created() {
    let connStr, gameConnstr
    if (location.hostname == 'localhost') {
      connStr = 'http://localhost:3018'
      gameConnstr = 'http://localhost:3007'
    } else {
      connStr = 'https://agilesimulations.co.uk:3018'
      gameConnstr = 'https://agilesimulations.co.uk:3007'
    }
    console.log('Connecting to: ' + connStr + ' (app)')
    this.socket = io(connStr)
    console.log('Connecting app to: ' + gameConnstr + ' (game)')
    this.gameSocket = io(gameConnstr)

    const gameName = localStorage.getItem('gameName')
    const teamName = localStorage.getItem('teamName')
    if (gameName && teamName) {
      this.$store.dispatch('updateGameName', gameName)
      this.socket.emit('loadGame', {gameName: gameName})
      this.$store.dispatch('updateTeamName', teamName)
      this.socket.emit('loadTeam', {gameName: gameName, teamName, teamName})
    }

    const myName = localStorage.getItem('myName')
    if (myName) {
      this.$store.dispatch('updateMyName', JSON.parse(myName))
    }

    this.socket.on('loadGame', (data) => {
      this.$store.dispatch('loadGame', data)
    })

    this.socket.on('loadTeam', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('loadTeam', data)
      }
    })

    this.gameSocket.on('loadTeam', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('loadTeam', data)
      }
    })
  },
  methods: {
    toggleSettings() {
      this.showSettings = !this.showSettings
    },
    setScreen(screen) {
      this.screen = screen
    },
    getHeaderColor() {
      return this.teamName ? this.teamName.toLowerCase() : '#ccc'
    }
  }
}
</script>

<style lang="scss">

  .mobile {
    max-width: 400px;
    margin: 12px auto;

    .header {
      padding: 6px;
      background-color: #ccc;
      text-align: left;
      opacity: 0.75;

      .fas {
        font-size: x-large;
        color: #888;
        margin-right: 12px;

        &.fa-cog {
          float: right;
        }

        &.selected {
          color: #fff;
        }
      }
    }
  }
</style>
