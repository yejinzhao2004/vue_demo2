<template>
  <div class="user-management-container">
    <h2 class="title">用户管理</h2>

    <!-- 筛选表单 -->
    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="用户账号">
          <el-input v-model="filterForm.username" placeholder="请输入用户账号" clearable />
        </el-form-item>
        <el-form-item label="账号身份">
          <el-select
            v-model="filterForm.role"
            placeholder="请选择账号身份"
            style="width: 150px"
            clearable
          >
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="房东" value="房东"></el-option>
            <el-option label="租客" value="租客"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择账号状态"
            style="width: 150px"
            clearable
          >
            <el-option label="启用" value="启用"></el-option>
            <el-option label="停用" value="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表展示 -->
    <div v-if="filteredUsers && filteredUsers.length > 0" class="user-list">
      <el-card
        v-for="(user, index) in filteredUsers"
        :key="index"
        class="user-card"
        shadow="always"
      >
        <!-- 用户头像和基本信息 -->
        <div class="user-header">
          <el-avatar
            v-if="user.avatar"
            :src="getServerUrl() + 'media/userAvatar/' + user.avatar"
            :size="60"
            class="user-avatar"
          />
          <el-avatar v-else :size="60" class="user-avatar"> 暂无 </el-avatar>

          <div class="user-basic-info">
            <h3 class="username">{{ user.username }}</h3>
            <el-tag :type="getStatusType(user.status)" effect="dark" size="small">
              {{ formatStatus(user.status) }}
            </el-tag>
          </div>
        </div>

        <!-- 用户详细信息 -->
        <div class="user-detail">
          <div class="detail-row">
            <span class="label">邮箱:</span>
            <el-tag type="info" effect="dark">{{ user.email || '暂无' }}</el-tag>
          </div>

          <div class="detail-row">
            <span class="label">手机号:</span>
            <el-tag type="info" effect="dark">{{ user.phone_number || '暂无' }}</el-tag>
          </div>

          <div class="detail-row">
            <span class="label">最后登录时间:</span>
            <el-tag type="info" effect="dark">{{ user.login_date }}</el-tag>
          </div>

          <div class="detail-row">
            <span class="label">账户创建时间:</span>
            <el-tag type="info" effect="dark">{{ user.create_time }}</el-tag>
          </div>

          <div class="detail-row">
            <span class="label">资料更新时间:</span>
            <el-tag type="info" effect="dark">{{ user.update_time }}</el-tag>
          </div>

          <div class="detail-row">
            <span class="label">账号身份:</span>
            <el-tag type="info" effect="dark">{{ user.role_name }}</el-tag>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div v-if="user.role_name != '管理员'" class="user-actions">
          <el-button
            v-if="user.status === '启用'"
            type="danger"
            size="small"
            @click="toggleStatus(user)"
          >
            停用该账户
          </el-button>

          <el-button v-else type="success" size="small" @click="toggleStatus(user)">
            启用该账户
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-container">
      <el-empty description="暂无用户数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { getUserList, updateUserStatus } from '../../util/api.js'
import { getServerUrl } from '../../util/request.js'

// 响应式数据
const userData = ref([])
const loading = ref(false)

// 筛选条件
const filterForm = ref({
  username: '',
  role: '',
  status: '',
})

// 状态映射
const statusMap = {
  启用: { text: '启用', type: 'success' },
  停用: { text: '停用', type: 'danger' },
}

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'info'
}

// 格式化状态文本
const formatStatus = (status) => {
  return statusMap[status]?.text || '未知'
}
// 计算属性：根据筛选条件过滤用户数据
const filteredUsers = computed(() => {
  return userData.value.filter((user) => {
    // 用户账号筛选
    const matchesUsername =
      !filterForm.value.username ||
      user.username.toLowerCase().includes(filterForm.value.username.toLowerCase())

    // 账号身份筛选
    const matchesRole =
      !filterForm.value.role ||
      user.role_name.toLowerCase().includes(filterForm.value.role.toLowerCase())

    // 账号状态筛选
    const matchesStatus = !filterForm.value.status || user.status === filterForm.value.status

    return matchesUsername && matchesRole && matchesStatus
  })
})

// 重置筛选条件
const resetFilters = () => {
  filterForm.value.username = ''
  filterForm.value.role = ''
  filterForm.value.status = ''
}

// 切换用户状态
const toggleStatus = async (user) => {
  try {
    const action = user.status === '启用' ? '停用' : '启用'
    await ElMessageBox.confirm(`确定要${action}用户 "${user.username}" 吗？`, `确认${action}`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const response = await updateUserStatus({ user_id: user.id, status: action })
    if (response.code === 200) {
      user.status = action
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

// 加载用户数据
const loadUserData = async () => {
  loading.value = true
  const response = await getUserList()
  userData.value = response
  loading.value = false
}

// 生命周期
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
/* 容器样式 */
.user-management-container {
  padding: 30px 40px;
  width: 100%;
  max-width: 1400px;
  min-height: calc(100vh - 120px);
  background: #f5f7fa;
  box-sizing: border-box;
  margin: 0 auto;
}

/* 标题样式 */
.title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* 用户列表容器 */
.user-list {
  display: grid; /*二维网格布局*/
  grid-template-columns: repeat(
    auto-fill,
    minmax(380px, 1fr)
  ); /*最小宽度：380px（保证每个用户卡片有足够空间显示信息）
  最大宽度：1fr（均分剩余空间） */
  gap: 20px;
  padding: 10px;
}

/* 用户卡片样式 */
.user-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid #e4e7ed;
}

.user-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8);
}

/* 用户头部信息 */
.user-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  margin-bottom: 15px;
}

.user-avatar {
  margin-right: 15px;
  border: 3px solid rgb(177, 177, 177);
  color: #ffffff;
  background-color: rgb(88, 88, 88);
}

.user-basic-info {
  flex: 1;
}

.username {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
}

/* 用户详情信息 */
.user-detail {
  padding: 0 20px 20px;
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.label {
  min-width: 80px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  margin-right: 15px;
}

/* 操作按钮 */
.user-actions {
  display: flex;
  justify-content: center;
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 0 0 12px 12px;
}

/* 空状态容器 */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-management-container {
    padding: 20px 15px;
  }

  .user-list {
    grid-template-columns: 1fr;
  }

  .user-header {
    flex-direction: column;
    text-align: center;
    padding: 20px 15px;
  }

  .user-avatar {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .label {
    margin-bottom: 5px;
    margin-right: 0;
  }
}
</style>
