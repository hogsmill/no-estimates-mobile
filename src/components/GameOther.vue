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
export default {
  props: [
    'socket'
  ],
  computed: {
    otherCards() {
      console.log(this.$store.getters.getOtherCards)
      return this.$store.getters.getOtherCards
    }
  }
}
</script>

<style lang="scss">
.other-work-card {
  width: 80%;
  margin: 12px auto;
  height: 100px;
  color: #fff;
  font-size: x-large;
  box-shadow: 2px 2px 5px #444;

  .other-work-card-column {
    background-color: #fff;
    width: 40px;
    height: 40px;
    margin: 6px;
    display: inline-block;
    box-shadow: 2px 2px 5px #444;

    &.assigned {
      background-color: #000;
    }
  }
}
</style>
