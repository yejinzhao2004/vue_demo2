<template>
  <el-form ref="pwdRef" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="form.oldPassword"
        placeholder="请输入旧密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="form.newPassword"
        placeholder="请输入新密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label="再次输入" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        placeholder="请确认密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'
import requestUtil from '@/util/request'
import { ElMessage } from 'element-plus'

const props = defineProps({
  user: {
    type: Object,
    default: () => {},
    required: true,
  },
})

const form = ref({
  id: -1,
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const pwdRef = ref(null)

form.value = props.user

const rules = ref({
  newPassword: { required: true, message: '新密码不能为空', trigger: ['blur'] },
  oldPassword: { required: true, message: '旧密码不能为空', trigger: ['blur'] },
  confirmPassword: {
    required: true,
    message: '请输入确认密码',
    trigger: ['blur'],
  },
})
const handleSubmit = () => {
  pwdRef.value.validate(async (valid) => {
    if (valid) {
      let result = await requestUtil.post('user/UpdateUserPwd', form.value)
      let data = result.data
      if (data.code == 200) {
        ElMessage.success('密码修改成功')
      } else ElMessage.error(data.errorInfo)
    }
  })
}
</script>

<style scoped></style>
