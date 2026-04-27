<template>
  <div class="house-audit-container">
    <h2 class="title">房屋审核管理</h2>

    <!-- 审核筛选条件 -->
    <div class="filter-container">
      <el-input
        v-model="searchQuery"
        placeholder="搜索房产编号、地址或房东名称"
        class="search-input"
        clearable
      >
        <!-- #prefix是在父组件的前端添加的图标，#suffix是在父组件的尾部添加的图标 -->
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select v-model="auditStatus" placeholder="审核状态" class="status-select" clearable>
        <el-option label="待审核" value="待审核" />
        <el-option label="已通过" value="已通过" />
        <el-option label="未通过" value="未通过" />
      </el-select>

      <el-button type="primary" @click="resetFilters">重置</el-button>
    </div>

    <!-- 房屋列表展示 -->
    <div v-if="filteredHouses.length > 0" class="house-list">
      <el-card v-for="(house, index) in filteredHouses" :key="index" class="house-card">
        <!-- 房屋头部信息 -->
        <div class="house-header">
          <div class="house-basic-info">
            <h3 class="house-title">{{ house.house_number }}</h3>
            <el-tag
              :type="getStatusType(house.status)"
              effect="dark"
              size="small"
              class="status-tag"
            >
              {{ formatStatus(house.status) }}
            </el-tag>
          </div>
          <div class="price-info">
            <span class="price">{{ house.price }} 元/月</span>
          </div>
        </div>

        <!-- 房屋详细信息 -->
        <div class="house-detail">
          <div class="detail-row">
            <span class="label">房屋地址：</span>
            <el-tag type="info" effect="light">{{ house.position }}</el-tag>
          </div>

          <div class="detail-row">
            <span class="label">房东名称：</span>
            <el-tag type="info" effect="light">{{ house.landlord_name }}</el-tag>
          </div>

          <div class="detail-row">
            <span class="label">提交时间：</span>
            <el-tag type="info" effect="light">{{ house.create_time }}</el-tag>
          </div>

          <div v-if="house.status === '未通过'" class="detail-row">
            <span class="label reject-reason">拒绝理由：</span>
            <span class="value reject-text">{{ house.reject_reason || '无' }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="house-actions">
          <template v-if="house.status === '待审核'">
            <el-button type="success" size="small" @click="handleAudit(house, '空闲中')">
              通过审核
            </el-button>
            <el-button type="danger" size="small" @click="showRejectDialog(house)">
              拒绝通过
            </el-button>
          </template>

          <el-button v-else type="primary" size="small" @click="handleReAudit(house)">
            重新审核
          </el-button>

          <el-button type="info" size="small" @click="viewHouseDetail(house)"> 查看详情 </el-button>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-container">
      <el-empty description="暂无待审核的房屋" />
    </div>

    <!-- 拒绝审核对话框 -->
    <el-dialog v-model="rejectDialog.visible" title="拒绝审核理由" width="500px">
      <el-input
        v-model="rejectDialog.reject_reason"
        type="textarea"
        placeholder="请输入拒绝审核的理由"
        :rows="4"
        maxlength="200"
        show-word-limit
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelRejectDialog()">取消</el-button>
          <el-button type="warning" @click="confirmReject"> 确认拒绝 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 基础信息对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentHouse ? '房源基础信息 - ' + currentHouse.house_number : '房源信息'"
      :width="500"
    >
      <div v-if="currentHouse" class="house-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="产权编号">
            {{ currentHouse.house_number }}
          </el-descriptions-item>
          <el-descriptions-item label="地址">
            {{ currentHouse.position }}
          </el-descriptions-item>
          <el-descriptions-item label="月租金"> ¥{{ currentHouse.price }} </el-descriptions-item>
          <el-descriptions-item label="类型">
            {{ currentHouse.house_type }}
          </el-descriptions-item>
          <el-descriptions-item label="户型">
            {{ currentHouse.house_layout }}
          </el-descriptions-item>
          <el-descriptions-item label="面积"> {{ currentHouse.area }} ㎡ </el-descriptions-item>
          <el-descriptions-item label="楼层">
            {{ currentHouse.floor_level }}
          </el-descriptions-item>
          <el-descriptions-item label="朝向">
            {{ currentHouse.face }}
          </el-descriptions-item>
          <el-descriptions-item label="房东名字">
            {{ currentHouse.landlord_name }}
          </el-descriptions-item>
          <el-descriptions-item label="电话号码">
            {{ currentHouse.landlord_phone_number }}
          </el-descriptions-item>
          <el-descriptions-item label="上传时间">
            {{ currentHouse.create_time }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { adminGetHouseList, auditHouse } from '@/util/api'

// 响应式数据
const housesData = ref([])
const searchQuery = ref('')
const auditStatus = ref('')
const loading = ref(false)
const rejectDialog = ref({
  visible: false,
  reject_reason: '',
  currentHouse: null,
})
const dialogVisible = ref(false)
const currentHouse = ref(null)

// 状态映射
const statusMap = {
  待审核: { text: '待审核', type: 'warning' },
  空闲中: { text: '已通过', type: 'success' },
  已出租: { text: '已通过', type: 'success' },
  已下架: { text: '已通过', type: 'success' },
  未通过: { text: '未通过', type: 'danger' },
}

// 添加取消拒绝对话框的方法
const cancelRejectDialog = () => {
  rejectDialog.value.visible = false
  rejectDialog.value.reject_reason = ''
}
// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'info'
}

// 格式化状态文本
const formatStatus = (status) => {
  return statusMap[status]?.text || '未知'
}

// 过滤后的房屋列表
const filteredHouses = computed(() => {
  let filtered = housesData.value

  // 按审核状态过滤 - 支持单个值或多个值
  if (auditStatus.value) {
    if (auditStatus.value === '已通过') {
      // 如果选择了"已通过"，则匹配所有表示已通过的状态
      filtered = filtered.filter(
        (house) =>
          house.status === '空闲中' || house.status === '已出租' || house.status === '已下架',
      )
    } else if (auditStatus.value === '待审核') {
      // 如果选择了"待审核"，匹配所有表示待审核的状态
      filtered = filtered.filter((house) => house.status === '待审核')
    } else if (auditStatus.value === '未通过') {
      // 如果选择了"未通过"，匹配所有表示未通过的状态
      filtered = filtered.filter((house) => house.status === '未通过')
    }
  }

  // 按搜索关键词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (house) =>
        house.house_number?.toLowerCase().includes(query) ||
        house.position?.toLowerCase().includes(query) ||
        house.landlord_name?.toLowerCase().includes(query),
    )
  }

  return filtered
})

