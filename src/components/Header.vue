<template>
  <div>
    <h3>
      {{ myName.name }}
    </h3>
    <span v-if="myEffort">
      <span v-for="a in myEffort.available" :key="'a-' + a">
        <div class="mobile-effort full rounded-circle" />
      </span>
      <span v-for="n in myEffort.assigned" :key="'n-' + n">
        <div class="mobile-effort rounded-circle" />
      </span>
    </span>
  </div>
</template>

<script>
export default {
  computed: {
    myName() {
      return this.$store.getters.getMyName
    },
    myEffort() {
      return this.$store.getters.getMyEffort
    }
  }
}
</script>
