<template>
  <table class="setup">
    <tr>
      <td>Game Name: </td>
      <td>
        <select id="available-games" class="form-control" @change="setGameName()">
          <option value="">
            -- Select --
          </option>
          <option v-for="(game, gindex) in availableGames" :key="gindex" :selected="game == gameName">
            {{ game }}
          </option>
        </select>
      </td>
    </tr>

    <!-- Team Name -->

    <tr>
      <td>Team: </td>
      <td>
        <select id="team-name" class="form-control" @change="setTeamName()" :disabled="!gameName">
          <option value="">
            -- Select --
          </option>
          <option v-for="(team, tindex) in activeTeams" :key="tindex" :selected="team.name == teamName">
            {{ team.name }}
          </option>
        </select>
      </td>
    </tr>

    <!-- My Name -->

    <tr>
      <td>My Name: </td>
      <td>
        <select id="my-name-select" class="form-control" @change="selectMyName()" :disabled="!teamName">
          <option value="">
            -- Select --
          </option>
          <option v-for="(member, mindex) in members" :key="mindex" :selected="member.id == myName.id" :value="member.id">
            {{ member.name }}
          </option>
        </select> or
      </td>
    </tr>
    <tr>
      <td />
      <td>
        <input type="text" id="my-name">
        <button class="btn btn-info btn-sm" @click="addMyName()" :disabled="!teamName">
          Add
        </button>
      </td>
    </tr>

    <!-- Role -->

    <tr>
      <td>My Role: </td>
      <td>
        <select id="role-name" class="form-control" @change="selectMyRole()" :disabled="!myName.id" :value="myRole">
          <option value="">
            -- Select --
          </option>
          <option v-for="(role, rindex) in roles" :key="rindex" :selected="role == myRole">
            {{ role }}
          </option>
        </select>
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../socket.js'

import { v4 as uuidv4 } from 'uuid'

export default {
  data() {
    return {
      showSettings: false
    }
  },
  computed: {
    lsSuffix() {
      return this.$store.getters.lsSuffix
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
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
    }
  },
  created() {
    bus.on('updateGames', (data) => {
      this.$store.dispatch('updateGames', data)
    })

    bus.emit('sendGetGames')
  },
  methods: {
    setGameName() {
      const gameName = document.getElementById('available-games').value
      if (gameName) {
        localStorage.setItem('gameName-' + this.lsSuffix, gameName)
        this.$store.dispatch('updateGameName', gameName)
        bus.emit('sendLoadGame', {gameName: gameName})
      } else {
        localStorage.removeItem('gameName-' + this.lsSuffix)
        this.$store.dispatch('updateGameName', '')
        localStorage.removeItem('teamName-' + this.lsSuffix)
        this.$store.dispatch('updateTeamName', '')
        localStorage.removeItem('myName-' + this.lsSuffix)
        this.$store.dispatch('updateMyName', {})
      }
    },
    setTeamName() {
      const teamName = document.getElementById('team-name').value
      if (teamName) {
        localStorage.setItem('teamName-' + this.lsSuffix, teamName)
        this.$store.dispatch('updateTeamName', teamName)
        bus.emit('sendLoadTeam', {gameName: this.gameName, teamName: teamName})
      } else {
        localStorage.removeItem('teamName-' + this.lsSuffix)
        this.$store.dispatch('updateTeamName', teamName)
        localStorage.removeItem('myName-' + this.lsSuffix)
        this.$store.dispatch('updateMyName', {})
      }
    },
    selectMyName() {
      const memberId = document.getElementById('my-name-select').value
      if (memberId) {
        const myName = this.members.find(function(m) {
          return m.id == memberId
        })
        localStorage.setItem('myName-' + this.lsSuffix, JSON.stringify(myName))
        this.$store.dispatch('updateMyName', myName)
      } else {
        localStorage.removeItem('myName-' + this.lsSuffix)
        this.$store.dispatch('updateMyName', {})
      }
    },
    addMyName() {
      const myName = {
        id: uuidv4(),
        name: document.getElementById('my-name').value,
        captain: false
      }
      localStorage.setItem('myName-' + this.lsSuffix, JSON.stringify(myName))
      this.$store.dispatch('updateMyName', myName)
      bus.e$mit('sendAddMyName', {gameName: this.gameName, teamName: this.teamName, myName: myName})
    },
    selectMyRole() {
      const myRole = document.getElementById('role-name').value
      if (myRole) {
        bus.emit('sendSetMyRole', {gameName: this.gameName, teamName: this.teamName, myName: this.myName, myRole: myRole})
      }
    }
  }
}
</script>

<style lang="scss">
  .setup {
    margin: 0 auto;
    padding: 6px;

    input {
      width: initial;
    }

    button {
      margin-left: 6px;
    }
  }
</style>
