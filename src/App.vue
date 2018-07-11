<template>
  <div id="app">
    <div class="listtree"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import Listtree from './lib'
import listData from './listdata.json'

Vue.use(Listtree, {
  listData,
  iconSize: 10,
  open: 0
})
Vue.prototype.$listClick = (r) => {
  console.log(r)
}
export default {
}
</script>

<style>
</style>
