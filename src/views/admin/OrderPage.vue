<template>
  <div class="order-container">
    <h2 class="title">订单详情</h2>

    <!-- 添加筛选表单 -->
    <div class="filter-container">
      <el-input
        v-model="filters.keyword"
        placeholder="请输入房东账号/租客账号/房源编号/房屋地址"
        class="search-input"
        clearable
      />

      <el-select v-model="filters.status" placeholder="请选择状态" class="status-select" clearable>
        <el-option label="租赁中" value="租赁中" />
        <el-option label="已到期" value="已到期" />
        <el-option label="已退租" value="已退租" />
        <el-option label="待解约" value="待解约" />
      </el-select>

      <el-button type="primary" @click="resetFilters">重置</el-button>
    </div>

    <div v-if="filteredOrderData && filteredOrderData.length > 0" class="order-list">
      <el-card v-for="(item, index) in filteredOrderData" :key="index" class="order-card">
        <div v-if="item.visible">
          <div class="order-header">
            <span class="label">房东账号:</span>
            <div>{{ item.landlord }}</div>
          </div>
          <div class="order-content">
            <span class="label">房东电话:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.renter_phone }}</el-tag>
          </div>
          <div class="order-header">
            <span class="label">租客账号:</span>
            <div>{{ item.renter }}</div>
          </div>
          <div class="order-content">
            <span class="label">租客电话:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.renter_phone }}</el-tag>
          </div>
          <div class="order-header">
            <span class="label">订单详情</span>
          </div>
          <div class="order-content">
            <span class="label">房源编号:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.house }}</el-tag>
          </div>

          <div class="order-content">
            <span class="label">房屋地址:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.position }}</el-tag>
          </div>

          <div class="order-content">
            <span class="label">每月租金:</span>
            <el-tag type="info" effect="dark" size="large">{{ formatPrice(item.price) }}</el-tag>
          </div>

          <div class="order-content">
            <span class="label">押金总额:</span>
            <el-tag type="info" effect="dark" size="large">{{ formatPrice(item.deposit) }}</el-tag>
          </div>

          <div class="order-content">
            <span class="label">押金规则:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.payment_method }}</el-tag>
          </div>
          <div v-if="item.status == '租赁中'">
            <div class="order-content">
              <span class="label">应付金额:</span>
              <el-tag type="info" effect="dark" size="large">{{
                formatPrice(item.due_amount)
              }}</el-tag>
            </div>
            <div class="order-content">
              <span class="label">已付金额:</span>
              <el-tag type="info" effect="dark" size="large">{{
                formatPrice(item.paid_amount)
              }}</el-tag>
            </div>
            <div class="order-content">
              <span class="label">待付金额:</span>
              <el-tag type="warning" effect="dark" size="large">{{
                formatPrice(item.pending_amount)
              }}</el-tag>
            </div>
          </div>
          <div v-if="item.status != '租赁中'" class="order-content">
            <span class="label">订单结果:</span>
            <el-tag type="info" effect="dark" size="large" class="wrap-text">{{
              item.result || '无'
            }}</el-tag>
          </div>

          <div class="order-status">
            <span class="label">订单状态:</span>
            <el-tag :type="getStatusType(item.status)" effect="dark" size="small">
              {{ item.status }}
            </el-tag>
          </div>

          <div class="order-content">
            <span class="label">签约日期:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.create_time }}</el-tag>
          </div>

          <div class="order-content">
            <span class="label">截止日期:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.rental_duration }}</el-tag>
          </div>
          <div class="order-content">
            <span class="label">合约条例:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.regulations }}</el-tag>
          </div>
          <div class="order-actions">
            <el-button type="primary" @click="item.visible = false">收起内容</el-button>
            <el-button type="danger" @click="delete_order(item.id)">删除</el-button>
          </div>
        </div>
        <div v-else>
          <div class="order-header">
            <span class="label">房东账号:</span>
            <div>{{ item.landlord }}</div>
          </div>
          <div class="order-header">
            <span class="label">租客账号:</span>
            <div>{{ item.renter }}</div>
          </div>
          <div class="order-content">
            <span class="label">房源编号:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.house }}</el-tag>
          </div>

          <div class="order-content">
            <span class="label">房屋地址:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.position }}</el-tag>
          </div>
          <div class="order-status">
            <span class="label">状态:</span>
            <el-tag :type="getStatusType(item.status)" effect="dark" size="small">
              {{ item.status }}
            </el-tag>
          </div>
          <div class="order-actions">
            <el-button type="primary" @click="item.visible = true">查看详情</el-button>
            <el-button type="danger" @click="delete_order(item.id)">删除</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <template v-else>
      <el-empty description="暂无符合条件的订单记录" />
    </template>
  </div>
