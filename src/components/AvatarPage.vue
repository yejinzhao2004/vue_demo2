<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar shape="square" :size="50" :src="avatarUrl" />
      &nbsp;&nbsp;{{ user.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="userlink">个人中心</el-dropdown-item>
        <el-dropdown-item @click="logout">安全退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { getServerUrl } from '@/util/request'
import router from '@/router'
import store from '@/store'
import { onMounted, ref, watch } from 'vue'
import { deleteImage } from '@/util/api'

const avatarUrl = ref('')
const user = JSON.parse(sessionStorage.getItem('user'))

const getAvatarUrl = (avatar) => {
  return avatar ? getServerUrl() + 'media/userAvatar/' + avatar : '/default-avatar.png'
}

const logout = async () => {
  if (store.state.oldUpload) {
    await deleteImage(store.state.oldUpload)
  }
  window.sessionStorage.clear()
  router.replace('/login')
  store.commit('RESET_TAB')
  store.state.ifUpload = false
  store.state.oldUpload = null
}

const item = ref({
  name: '个人中心',
  path: '/system/userCenter',
})
const userlink = () => {
  store.commit('ADD_TABS', item.value)
  router.push('/system/userCenter')
}
// watch 的第一个参数需要是一个响应式数据源,store.state.avatar并非一个响应式的数据源，所以不能用watch监听
/*
watch(store.state.avatar, () => {
  avatarUrl.value = getServerUrl() + 'media/userAvatar/' + store.state.avatar
})
  */
watch(
  /*作为一个getter函数，将监听得到store.state.avatar作为参数传入newAvatar， 是一个响应式的数据源 */
  () => store.state.avatar,
  (newAvatar) => {
    avatarUrl.value = getServerUrl() + 'media/userAvatar/' + newAvatar
  },
)
onMounted(() => {
  avatarUrl.value = getAvatarUrl(user.avatar)
})
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  color: #2080da;
  align-items: center;
}
</style>
