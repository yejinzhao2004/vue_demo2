<template>
  <div class="background">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="rental-app">
      <el-form-item prop="username" class="input-shadow">
        <b class="input-title">账号</b>
        <el-input v-model="loginForm.username" type="text" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item prop="password" class="input-shadow">
        <b class="input-title">密码</b>
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      <div class="register"><RouterLink to="/regist">注册</RouterLink></div>
      <div @click="handleLogin" class="button-right">登录</div>
      <el-checkbox name="rememberMe" class="rememberPwd" v-model="loginForm.rememberMe"
        >记住密码</el-checkbox
      >
    </el-form>
  </div>
</template>

<script setup>
import requestUtil from '@/util/request'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'
import router from '@/router'
import { encryptPassword, decryptPassword } from '@/util/encryptUtil'

const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false,
})
const loginRef = ref(null)
const loginRules = {
  username: [{ required: true, trigger: ['blur'], message: '请输入您的账号' }],
  password: [{ required: true, trigger: ['blur'], message: '请输入您的密码' }],
}
const handleLogin = () => {
  loginRef.value.validate(async (valid) => {
    if (valid) {
      let result = await requestUtil.post('user/Login', loginForm.value)
      let data = result.data
      if (data.code === 200) {
        if (data.user.status === '启用') {
          ElMessage.success(data.info)
          window.sessionStorage.setItem('token', data.token)
          window.sessionStorage.setItem('user', JSON.stringify(data.user)) //sessionStorage只认字符串，给这俩数组转换成字符串
          window.sessionStorage.setItem('menuList', JSON.stringify(data.menuList))
          window.sessionStorage.setItem('role', JSON.stringify(data.role))
          if (loginForm.value.rememberMe) {
            Cookies.set('username', loginForm.value.username, { expires: 30, sameSite: 'strict' })
            // 加密密码后再保存到cookie
            const encryptedPassword = encryptPassword(loginForm.value.password)
            Cookies.set('password', encryptedPassword, { expires: 30, sameSite: 'strict' })
            Cookies.set('rememberMe', loginForm.value.rememberMe, {
              expires: 30,
              sameSite: 'strict',
            })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          router.replace('/system/index')
        }
        if (data.user.status === '停用') {
          ElMessage.error('该账号已被停用，详情请联系客服咨询')
        }
      } else {
        ElMessage.error(data.errorInfo)
      }
    }
  })
}
const getCookie = () => {
  const username = Cookies.get('username')
  const encryptedPassword = Cookies.get('password')
  const rememberMe = Cookies.get('rememberMe')
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    // 解密从cookie中获取的密码
    password:
      encryptedPassword === undefined
        ? loginForm.value.password
        : decryptPassword(encryptedPassword),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
  }
}

// 页面加载时自动调用，填充表单
getCookie()
</script>

<style scoped>
.rememberPwd {
  margin-top: 30px;
}
.el-message {
  font-size: 16px;
}
.background {
  height: 100vh; /* 占满屏幕高度 */
  margin: 0;
  background-image: url('../../../src/images/背景.jpg');
  background-size: cover; /* 图片铺满容器，保持比例，裁剪多余部分（登录页首选） */
  background-position: center center; /* 图片居中显示 */
  background-attachment: fixed; /* 滚动时背景固定 */
  padding-top: 200px;
  padding-bottom: 200px;
  box-sizing: border-box;
}
.rental-app {
  width: 400px;
  height: 550px;
  background-color: rgb(255, 255, 255);
  text-align: center;
  margin: 0 auto;
  border-radius: 30px;
  padding-top: 60px;
  padding-bottom: 50px;
  box-sizing: border-box;
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 1);
}

.input-shadow {
  padding-right: 15px;
  padding-bottom: 5px;
  padding-left: 15px;
  box-sizing: border-box;
  margin-top: 50px;
  margin-left: 25%;
  margin-right: 25%;
  display: flex;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 1);
  border-radius: 15px;
  align-items: center;
}

.input-title {
  user-select: none;
  width: 80px;
  line-height: 50px;
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 3px;
}
.register {
  height: 27px;
  line-height: 27px;
  width: 60px;
  margin: 90px auto;
  font-size: 25px;
  font-weight: 400;
  user-select: none;
  cursor: pointer;
}
.button-right {
  line-height: 30px;
  height: 30px;
  width: 60px;
  color: rgb(172, 169, 169);
  font-size: 25px;
  font-weight: 600;
  margin-top: -250px;
  margin-left: 78%;
  border: 2px solid rgb(172, 169, 169);
  border-radius: 10px;
  user-select: none;
  cursor: pointer;
}
.button-right:hover {
  border: 2px solid rgb(30, 184, 255);
}
.button-right:active {
  color: rgb(30, 184, 255);
  border: 2px solid rgb(30, 184, 255);
}
</style>
