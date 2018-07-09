<template>
<div>
  <div class="right">
    <router-view></router-view>
  </div>
  <div class="left">
    <h1>listtree插件使用示例</h1>
    <router-link to="/demo1"><h2>一、仿vue官网左侧菜单</h2>
      <div class="content">
        <p>注意观察vue官网左侧菜单可以发现它有下面几个特性：</p>
        <h3>1. 菜单分支前面没有图标</h3>
        <span>  实现方法：设置 icon 参数为 0。</span>
        <h3>2. 除了一级菜单和二级菜单之间没有缩进，其他菜单都缩进了大约18px</h3>
        <span>  实现方法：设置 indent 参数为 18，定义样式 .lt-branch_level_1 span 的 margin-left 为 18px 。</span>
        <h3>3. 除了一级分支和底层分支（没有子级的分支）所有分支样式都一致</h3>
        <span>  实现方法：先设置 .lt-branch span 统一所有分支样式，再单独设置 lt-branch_level_1 span 和 lt-branch_level_0 span 样式（分别为一级分支和底层分支的样式）。</span>
        <h3>4. 鼠标经过二级分支时会出现绿色下划线</h3>
        <span>  实现方法：设置 .lt-branch_level_2 span:hover 样式。</span>
        <h3>5. 在初始状态下除了二级分支是闭合的其他分支都是展开的，而且一级分支永远也不能被闭合</h3>
        <span>  实现方法：设置 open 参数为 ["always", 0, 1]。</span>
        <h3>6. 当某一分支被点击时，该分支样式会发生变化，同时该分支祖先分支中的二级分支样式也会发生变化</h3>
        <span>  实现方法：设置样式 .lt-branch_active span 和 .lt-branch_level_2_active span 。</span>
      </div>
    </router-link>
  </div>
</div>
</template>
<script>
  export default {
  }
</script>
<style scoped>
@import url('./reset.css');
.left{
  position: fixed;
  padding:0 20px;
  width:540px;
  top:0;
  bottom:0;
  left:0;
  background:rgb(231, 230, 230);
  font-size: 14px;
  line-height: 22px;
}
.right{
  margin-left:580px;
  border-left:5px solid rgb(104, 102, 6);
  padding-top:12px;
}
.content{
  display:none;
  margin-left:12px;
}
.router-link-active .content{
  display:block;
}
.content span{
  margin-left: 20px;
}
</style>
