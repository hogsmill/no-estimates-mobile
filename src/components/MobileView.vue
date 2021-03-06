<template>
  <div class="mobile rounded">
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
import stringFuns from '../lib/stringFuns.js'

import Setup from './mobile/Setup.vue'
import Game from './mobile/Game.vue'

export default {
  props: [
    'socket'
  ],
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
    myName() {
      return this.$store.getters.getMyName
    },
    myEffort() {
      return this.$store.getters.getMyEffort
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    activeTeams() {
      return this.$store.getters.getActiveTeams
    },
    members() {
      return this.$store.getters.getMembers
    },
    roles() {
      return this.$store.getters.getRoleNames
    },
    myRole() {
      return this.$store.getters.getMyRole
    },
    availableGames() {
      return this.$store.getters.getAvailableGames
    },
    columns() {
      return this.$store.getters.getColumns
    }
  },
  created() {
    this.socket.on('updateGames', (data) => {
      this.$store.dispatch('updateGames', data)
    })

    this.socket.emit('getGames')
  },
  methods: {
    toggleSettings() {
      this.showSettings = !this.showSettings
    },
    columnName(name) {
      return stringFuns.properCase(name)
    },
    effortDone(card) {
      return card.effort.design + card.effort.develop + card.effort.test + card.effort.deploy
    },
    totalEffort(card) {
      return card.design + card.develop + card.test + card.deploy
    },
    addEffort(card, column) {
      if (card.effort[column] < card[column]) {
        const str = 'Adding effort to #' + card.number + ' in ' + column
        alert(str)
      }
    }
  }
}
</script>

<style lang="scss">
$design: #b10018;
$develop: #76a001;
$test: #0067b1;
$deploy: #4f0384;
$done: navy;

.design {
  background-color: $design;
}
.develop {
  background-color: $develop;
}
.test {
  background-color: $test;
}
.deploy {
  background-color: $deploy;
}

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

  .setup {
    padding: 6px;
  }

  .game {

    .mobile-effort {
      width: 16px;
      height: 16px;
      border: 1px solid;
      display: inline-block;
      margin: 0 2px;
      position: relative;
      color: #444;
      box-shadow: 2px 2px 3px #444;

      &.full {
        background-color: #444;
      }
    }

    .mobile-column-header {
      color: #fff;
      padding: 3px;
    }

    .mobile-column {
      padding-bottom: 12px;
    }

    .mobile-header-cards {
      width: 75%;
    }

    .mobile-card {
      background-color: #fff;
      width: 80%;
      margin: 12px auto;
      box-shadow: 2px 2px 3px #444;
      color: #444;

      .mobile-card-header {
        font-weight: bold;
      }

      .left {
        text-align: left;
        padding: 6px;
        width: 100px;
        float: left;
      }

      .right {
        padding: 6px;
        width: 100px;
        float: right;
      }

      .urgent {
        background-color: red;
        color: white;
        font-weight: bold;
      }

      .mobile-card-column {
        margin: 0 auto;
        width: 100px;
        margin: 6px auto;
        padding: 12px;
        border: 1px solid;
        font-weight: bold;
        color: #fff;

        &.complete {
          border: 1px dashed #aaa;
          color: #aaa;
          background-color: #fff !important;
        }
      }
    }
  }
}
</style>
