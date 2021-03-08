<template>
  <div v-if="myName.id">
    <div>
      <h3>
        {{ myName.name }}
      </h3>
      <span v-if="myEffort">
        <span v-for="n in myEffort.assigned" :key="'n-' + n">
          <div class="mobile-effort full rounded-circle" />
        </span>
        <span v-for="a in myEffort.available" :key="'a-' + a">
          <div class="mobile-effort rounded-circle" />
        </span>
      </span>
    </div>
    <div v-for="(column, index) in columns" :key="index">
      <div v-if="column.name != 'done'" class="mobile-column" :class="column.name">
        <h4 class="mobile-column-header" :class="column.name">
          {{ columnName(column.name) }}
          <i v-if="iAmThisRole(column.name)" class="fas fa-user" />
          <i v-if="!iAmThisRole(column.name) && iHaveThisRole(column.name)" class="far fa-user" />
        </h4>
        <div v-for="(card, cindex) in column.cards" :key="cindex" class="mobile-card">
          <div v-if="card.urgent" class="urgent">
            URGENT
          </div>
          <div class="mobile-card-header">
            <div class="right">
              {{ effortDone(card) }}/{{ totalEffort(card) }}
            </div>
            <div class="left">
              #{{ card.number }}
            </div>
          </div>
          <table>
            <tr>
              <td>
                <div class="mobile-card-column design" :class="{ 'complete': card.effort.design >= card.design }" @click="addEffort(card, 'design')">
                  <div>Design</div>
                  <div class="effort-div">
                    <div class="effort-done" :style="{ 'width': getEffortDoneWidth(card, 'design') }" />
                  </div>
                </div>
              </td>
              <td>
                <div class="mobile-card-column develop" :class="{ 'complete': card.effort.develop >= card.develop }" @click="addEffort(card, 'develop')">
                  <div>Develop</div>
                  <div class="effort-div">
                    <div class="effort-done" :style="{ 'width': getEffortDoneWidth(card, 'develop') }" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="mobile-card-column test" :class="{ 'complete': card.effort.test >= card.test }" @click="addEffort(card, 'test')">
                  <div>Test</div>
                  <div class="effort-div">
                    <div class="effort-done" :style="{ 'width': getEffortDoneWidth(card, 'test') }" />
                  </div>
                </div>
              </td>
              <td>
                <div class="mobile-card-column deploy" :class="{ 'complete': card.effort.deploy >= card.deploy }" @click="addEffort(card, 'deploy')">
                  <div>Deploy</div>
                  <div class="effort-div">
                    <div class="effort-done" :style="{ 'width': getEffortDoneWidth(card, 'deploy') }" />
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import roles from '../lib/roles.js'
import stringFuns from '../lib/stringFuns.js'

export default {
  props: [
    'socket'
  ],
  computed: {
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
    columns() {
      return this.$store.getters.getColumns
    }
  },
  methods: {
    columnName(name) {
      return stringFuns.properCase(name)
    },
    effortDone(card) {
      return card.effort.design + card.effort.develop + card.effort.test + card.effort.deploy
    },
    iAmThisRole(column) {
      return stringFuns.roleToColumn(this.myRole) == column
    },
    iHaveThisRole(column) {
      return roles.iHaveRole(column, this.myRole, this.myOtherRoles)
    },
    totalEffort(card) {
      return card.design + card.develop + card.test + card.deploy
    },
    getEffortDoneWidth(card, column) {
      return card.effort[column] / card[column] * 100 + '%'
    },
    addEffort(card, column) {
      if (card.effort[column] < card[column]) {
        const str = 'Adding effort to card #' + card.number + ' in ' + column
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

      table {
        width: 100%;
      }
    }

    .mobile-header-cards {
      width: 75%;
    }

    .mobile-card {
      background-color: #fff;
      width: 80%;
      margin: 12px auto;
      box-shadow: 2px 2px 5px #444;
      color: #444;

      .mobile-card-header {
        font-weight: bold;
        font-size: x-large;
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
        padding: 4px;
      }

      .mobile-card-column {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        border-radius: 40px;
        margin: 6px auto;
        padding: 18px 12px;
        border: 1px solid;
        font-weight: bold;
        color: #fff;
        box-shadow: 2px 2px 5px #444;

        &.complete {
          border: 1px dashed #aaa;
          color: #aaa;
          background-color: #fff !important;

          .effort-div, .effort-done {
            background-color: #fff !important;
          }
        }

        .effort-div {
          width: 90%;
          height: 10px;
          margin: 0 auto;
          background-color: #ddd;

          .effort-done {
            height: 10px;
            background-color: #aaa;
          }
        }
      }
    }
  }
</style>
