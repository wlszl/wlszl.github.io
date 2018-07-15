import ListTree from './tree'
const tree = {
  install (Vue, o) {
    var ele = '.listtree'
    if (ele) {
      o.el && (ele = o.el)
      const LTree = Vue.extend(ListTree)
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
        listtree.$mount(ele)
      }, 0)
    }
  }
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(tree, {
    listData,
    open,
    openOnly,
    indent,
    spacing,
    icon,
    iconSize,
    animation
  })
}
export default tree
