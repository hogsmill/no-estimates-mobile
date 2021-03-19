<template>
  <div class="auto-deploy">
    <h3>
      Auto Deploy
    </h3>
    <div class="deploy-card-effort" @click="addEffort('auto-deploy')">
      <div v-for="n in 4" :key="n" class="deploy-card-column rounded-circle" :class="{'assigned' : n <= capabilities.autoDeploy.effort}" />
    </div>
    <div class="deploy-card-effort" @click="addEffort('auto-deploy')">
      <div v-for="m in 4" :key="m" class="deploy-card-column rounded-circle" :class="{'assigned' : m + 4 <= capabilities.autoDeploy.effort}" />
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

import roles from '../lib/roles.js'

export default {
  computed: {
    capabilities() {
      return this.$store.getters.getCapabilities
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
    myEffort() {
      return this.$store.getters.getMyEffort
    },
    myRole() {
      return this.$store.getters.getMyRole
    },
    myOtherRoles() {
      return this.$store.getters.getMyOtherRoles
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    }
  },
  methods: {
    addEffort() {
      const column = 'deploy'
      const iHaveRole = roles.iHaveRole(column, this.myRole, this.myOtherRoles)
      const effort = iHaveRole ? 1 : 2
      if (this.myEffort.available >= effort) {
        bus.$emit('sendIncrementAutoDeploy', {gameName: this.gameName, teamName: this.teamName, name: this.myName, effort: effort})
        bus.$emit('emitUpdatePersonAutoDeployEffort', {gameName: this.gameName, teamName: this.teamName, name: this.myName})
      } else {
        alert('No effort available (Autodeploy)')
      }
    }
  }
}
</script>

<style lang="scss">
.auto-deploy {
  width: 80%;
  margin: 12px auto;
  color: #fff;
  font-size: x-large;
  box-shadow: 2px 2px 5px #444;
  background-color: #ddd;

  h3 {
    color: #444;
  }

  .deploy-card-column {
    background-color: #fff;
    border: 1px solid;
    width: 40px;
    height: 40px;
    margin: 6px;
    display: inline-block;
    box-shadow: 2px 2px 5px #444;

    &.assigned {
      background-color: #444;
    }
  }
}
</style>
