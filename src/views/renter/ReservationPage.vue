<template>
  <div class="reservation-container">
    <h2 class="title">预约详情</h2>

    <div v-if="reservationData && reservationData.length > 0" class="reservation-list">
      <el-card
        v-for="(item, index) in reservationData"
        :key="index"
        class="reservation-card"
        shadow="always"
      >
        <div class="card-header">
          <span class="label">房产编号:</span>
          <div>{{ item.house_number }}</div>
        </div>
        <div class="card-content">
          <span class="label">房东账号:</span>
          <el-tag type="info" effect="dark" size="large">{{ item.landlord_name }}</el-tag>
        </div>
        <div class="card-content">
          <span class="label">房东电话:</span>
          <el-tag type="info" effect="dark" size="large">{{ item.landlord_phone_number }}</el-tag>
        </div>

        <div class="card-content">
          <span class="label">预约日期:</span>
          <el-tag type="info" effect="dark" size="large"
            >{{ item.scheduled_date }}——{{ item.scheduled_time }}</el-tag
          >
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

        <div class="card-actions" v-if="item.status === '预约已确认'">
          <el-button type="info" @click="endRes(item)">看房结束</el-button>
        </div>

        <div class="card-actions" v-else>
          <el-button type="danger" @click="delRes(item)">删除</el-button>
        </div>
      </el-card>
    </div>

    <template v-else>
      <el-empty description="暂无预约记录" />
    </template>
  </div>
</template>

<script setup>
import { renterGetReservation, endReservation, delReservation } from '@/util/api'
import { ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'

let reservationData = ref([])
const userInfo = ref({})

//删除预约

const delRes = async (reservation) => {
  try {
    await ElMessageBox.confirm('确定要删除这个预约吗？', '删除预约', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await delReservation({ reservation_id: reservation.id })
    const updatedReservation = await renterGetReservation({
      renter_id: userInfo.value.id,
    })
    reservationData.value = updatedReservation
  } catch (error) {
    if (error !== 'cancel') {
      console.log(error)
    }
  }
}

// 结束预约
const endRes = async (reservation) => {
  try {
    await ElMessageBox.confirm('确定要结束这个预约吗？', '结束预约', {
      confirmButtonText: '结束',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await endReservation({ reservation_id: reservation.id })
    const updatedReservation = await renterGetReservation({
      renter_id: userInfo.value.id,
    })
    reservationData.value = updatedReservation
  } catch (error) {
    if (error !== 'cancel') {
      console.log(error)
    }
  }
}

// 状态类型映射
const getStatusType = (status) => {
  const statusMap = {
    预约待确认: 'warning',
    预约已确认: 'success',
    预约已取消: 'danger',
    看房已结束: 'info',
  }
  return statusMap[status] || 'info'
}

onMounted(async () => {
  userInfo.value = JSON.parse(window.sessionStorage.getItem('user'))
  reservationData.value = await renterGetReservation({ renter_id: userInfo.value.id })
})
</script>

<style scoped>
.reservation-list {
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
