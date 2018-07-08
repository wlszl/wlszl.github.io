<template>
<div>
  <div class="left">
    <h1>listtree插件使用实例</h1>
    <router-link to="/demo1"><h2>一、仿vue官网左侧菜单</h2></router-link>
  </div>
  <div class="right">
    <router-view></router-view>
  </div>
</div>
</template>
<script>
  export default {
  }
</script>
<style>
.left{
  position: fixed;
  padding-left:20px;
  width:500px;
  top:0;
  bottom:0;
  left:0;
  background:rgb(231, 230, 230);
  border-right:5px solid rgb(104, 102, 6);
}
.right{
  margin-left:530px;
}
</style>
