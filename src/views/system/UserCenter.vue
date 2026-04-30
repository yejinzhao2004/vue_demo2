<template>
  <div class="user-center-container">
    <div class="user-info-flex-container">
      <div class="info-card-wrapper">
        <el-card class="info-card">
          <template v-slot:header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <AvatarUpload :user="currentUser" />
          <ul class="list-group-striped">
            <li class="list-group-item">
              <el-icon> <User /> </el-icon>&nbsp;用户账号
              <div class="pull-right">{{ currentUser.username }}</div>
            </li>
            <li class="list-group-item">
              <el-icon> <Wallet /> </el-icon>&nbsp;账户余额
              <div class="pull-right">{{ currentUser.balance }}</div>
            </li>
            <li class="list-group-item">
              <el-icon> <Phone /> </el-icon>&nbsp;手机号码
              <div class="pull-right">{{ currentUser.phone_number }}</div>
            </li>
            <li class="list-group-item">
              <el-icon> <Message /> </el-icon>&nbsp;用户邮箱
              <div class="pull-right">{{ currentUser.email }}</div>
            </li>
            <li class="list-group-item">
              <el-icon> <Clock /> </el-icon>&nbsp;更新日期
              <div class="pull-right">{{ currentUser.update_time }}</div>
            </li>
            <li class="list-group-item">
              <el-icon> <User /> </el-icon>&nbsp;所属角色
              <div class="pull-right">
                {{ role.name }}
              </div>
            </li>
            <li class="list-group-item" style="display: flex">
              <button
                @click="ifShow = !ifShow"
                class="el-button el-button--primary"
                style="margin-left: auto; margin-right: 20px"
              >
                修改信息
              </button>
            </li>
          </ul>
        </el-card>
      </div>

      <div v-show="ifShow" class="info-card-wrapper" style="margin-left: 0">
        <el-card class="info-card">
          <template v-slot:header>
            <div class="clearfix">
              <span>修改信息</span>
            </div>
          </template>
          <el-tabs style="padding-left: 20px" v-model="activeTab">
            <el-tab-pane label="联系方式" name="userInfo"
              ><UserInfo :user="currentUser" @saved="handleUserSaved" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetInfo">
              <UpdatePassword :user="currentUser" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AvatarUpload from '@/components/AvatarUpload.vue'
import UpdatePassword from '@/components/UpdatePassword.vue'
import UserInfo from '@/components/UserInfo.vue'
import { getBalance } from '@/util/api'
const currentUser = ref(JSON.parse(sessionStorage.getItem('user')))
const role = JSON.parse(sessionStorage.getItem('role'))
const ifShow = ref(false)

const activeTab = ref('userInfo')
const handleUserSaved = (newUser) => {
  currentUser.value = newUser
}
onMounted(async () => {
  currentUser.value.balance = await getBalance(currentUser.value.id)
  console.log('账户余额已获取')
})
</script>
<style scoped>
.user-center-container {
  padding: 15px;
}

.user-info-flex-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.info-card-wrapper {
  flex: 1;
  min-width: 300px;
  margin-bottom: 20px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.list-group-striped > .list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}

.list-group-item {
  border-bottom: 1px solid #a0a0a0;
  border-top: 1px solid #a0a0a0;
  margin-bottom: -1px;
  padding: 11px;
  font-size: 14px;
  list-style-type: none;
}

.list-group-striped {
  margin-left: 0px;
}

.pull-right {
  width: auto;
  float: right !important;
}
</style>
