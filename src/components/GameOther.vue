<template>
  <div>
    <div v-for="(card, index) in otherCards" :key="index" class="other-work-card" :style="{ 'background-color': card.team.toLowerCase()}">
      <div class="urgent" v-if="card.urgent">
        URGENT
      </div>
      <div class="other-work-card-header">
        #{{ card.number }}
        {{ card.team }}
      </div>
      <div class="other-work-card-effort" @click="addEffort(card)">
        <div v-for="n in card.teamDependency" :key="n" :class="{'assigned' : n <= card.dependencyDone}" class="other-work-card-column rounded-circle" />
      </div>
      <div v-if="card.dependencyDone == card.teamDependency">
        COMPLETE
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

export default {
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
    myEffort() {
      return this.$store.getters.getMyEffort
    },
    otherCards() {
      return this.$store.getters.getOtherCards
    }
  },
  methods: {
    addEffort(card) {
      let message = ''
      if (this.myEffort.available == 0) {
        message = 'Can\'t assign - all effort assigned'
      } else if (card.dependencyDone == card.teamDependency) {
        message = 'Can\'t assign - card complete'
      }
      if (message) {
        alert(message)
      } else {
        bus.emit('sendAddEffortToOthersCard', {gameName: this.gameName, teamName: this.teamName, card: card, myName: this.myName, effort: 1})
        bus.emit('emitUpdateOtherTeamEffort', {gameName: this.gameName, teamName: this.teamName, card: card, name: this.myName, effort: this.myEffort})
      }
    }
  }
}
</script>

<style lang="scss">
.other-work-card {
  width: 80%;
  margin: 12px auto;
  color: #fff;
  font-size: x-large;
  box-shadow: 2px 2px 5px #444;

  .urgent {
    background-color: red;
    font-weight: bold;
  }

  .other-work-card-column {
    background-color: #fff;
    width: 40px;
    height: 40px;
    margin: 6px;
    display: inline-block;
    box-shadow: 2px 2px 5px #444;

    &.assigned {
      background-color: #888;
    }
  }
}
</style>
