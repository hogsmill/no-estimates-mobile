<template>
  <div id="app" class="mobile rounded">
    <div class="header">
      <i class="fas fa-cog" @click="toggleSettings()" />
    </div>
    <div v-if="showSettings" class="setup rounded-bottom">
      <Setup :socket="socket" />
    </div>
    <div v-if="!showSettings" class="game">
      <Game :socket="socket" />
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

import Setup from './components/Setup.vue'
import Game from './components/Game.vue'

export default {
  name: 'App',
  components: {
    Setup,
    Game
  },
  data() {
    return {
      showSettings: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    }
  },
  created() {
    let connStr
    if (location.hostname == 'localhost') {
      connStr = 'http://localhost:3018'
    } else {
      connStr = 'https://agilesimulations.co.uk:3018'
    }
    console.log('Connecting to: ' + connStr)
    this.socket = io(connStr)

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
        console.log(data.members)
        this.$store.dispatch('loadTeam', data)
      }
    })
  },
  methods: {
    toggleSettings() {
      this.showSettings = !this.showSettings
    }
  }
}
</script>

<style lang="scss">

  .mobile {
    max-width: 400px;
    margin: 12px auto;

    .header {
      text-align: right;
      padding: 6px;
      background-color: #ccc;

      .fa-cog {
        font-size: x-large;
        color: #888;
      }
    }
  }
</style>
