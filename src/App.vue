<template>
  <div id="app" class="mobile rounded">
    <div class="header" :style="{ 'background-color': getHeaderColor() }">
      <i class="fas fa-user-friends" :class="{' selected': screen == 'thisTeam' }" @click="setScreen('thisTeam')" />
      <i class="fas fa-users" :class="{' selected': screen == 'otherTeams' }" @click="setScreen('otherTeams')" />
      <i class="fas fa-industry" v-if="capabilities && capabilities.autoDeploy.doing" :class="{' selected': screen == 'autoDeploy' }" @click="setScreen('autoDeploy')" />
      <ClearStorage />
      <i class="fas fa-cog" @click="toggleSettings()" />
    </div>
    <div v-if="showSettings" class="setup rounded-bottom">
      <Setup />
    </div>
    <div v-if="!showSettings && !myName.id" class="game">
      <Intro />
    </div>
    <div v-if="!showSettings && myName.id" class="game">
      <Header />
      <Game v-if="screen == 'thisTeam'" />
      <GameOther v-if="screen == 'otherTeams'" />
      <AutoDeploy v-if="screen == 'autoDeploy'" />
    </div>
  </div>
</template>

<script>
import bus from './socket.js'

import params from './lib/params.js'

import Intro from './components/Intro.vue'
import Setup from './components/Setup.vue'
import Header from './components/Header.vue'
import ClearStorage from './components/ClearStorage.vue'
import Game from './components/Game.vue'
import GameOther from './components/GameOther.vue'
import AutoDeploy from './components/AutoDeploy.vue'

export default {
  name: 'App',
  components: {
    Intro,
    Setup,
    Header,
    ClearStorage,
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
    lsSuffix() {
      return this.$store.getters.lsSuffix
    },
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
    let appType = 'No Estimates'
    if (process.env.VUE_APP_TYPE) {
      appType = process.env.VUE_APP_TYPE
    } else if (params.getParam('appType')) {
      // To allow appType switching in dev
      appType = params.getParam('appType')
    }
    this.$store.dispatch('updateAppType', appType)

    const gameName = localStorage.getItem('gameName-' + this.lsSuffix)
    const teamName = localStorage.getItem('teamName-' + this.lsSuffix)
    if (gameName && teamName) {
      this.$store.dispatch('updateGameName', gameName)
      bus.$emit('sendLoadGame', {gameName: gameName})
      this.$store.dispatch('updateTeamName', teamName)
      bus.$emit('sendLoadTeam', {gameName: gameName, teamName, teamName})
    }

    const myName = localStorage.getItem('myName-' + this.lsSuffix)
    if (myName) {
      this.$store.dispatch('updateMyName', JSON.parse(myName))
    }

    bus.$on('loadGameMobile', (data) => {
      this.$store.dispatch('loadGame', data)
    })

    bus.$on('loadTeamMobile', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('loadTeam', data)
      }
    })

    bus.$on('loadTeam', (data) => {
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