// 处理审核操作
const handleAudit = async (house, status) => {
  try {
    const action = status === '未通过' ? '拒绝' : '通过'
    await ElMessageBox.confirm(
      `确定要${action}房屋 "${house.house_number}" 的审核吗？`,
      `确认${action}`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: status === '未通过' ? 'warning' : 'success',
      },
    )

    let response = await auditHouse({
      house_id: house.id,
      status,
      reject_reason: rejectDialog.value.reject_reason,
    })

    if (response != null) {
      house.status = status
      if (status === '未通过' && rejectDialog.value.reject_reason) {
        house.reject_reason = rejectDialog.value.reject_reason
      }

      ElMessage.success(`${action}审核成功`)
    }
    rejectDialog.value.visible = false
    rejectDialog.value.reject_reason = ''
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

// 显示拒绝对话框
const showRejectDialog = (house) => {
  rejectDialog.value.currentHouse = house
  rejectDialog.value.visible = true
}

// 确认拒绝
const confirmReject = () => {
  if (!rejectDialog.value.reject_reason.trim()) {
    ElMessage.warning('请输入拒绝理由')
    return
  }
  handleAudit(rejectDialog.value.currentHouse, '未通过')
}

// 重新审核
const handleReAudit = async (house) => {
  rejectDialog.value.reject_reason = ''
  rejectDialog.value.visible = false
  let response = await auditHouse({
    house_id: house.id,
    status: '待审核',
    reject_reason: rejectDialog.value.reject_reason,
  })
  if (response != null) {
    house.status = '待审核'
    ElMessage.success('已重新提交审核')
  }
}
// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = ''
  auditStatus.value = ''
}

// 查看房屋详情
const viewHouseDetail = (house) => {
  currentHouse.value = house
  dialogVisible.value = true
}

// 加载房屋数据
const loadHousesData = async () => {
  loading.value = true

  const result = await adminGetHouseList()
  housesData.value = result.data
  loading.value = false
}

// 生命周期
onMounted(() => {
  loadHousesData()
})
</script>

<style scoped>
.house-audit-container {
  padding: 30px 40px;
  width: 100%;
  max-width: 1400px;
  min-height: calc(100vh - 120px);
  background: #f5f7fa;
  box-sizing: border-box;
  margin: 0 auto;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* 筛选条件容器 */
.filter-container {
  max-width: 800px;
  display: flex;
  gap: 20px;
  margin: 0 auto 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
}

.status-select {
  flex: 1;
}

/* 房屋列表容器 */
.house-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 10px;
}

/* 房屋卡片样式 */
.house-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid #e4e7ed;
}

.house-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.8);
}

/* 房屋头部信息 */
.house-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  margin-bottom: 15px;
}

.house-basic-info {
  flex: 1;
}

.house-title {
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.status-tag {
  font-weight: 500;
}

.price-info {
  text-align: right;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* 房屋详情信息 */
.house-detail {
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
  min-width: 100px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  margin-right: 15px;
}

.reject-reason {
  color: #f56c6c;
  font-weight: 600;
}

.reject-text {
  color: #f56c6c;
  font-style: italic;
}

/* 操作按钮 */
.house-actions {
  display: flex;
  gap: 10px;
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
</style>
