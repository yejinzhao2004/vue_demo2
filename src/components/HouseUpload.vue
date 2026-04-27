<template>
  <el-form ref="userRef" :model="form" :rules="rules" label-width="100px" class="houseupload">
    <el-form-item label="产权编号：" prop="house_number">
      <el-input v-model="form.house_number" maxlength="100" placeholder="请输入产权编号" />
    </el-form-item>
    <el-form-item label="房屋类型：" prop="house_type">
      <el-input v-model="form.house_type" maxlength="100" placeholder="请输入房屋类型" />
    </el-form-item>
    <el-form-item label="户型结构：" prop="house_layout">
      <el-input v-model="form.house_layout" maxlength="100" placeholder="请输入户型结构" />
    </el-form-item>
    <el-form-item label="房屋面积：" prop="area">
      <el-input v-model="form.area" maxlength="100" placeholder="请输入房屋面积" />
    </el-form-item>
    <el-form-item label="房屋楼层：" prop="floor_level">
      <el-input v-model="form.floor_level" maxlength="100" placeholder="请输入房屋楼层" />
    </el-form-item>
    <el-form-item label="房屋朝向：" prop="face">
      <el-input v-model="form.face" maxlength="100" placeholder="请输入房屋朝向" />
    </el-form-item>
    <el-form-item label="房屋地址：" prop="position">
      <el-input v-model="form.position" maxlength="100" placeholder="请输入房屋地址" />
    </el-form-item>
    <el-form-item label="房屋月租：" prop="price">
      <el-input v-model="form.price" maxlength="100" placeholder="请输入房屋月租" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="upload">上传申请</el-button>
      <el-button type="primary" @click="reput">重新输入</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'
import requestUtil from '@/util/request'
import { ElMessage } from 'element-plus'
import store from '@/store'
const currentUser = JSON.parse(window.sessionStorage.getItem('user'))
const upload = () => {
  userRef.value.validate(async (valid) => {
    if (valid) {
      let result = await requestUtil.post('house/HouseUpload', form.value)
      let data = result.data
      if (data.code == 200) {
        store.state.HouseListStatus += 1
        ElMessage.success(data.info)
      } else {
        ElMessage.error(data.errorInfo)
      }
    }
  })
}
const reput = () => {
  form.value = {
    landlord_id: currentUser.id,
    house_number: '',
    house_type: '',
    house_layout: '',
    area: '',
    floor_level: '',
    face: '',
    position: '',
    price: '',
    renter_id: '',
  }
}
const form = ref({
  landlord_id: '',
  house_number: '',
  house_type: '',
  house_layout: '',
  area: '',
  floor_level: '',
  face: '',
  position: '',
  price: '',
  renter_id: '',
})
form.value.landlord_id = currentUser.id
const userRef = ref(null)
const rules = ref({
  house_number: { required: true, message: '产权编号不能为空', trigger: ['blur', 'change'] },
  house_type: { required: true, message: '房屋类型不能为空', trigger: ['blur', 'change'] },
  house_layout: { required: true, message: '户型结构不能为空', trigger: ['blur', 'change'] },
  area: { required: true, message: '房屋面积不能为空', trigger: ['blur', 'change'] },
  floor_level: { required: true, message: '房屋楼层不能为空', trigger: ['blur', 'change'] },
  face: { required: true, message: '房屋朝向不能为空', trigger: ['blur', 'change'] },
  position: { required: true, message: '房屋地址不能为空', trigger: ['blur', 'change'] },
  price: { required: true, message: '房屋月租不能为空', trigger: ['blur', 'change'] },
})
</script>

<style scoped>
.houseupload {
  padding: 20px;
}
</style>
