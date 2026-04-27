<template>
  <!-- userRef取的是el-form的表单实例 -->
  <el-form ref="userRef" :model="form" :rules="rules" label-width="100px">
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
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'
import requestUtil from '@/util/request'
import { ElMessage } from 'element-plus'
// props接收由defineprops传来的父组件的传值
const props = defineProps({
  user: {},
})
const form = ref({})
const userRef = ref(null)
const emit = defineEmits(['saved'])
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
})
// form的值被初始化为父组件传来的user，该对象内就不止id，phonenumber，email三个属性了，而是user的所有属性
//{...props.user}是为了爬取user的属性但不加载user的响应式对象，如果直接form.value=props.user,由于user和form均为响应式对象,这会导致二者指向同一内存地址，当form改变时user也会改变，可能会引起错误,如果想给父组件传参应该使用emit
form.value = { ...props.user }

const handlePhoneInput = (value) => {
  // 只保留数字（0-9）
  form.value.phone_number = value.replace(/\D/g, '')
}

const handleSubmit = () => {
  // 当userRef中的值，也就是el-form的表单对象下的prop对应的参数符合检验规则，也就是rules时，才会给valid赋值true才会继续执行后面的代码
  userRef.value.validate(async (valid) => {
    if (valid) {
      let result = await requestUtil.post('user/Save', form.value)
      let data = result.data
      if (data.code == 200) {
        ElMessage.success('执行成功!')
        window.sessionStorage.setItem('user', JSON.stringify(form.value))
        console.log(form.value)
        console.log(data.data)
        emit('saved', data.data)
      }
    }
  })
}
</script>

<style scoped></style>
