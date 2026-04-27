<template>
  <el-form ref="formRef" :model="form" style="text-align: center; padding-bottom: 10px">
    <!-- 由于一般前端传参是依靠request.js内的请求拦截器进行token携带，但是el-form属于表格，并未调用request内全局暴露的任何函数，所以需要自己携带一个token，也就是header -->
    <!-- name携带的是图片的name标识，给后端识别用的 -->
    <!-- action携带的是上传图片对应的后端类的地址路由 -->
    <!-- show-file-list作用是显示上传的图片的历史列表 -->
    <!-- 在上传图片到后端之前会执行before-upload对应的函数，如果返回的值是true则上传，反之则报错 -->
    <!-- 当上传返回数据后执行on-success后的函数-->
    <el-upload
      name="avatar"
      :headers="headers"
      class="avatar-uploader"
      :action="getServerUrl() + 'user/UploadImage'"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <!--  如果地址下未找到图片则会报错然后执行此handelImageError -->
      <!-- 当showImage为true的时候显示img标签,反之则是el-icon标签 -->
      <img v-if="showImage" :src="imageUrl" class="avatar" @error="handelImageError" />
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>

    <el-button @click="handleConfirm">确认更换</el-button>
  </el-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import requestUtil, { getServerUrl } from '@/util/request'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import store from '@/store'
import { deleteImage } from '@/util/api'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const headers = ref({
  Authorization: window.sessionStorage.getItem('token'),
})

const form = ref({
  id: -1,
  avatar: '',
})

const imageUrl = ref('')
const showImage = ref(false)
//{...props.user}是为了爬取user的属性但不加载user的响应式对象，如果直接form.value=props.user,由于user和form均为响应式对象,这会导致二者指向同一内存地址，当form改变时user也会改变，可能会引起错误,如果想给父组件传参应该使用emit
form.value = { ...props.user }
// 判断 avatar 是否存在，如果不存在则使用默认头像
imageUrl.value = form.value.avatar
  ? getServerUrl() + 'media/userAvatar/' + form.value.avatar
  : '/default-avatar.png'

//使用全局变量来定义ifUpload和oldUpload是防止上传完图片未进行确认更换时就切换的标签，即跳转子路由，当第二次打开个人中心时两个数值会被初始化
const handleAvatarSuccess = (res) => {
  if (store.state.ifUpload) {
    deleteImage(store.state.oldUpload)
  }
  store.state.oldUpload = res.title
  imageUrl.value = getServerUrl() + 'media/userAvatar/' + res.title
  form.value.avatar = res.title
  store.state.ifUpload = true
}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isJPG) {
    ElMessage.error('图片必须是jpg格式')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2M!')
  }
  return isJPG && isLt2M
}

if (store.state.oldUpload) {
  imageUrl.value = getServerUrl() + 'media/userAvatar/' + store.state.oldUpload
}

const handleConfirm = async () => {
  if (store.state.oldUpload) {
    form.value.avatar = store.state.oldUpload
  }
  let result = await requestUtil.post('user/UpdateAvatar', form.value)
  let data = result.data
  if (data.code == 200) {
    store.state.ifUpload = false
    store.state.oldUpload = null
    ElMessage.success('执行成功!')
    const oldAvatar = JSON.parse(window.sessionStorage.getItem('user')).avatar
    deleteImage(oldAvatar)
    window.sessionStorage.setItem('user', JSON.stringify(form.value))
    store.state.avatar = form.value.avatar
  } else if (data.code == 400) {
    ElMessage.error(data.errorInfo)
  } else {
    ElMessage.error(data.errorInfo)
  }
}

const handelImageError = () => {
  showImage.value = false
}
//如果地址为空/none/undefined则不显示图片
watch(
  () => imageUrl.value,
  (newUrl) => {
    if (newUrl) {
      showImage.value = true
    } else {
      showImage.value = false
    }
  },
  { immediate: true },
)
</script>

<style>
.avatar-uploader .el-upload {
  border: 3px dashed #d1d1d1;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #2482da;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #525353;
  width: 130px;
  height: 130px;
  text-align: center;
}

.avatar {
  width: 129px;
  height: 129px;
  display: block;
}
</style>
