import Vue from 'vue'
import Router from 'vue-router'
// import Demo1 from './demo/demo1'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/demo1',
      component: (resolve) => require(['./demo/demo1'], resolve),
      name: 'demo1'
    }
  ]
})