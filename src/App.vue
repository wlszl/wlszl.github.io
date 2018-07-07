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
  listData
})
Vue.prototype.$listClick = (r) => {
  console.log(r)
}
export default {
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
