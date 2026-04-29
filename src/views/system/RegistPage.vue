<template>
  <!-- userRef取的是el-form的表单实例，内部带的数据就是prop索引的phonenumber和email -->
  <div class="background">
    <el-form ref="userRef" :model="form" :rules="rules" label-width="100px" class="rental-app">
      <el-form-item label="用户名：" prop="username">
        <el-input
          v-model="form.username"
          maxlength="50"
          placeholder="请输入用户名"
        /> </el-form-item
      ><el-form-item label="密码：" prop="password">
        <el-input
          v-model="form.password"
          maxlength="50"
          type="password"
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone_number">
        <el-input
          v-model="form.phone_number"
          maxlength="11"
          @input="handlePhoneInput"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="用户邮箱：" prop="email">
        <el-input v-model="form.email" maxlength="50" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="身份" prop="role">
        <el-radio-group v-model="form.role">
          <el-radio value="houser">房东</el-radio>
          <el-radio value="renter">租客</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button type="primary" @click="reLogin">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import requestUtil from '@/util/request'
import { ElMessage } from 'element-plus'
import router from '@/router'
const form = ref({
  phone_number: '',
  email: '',
  username: '',
  password: '',
  role: '',
})
const userRef = ref(null)
const rules = ref({
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: ['blur'] },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur'],
    },
  ],
  phone_number: [
    { required: true, message: '手机号码不能为空', trigger: ['blur'] },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: ['blur'],
    },
  ],
  username: [{ required: true, message: '用户名不能为空', trigger: ['blur'] }],
  password: [{ required: true, message: '密码不能为空', trigger: ['blur'] }],
  role: [{ required: true, message: '身份不能为空', trigger: ['blur'] }],
})

const handlePhoneInput = (value) => {
  // 只保留数字（0-9）
  form.value.phone_number = value.replace(/\D/g, '')
}

const handleSubmit = () => {
  // 当userRef中的值，也就是el-form的表单对象下的prop对应的参数符合检验规则，也就是rules时，才会给valid赋值true才会继续执行后面的代码
  userRef.value.validate(async (valid) => {
    if (valid) {
      let result = await requestUtil.post('user/Register', form.value)
      let data = result.data
      if (data.code == 200) {
        ElMessage.success(data.info)
        router.replace('/login')
      } else {
        ElMessage.error(data.errorInfo)
      }
    }
  })
}

const reLogin = () => {
  router.replace('/login')
}
</script>

<style scoped>
.background {
  height: 100vh; /* 占满屏幕高度 */
  margin: 0;
  background-image: url('../images/背景.jpg');
  background-size: cover; /* 图片铺满容器，保持比例，裁剪多余部分（登录页首选） */
  background-position: center center; /* 图片居中显示 */
  background-attachment: fixed; /* 滚动时背景固定 */
  padding-top: 160px;
  box-sizing: border-box;
}
.rental-app {
  width: 400px;
  height: 600px;
  background-color: rgb(255, 255, 255);
  text-align: center;
  border-radius: 30px;
  margin: 0 auto;
  padding: 120px 50px;
  box-sizing: border-box;
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 1);
}
</style>
