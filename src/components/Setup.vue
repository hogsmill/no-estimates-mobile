<template>
  <table class="setup">
    <tr>
      <td>Game Name: </td>
      <td>
        <select id="available-games" class="form-control" @change="setGameName()">
          <option value=""> -- Select -- </option>
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
        <select id="team-name" class="form-control" @change="setTeamName()" >
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
        <select id="my-name-select" class="form-control">
        <option value="">
            -- Select --
          </option>
          <option v-for="(member, mindex) in members" :key="mindex" :selected="member.id == myName.id">
            {{ member.name }}
          </option>
        </select>
      </td>
    </tr>

    <!-- Role -->

    <tr>
      <td>My Role: </td>
      <td>
        <select id="role-select" class="form-control">
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
export default {
  props: [
    'socket'
  ],
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
    const gameName = localStorage.getItem('gameName')
    const teamName = localStorage.getItem('teamName')
    if (gameName && teamName) {
      this.$store.dispatch('updateGameName', gameName)
      this.socket.emit('loadGame', {gameName: gameName})
      this.$store.dispatch('updateTeamName', teamName)
      this.socket.emit('loadTeam', {gameName: gameName, teamName, teamName})
    }

    this.socket.on('updateGames', (data) => {
      this.$store.dispatch('updateGames', data)
    })

    this.socket.emit('getGames')
  },
  methods: {
    setGameName() {
      const gameName = document.getElementById('available-games').value
      localStorage.setItem('gameName', gameName)
      this.$store.dispatch('updateGameName', gameName)
      this.socket.emit('loadGame', {gameName: gameName})
    },
    setTeamName() {
      const teamName = document.getElementById('team-name').value
      localStorage.setItem('teamName', teamName)
      this.$store.dispatch('updateTeamName', teamName)
      this.socket.emit('loadTeam', {gameName: this.gameName, teamName: teamName})
    }
  }
}
</script>

<style lang="scss">
  .setup {
    margin: 0 auto;
    padding: 6px;
  }
</style>
