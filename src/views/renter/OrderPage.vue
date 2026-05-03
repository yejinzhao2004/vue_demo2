<template>
  <div class="reservation-container">
    <h2 class="title">订单详情</h2>

    <div v-if="orderData && orderData.length > 0" class="order-list">
      <el-card
        v-for="(item, index) in orderData"
        :key="index"
        class="reservation-card"
        shadow="always"
      >
        <div v-if="item.order_visible">
          <div class="card-header">
            <span class="label">房东账号:</span>
            <div>{{ item.landlord }}</div>
          </div>
          <div class="card-content">
            <span class="label">房东电话:</span>
            <el-tag type="info" effect="dark" size="large">{{ item.landlord_phone }}</el-tag>
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
            <el-tag type="info" effect="dark" size="large">{{ item.payment_method }}</el-tag>
          </div>
          <div class="card-content">
            <span class="label">应付金额:</span>
            <el-tag type="info" effect="dark" size="large">{{
              formatPrice(item.due_amount)
            }}</el-tag>
          </div>
          <div class="card-content">
            <span class="label">已付金额:</span>
            <el-tag type="info" effect="dark" size="large">{{
              formatPrice(item.paid_amount)
            }}</el-tag>
          </div>

          <div class="card-content">
            <span class="label">待付金额:</span>
            <el-tag type="warning" effect="dark" size="large">{{
              formatPrice(item.pending_amount)
            }}</el-tag>
          </div>

          <div class="card-status">
            <span class="label">状态:</span>
            <el-tag :type="getStatusType(item.status)" effect="dark" size="small">
              {{ item.status }}
            </el-tag>
          </div>

          <div class="card-content">
            <span class="label">签约日期:</span>
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
            <el-tag type="info" effect="dark" size="large" class="wrap-text">{{
              item.result || '无'
            }}</el-tag>
          </div>

          <div class="card-actions" v-if="item.status === '租赁中'">
            <el-button type="info" @click="item.order_visible = false">收起详情</el-button>
            <el-button type="success" @click="pay_ment(item)">房租缴费</el-button>
            <el-button type="primary" @click="lease_renewal(item)">租赁续约</el-button>
            <el-button type="warning" @click="move_out(item)">提前退租</el-button>
          </div>
          <div class="card-actions" v-if="item.status === '待结约' || item.status === '待退租'">
            <el-button type="info" @click="item.order_visible = false">收起详情</el-button>
            <el-button type="success" @click="pay_ment(item)">房租缴费</el-button>
          </div>
          <div class="card-actions" v-if="item.status === '已结约' || item.status === '已退租'">
            <el-button type="info" @click="item.order_visible = false">收起详情</el-button>
            <el-button type="danger" @click="delete_order(item.id)">删除</el-button>
          </div>
        </div>
        <div v-else>
          <div class="card-header">
            <span class="label">房东账号:</span>
            <div>{{ item.landlord }}</div>
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
            <el-button type="success" @click="pay_ment(item)">房租缴费</el-button>
            <el-button type="primary" @click="lease_renewal(item)">租赁续约</el-button>
            <el-button type="warning" @click="move_out(item)">提前退租</el-button>
          </div>
          <div class="card-actions" v-if="item.status === '待结约' || item.status === '待退租'">
            <el-button type="info" @click="item.order_visible = true">展开详情</el-button>
            <el-button type="success" @click="pay_ment(item)">房租缴费</el-button>
          </div>
          <div class="card-actions" v-if="item.status === '已结约' || item.status === '已退租'">
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
import { getOrder, deleteOrder, moveOut, getBalance, payment, leaseRenewal } from '@/util/api'
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const renterName = JSON.parse(window.sessionStorage.getItem('user')).username
let orderData = ref([])

// 状态类型映射
const getStatusType = (status) => {
  const statusMap = {
    租赁中: 'success',
    待退租: 'danger',
    待结约: 'warning',
    已结约: 'warning',
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
    const updatedOrder = await getOrder(renterName)
    orderData.value = updatedOrder
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const move_out = async (order) => {
  try {
    await ElMessageBox.confirm(
      `确定要提前退租吗？提前退租是违约行为将会根据"${order.regulations}"从押金内扣除一个月的月租作为违约金。`,
      '提前退租',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    await moveOut(order.id)
    const updatedOrder = await getOrder(renterName)
    orderData.value = updatedOrder
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const pay_ment = async (order) => {
  try {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    let balance = await getBalance(user.id)
    await ElMessageBox.prompt(
      `确认缴费房租到账户${order.landlord}吗？当前账户余额为💰${balance}`,
      '支付房租',
      {
        confirmButtonText: '确认支付',
        cancelButtonText: '取消',
        type: 'warning',
        inputPlaceholder: `当前待付金额:${order.pending_amount}`,
        inputValidator: (value) => {
          const amount = Number(value)
          if (!value || value === '') {
            return '请输入支付金额'
          }
          if (isNaN(amount)) {
            return '请输入有效的数字'
          }
          if (amount < 0) {
            return '支付金额不能小于0'
          }
          if (amount > balance) {
            return `余额不足，当前余额为💰${balance}`
          }
          return true
        },
      },
    )
      .then(async ({ value }) => {
        // 用户点击确认，value 是输入的金额（字符串类型）
        const amount = Number(value) // 转换为数字类型
        console.log('用户确认支付金额:', amount)
        const result = await payment(order.id, amount)
        if (result === 200) {
          balance -= amount
          ElMessage.success(`支付成功，当前账户余额为💰${balance}`)
        }
        const updatedOrder = await getOrder(renterName)
        orderData.value = updatedOrder
      })
      .catch(() => {
        // 用户取消
        console.log('用户取消了支付')
      })
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const lease_renewal = async (order) => {
  try {
    await ElMessageBox.confirm(
      `确定要进行租赁续约吗？当前租期期限为${order.rental_duration}租期会延长一年`,
      '续租',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    await leaseRenewal(order.id)
    const updatedOrder = await getOrder(renterName)
    orderData.value = updatedOrder
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

onMounted(async () => {
  // 模拟订单数据
  orderData.value = await getOrder(renterName)
})
</script>

<style scoped>
/* 文本换行样式 */
.wrap-text {
  white-space: normal !important;
  word-break: break-all;
  max-width: 70%;
  height: auto;
  padding: 10px;
}
.order-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(470px, 1fr));
  gap: 20px;
  padding: 10px;
}
/* 容器样式 */
.reservation-container {
  padding: 30px 60px 0px 60px;
  width: 100%;
  max-width: 1400px;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
