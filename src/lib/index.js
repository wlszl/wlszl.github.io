import myTree from './tree'
const tree = {
  install (Vue, o) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    const LTree = Vue.extend(myTree)
    const listtree = new LTree({propsData: {
      listData: o.listData,
      open: o.open,
      openOnly: o.openOnly,
      indent: o.indent,
      spacing: o.spacing,
      icon: o.icon,
      iconSize: o.iconSize,
      animation: o.animation
    }})
    setTimeout(() => {
      listtree.$mount('.listtree')
    }, 0)
  }
}
export default tree