</template>

<script setup>
import { getOrderList, deleteOrder } from '@/util/api'
import { onMounted, ref, computed } from 'vue'
import { ElMessageBox } from 'element-plus'

let orderData = ref([])
// 筛选条件
const filters = ref({
  keyword: '',
  status: '',
})

// 计算属性：根据筛选条件过滤订单数据
const filteredOrderData = computed(() => {
  return orderData.value.filter((item) => {
    // 关键字筛选：匹配房东账号、租客账号、房源编号或房屋地址
    const matchesKeyword =
      !filters.value.keyword ||
      item.landlord.toLowerCase().includes(filters.value.keyword.toLowerCase()) ||
      item.renter.toLowerCase().includes(filters.value.keyword.toLowerCase()) ||
      item.house.toLowerCase().includes(filters.value.keyword.toLowerCase()) ||
      item.position.toLowerCase().includes(filters.value.keyword.toLowerCase())

    // 状态筛选
    const matchesStatus = !filters.value.status || item.status === filters.value.status

    return matchesKeyword && matchesStatus
  })
})

// 重置筛选条件
const resetFilters = () => {
  filters.value = {
    keyword: '',
    status: '',
  }
}

// 状态类型映射
const getStatusType = (status) => {
  const statusMap = {
    租赁中: 'success',
    待退租: 'danger',
    待解约: 'warning',
    已解约: 'warning',
    已退租: 'danger',
  }
  return statusMap[status] || 'info'
}

// 格式化价格
const formatPrice = (price) => {
  if (!price) return '¥ 0.00'
  return `¥ ${parseFloat(price).toFixed(2)}`
}

const delete_order = async (orderId) => {
  try {
    await ElMessageBox.confirm('确定要删除这个订单？', '删除订单', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteOrder(orderId)
    const updatedOrder = await getOrderList()
    orderData.value = updatedOrder.data
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

onMounted(async () => {
  // 模拟订单数据
  let result = await getOrderList()
  orderData.value = result.data
})
</script>

<style scoped>
/* 容器样式 */
.order-container {
  padding: 30px 40px;
  width: 100%;
  max-width: 1400px;
  min-height: calc(100vh - 120px);
  background: #f5f7fa;
  box-sizing: border-box;
  margin: 0 auto;
}

.order-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 10px;
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

/* 卡片样式 */
.order-card {
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid #e4e7ed;
}

.order-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.8);
}

/* 卡片内容样式 */
.order-header {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 12px 12px;
  margin-bottom: 15px;
}

.order-content,
.order-status,
.order-actions {
  padding: 0 20px 15px;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.order-actions {
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;

  background: #fafafa;
  border-radius: 0 0 12px 12px;
  margin-top: 15px;
  margin-bottom: 0;
}

.order-header .label {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: 500;
}

.label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  margin-right: 15px;
}

/* 文本换行样式 */
.wrap-text {
  white-space: normal !important;
  word-break: break-all;
  max-width: 70%;
  height: auto;
  padding: 10px;
}
</style>
