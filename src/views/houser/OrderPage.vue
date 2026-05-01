<template>
  <div class="reservation-container">
    <h2 class="title">订单详情</h2>

    <div v-if="orderData && orderData.length > 0">
      <el-card
        v-for="(item, index) in orderData"
        :key="index"
        class="reservation-card"
        shadow="always"
      >
        <div v-if="item.order_visible">
          <div class="card-header">
            <span class="label">租客账号:</span>
            <div>{{ item.renter }}</div>
          </div>
          <div class="card-content">
            <span class="label">租客电话:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.renter_phone }}</el-tag>
          </div>

          <div class="card-content">
            <span class="label">房源编号:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.house }}</el-tag>
          </div>

          <div class="card-content">
            <span class="label">房屋地址:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.position }}</el-tag>
          </div>

          <div class="card-content">
            <span class="label">每月租金:</span>
            <el-tag type="info" effect="dark" size="large">{{ formatPrice(item.price) }}</el-tag>
          </div>

          <div class="card-content">
            <span class="label">押金总额:</span>
            <el-tag type="info" effect="dark" size="large">{{ formatPrice(item.deposit) }}</el-tag>
          </div>

          <div class="card-content">
            <span class="label">押金规则:</span>
            <el-tag type="info" effect="light" size="large">{{ item.payment_method }}</el-tag>
          </div>

          <div class="card-status">
            <span class="label">状态:</span>
            <el-tag :type="getStatusType(item.status)" effect="dark" size="small">
              {{ item.status }}
            </el-tag>
          </div>

          <div class="card-content">
            <span class="label">创建时间:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.create_time }}</el-tag>
          </div>

          <div class="card-content">
            <span class="label">截止日期:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.rental_duration }}</el-tag>
          </div>

          <div class="card-content">
            <span class="label">合约条例:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.regulations }}</el-tag>
          </div>

          <div v-if="item.status != '租赁中'" class="card-content">
            <span class="label">订单结果:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.result || '无' }}</el-tag>
          </div>

          <div class="card-actions" v-if="item.status === '租赁中'">
            <el-button type="info" @click="item.order_visible = false">收起详情</el-button>
          </div>
          <div class="card-actions" v-else>
            <el-button type="info" @click="item.order_visible = false">收起详情</el-button>
            <el-button type="danger" @click="delete_order(item.id)">删除</el-button>
          </div>
        </div>
        <div v-else>
          <div class="card-header">
            <span class="label">租客账号:</span>
            <div>{{ item.renter }}</div>
          </div>
          <div class="card-content">
            <span class="label">房源编号:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.house }}</el-tag>
          </div>
          <div class="card-content">
            <span class="label">房屋地址:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.position }}</el-tag>
          </div>
          <div class="card-status">
            <span class="label">状态:</span>
            <el-tag :type="getStatusType(item.status)" effect="dark" size="small">
              {{ item.status }}
            </el-tag>
          </div>

          <div class="card-actions" v-if="item.status === '租赁中'">
            <el-button type="info" @click="item.order_visible = true">展开详情</el-button>
          </div>
          <div class="card-actions" v-else>
            <el-button type="info" @click="item.order_visible = true">展开详情</el-button>
            <el-button type="danger" @click="delete_order(item.id)">删除</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <template v-else>
      <el-empty description="暂无订单记录" />
    </template>
  </div>
</template>

<script setup>
import { getOrder } from '@/util/api'
import { onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { deleteOrder } from '@/util/api'

const landlordName = JSON.parse(window.sessionStorage.getItem('user')).username
let orderData = ref([])

// 状态类型映射
const getStatusType = (status) => {
  const statusMap = {
    租赁中: 'success',
    已退租: 'warning',
    已到期: 'info',
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
    const updatedOrder = await getOrder(landlordName)
    orderData.value = updatedOrder
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

onMounted(async () => {
  // 模拟订单数据
  orderData.value = await getOrder(landlordName)
})
</script>

<style scoped>
/* 容器样式 */
.reservation-container {
  padding: 30px 60px 0px 60px;
  width: 1100px;
  background: #c4c2c2;
  height: 800px;
  box-sizing: border-box;
  overflow-y: auto;
  scrollbar-width: none;
  border-radius: 30px;
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

/* 卡片样式 */
.reservation-card {
  margin-bottom: 25px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.reservation-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8);
}

/* 卡片内容样式 */
.card-header,
.card-content,
.card-status,
.card-actions {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.card-actions {
  justify-content: flex-end;
  gap: 10px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 0 0 8px 8px;
}
.card-header {
  background: linear-gradient(90deg, #3498db, #4fddf7);
  color: white;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
}

.label {
  margin-right: 15px;
  font-size: 16px;
  min-width: 100px;
  min-height: 40px;
  border-radius: 5px;
  text-align: center;
  line-height: 40px;
  color: #2c3e50;
  font-weight: 500;
}

.card-header .label {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .reservation-container {
    padding: 20px;
  }

  .title {
    font-size: 24px;
  }

  .card-header,
  .card-content,
  .card-status {
    padding: 12px 15px;
    flex-direction: column;
    align-items: flex-start;
  }

  .label {
    min-width: auto;
    margin-right: 0;
    margin-bottom: 8px;
    min-height: auto;
    line-height: normal;
  }
}
</style>
