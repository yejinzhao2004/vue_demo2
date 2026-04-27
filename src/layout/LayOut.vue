<template>
  <div class="app-wrapper">
    <el-container>
      <el-aside class="sidebar-container"><Menu /></el-aside>
      <el-container>
        <el-header><Header /></el-header>
        <el-main class="main">
          <div class="tabs-fixed">
            <Tabs />
          </div>
          <div class="content-wrapper">
            <RouterView />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Menu from './MenuPage.vue'
import Tabs from './TabsPage.vue'
import Header from './HeaderPage.vue'
import { RouterView } from 'vue-router'
import router from '@/router'
// 由于/index2为/index1的子路由，所以其实就是在/index1的页面中的子路由展示区即rouerview中展示子路由index2
router.replace('/system/index')
</script>
<style scoped>
.app-wrapper {
  width: 100%;
  height: 100%;
}

.sidebar-container {
  background-color: #1e2733;
  height: 100%;
  width: 200px;
}

.el-container {
  height: 100%;
}

.el-header {
  padding-left: 0px;
  padding-right: 0px;
}

.main {
  padding: 0;
  position: relative;
  overflow: hidden;
}

.tabs-fixed {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #f5f7fa; /* Element Plus默认背景色 */
  margin-bottom: 15px;
}

.content-wrapper {
  height: calc(100% - 44px); /* 减去tabs的高度 */
  overflow-y: auto;
}

:deep(ul.el-menu) {
  border-right-width: 0px;
}
@media (max-width: 768px) {
  .sidebar-container {
    width: 150px;
  }
}
</style>
