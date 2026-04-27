<template>
  <!-- 当点击了el-menu-item对应的子菜单后，router会调用element组件内置的router.push函数进行跳转，在当前路由地址寻找到index1组件再在当中寻找可以存放子路由的routerview，当找到之后，在其中呈现el-menu-item提交的子路由对应的组件 -->
  <!-- ：default-active对应的是高亮对象的路由地址-->
  <!-- 当点击tab时，浏览器url变化，会对应着$route.path的变化，从而改变菜单高亮-->
  <el-menu
    active-text-color="#ffd04b"
    background-color="#2d3a4b"
    class="menu-list"
    text-color="#fff"
    router
    :default-active="$route.path"
  >
    <el-menu-item index="/system/index" @click="openTab({ name: '首页', path: '/system/index' })">
      <el-icon>
        <home-filled />
      </el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-menu-item :key="item.id" :index="item.path" v-for="item in menuList" @click="openTab(item)">
      <el-icon><component :is="item.icon" /></el-icon>
      <span>{{ item.name }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import store from '@/store'

const menuList = JSON.parse(sessionStorage.getItem('menuList'))
const openTab = (item) => {
  store.commit('ADD_TABS', item)
}
</script>
<style scoped>
.menu-list {
  padding-left: 5px;
}
</style>
