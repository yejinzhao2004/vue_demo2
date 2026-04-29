<script setup>
import { RouterView } from 'vue-router'
import { onMounted, onBeforeUnmount } from 'vue'
import store from './store'
import { deleteImage } from './util/api'
// 页面关闭前触发（刷新、关闭标签页、前进后退等）
// 在浏览器关闭或刷新时，会触发该事件
const handleBeforeUnload = async () => {
  await deleteImage(store.state.oldUpload)
}

// 组件挂载时添加生命周期钩子
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

// 组件卸载前移除生命周期钩子，避免内存泄漏
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <RouterView />
</template>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
