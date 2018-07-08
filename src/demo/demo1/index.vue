<template>
<div>
  <div class="listtree"></div>
</div>
</template>
<script>
import Vue from 'vue'
import Listtree from '../../lib'
import listData from './listdata.json'

Vue.use(Listtree, {
  listData
})

Vue.prototype.$listClick = (r) => {
  if (typeof r !== 'undefined') {
    console.log(r)
  }
}
export default {
}
</script>
<style>
</style>
