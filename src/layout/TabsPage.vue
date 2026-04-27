<template>
  <!-- v-model="editableTabsValue" 绑定当前激活的标签页,
   存放当前激活的标签页的 name 值，然后对应的标签高亮-->
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    class="demo-tabs"
    closable
    @tab-remove="removeTab"
    @tab-click="clickTab"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref, watch } from 'vue'
import store from '@/store'
import router from '@/router'
const editableTabsValue = ref(store.state.editableTabsValue)
const editableTabs = ref(store.state.editableTabs)

const removeTab = (targetName) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  // 如果删除的标签页是激活的标签页，则标签页高亮切换到删除的标签页的后一个标签页，
  // 若后面的标签不存在，则标签页高亮切换到删除的标签页的前一个标签页
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }
  // 标签页高亮设置
  editableTabsValue.value = activeName
  // 把删除的标签页从 tabs 中删除
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
  // 更新 store 中的数据
  store.state.editableTabsValue = editableTabsValue.value
  store.state.editableTabs = editableTabs.value
  // 跳转至激活的标签页
  router.replace(activeName)
}
// 监听 store 中的数据，当数据改变时，更新组件中的数据
watch(store.state, () => {
  editableTabsValue.value = store.state.editableTabsValue
  editableTabs.value = store.state.editableTabs
})
// 点击标签页，然后跳转至对应的路由
const clickTab = (target) => {
  router.replace(target.props.name)
}
</script>

<style>
.el-card__header {
  border-bottom: 1px solid #6b778c;
}
.demo-tabs > .el-tabs__content {
  padding: 0px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #ffffff;
}
.el-main {
  padding-top: 10px;
  padding-left: 10px;
  background-color: #d4d9e2;
}
</style>
