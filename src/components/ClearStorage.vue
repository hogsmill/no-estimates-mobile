<template>
  <i class="fas fa-store-alt-slash clear-storage" @click="clearLocalStorage()" />
</template>

<script>
import ls from '../lib/localStorage.js'

export default {
  computed: {
    lsSuffix() {
      return this.$store.getters.lsSuffix
    }
  },
  methods: {
    clearLocalStorage() {
      if (confirm('Clear all your details from this game?')) {
        ls.clear(this.lsSuffix)
        //location.reload()
      }
    }
  }
}
</script>

<style>
  .clear-storage {
    float: right;
  }
</style>
