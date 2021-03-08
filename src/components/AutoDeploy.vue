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
export default {
  props: [
    'socket'
  ],
  computed: {
    capabilities() {
      return this.$store.getters.getCapabilities
    }
  },
  addEffort() {
    alert('Adding effort to autoDeploy')
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
      background-color: #000;
    }
  }
}
</style>
