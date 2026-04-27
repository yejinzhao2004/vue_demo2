<template>
  <div class="reservation-container">
    <h2 class="title">预约管理</h2>

    <!-- 添加筛选表单 -->
    <div class="filter-container">
      <el-input
        v-model="filters.keyword"
        placeholder="请输入租客/房东姓名/预约日期"
        class="search-input"
        clearable
      />

      <el-select v-model="filters.status" placeholder="请选择状态" class="status-select" clearable>
        <el-option label="预约待确认" value="预约待确认" />
        <el-option label="预约已确认" value="预约已确认" />
        <el-option label="预约已取消" value="预约已取消" />
        <el-option label="看房已结束" value="看房已结束" />
      </el-select>

      <el-button type="primary" @click="resetFilters">重置</el-button>
    </div>

    <div
      v-if="filteredReservationData && filteredReservationData.length > 0"
      class="reservation-list"
    >
      <el-card
        v-for="(item, index) in filteredReservationData"
        :key="index"
        class="reservation-card"
      >
        <div class="reservation-header">
          <span class="label">房屋编号:</span>
          <div>{{ item.house_number }}</div>
        </div>
        <div class="reservation-content">
          <span class="label">租客姓名:</span>
          <el-tag type="info" effect="light" size="large">{{ item.renter_name }}</el-tag>
        </div>

        <div class="reservation-content">
          <span class="label">房东姓名:</span>
          <el-tag type="info" effect="light" size="large">{{ item.landlord_name }}</el-tag>
        </div>

        <div class="reservation-content">
          <span class="label">预约日期:</span>
          <el-tag type="info" effect="light" size="large"
            >{{ item.scheduled_date }}--{{ item.scheduled_time }}</el-tag
          >
        </div>

        <div class="reservation-status">
          <span class="label">状态:</span>
          <el-tag :type="getStatusType(item.status)" effect="dark" size="small">
            {{ item.status }}
          </el-tag>
        </div>
        <div class="reservation-content">
          <span class="label">创建时间:</span>
          <el-tag type="info" effect="light" size="large">{{ item.create_time }}</el-tag>
        </div>

        <div class="reservation-actions">
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
import { delReservation, adminGetReservationList } from '@/util/api'
import { ElMessageBox, ElMessage } from 'element-plus'
import { onMounted, ref, computed } from 'vue'

let reservationData = ref([])

// 筛选条件
const filters = ref({
  keyword: '',
  status: '',
})

// 计算属性：根据筛选条件过滤预约数据
const filteredReservationData = computed(() => {
  return reservationData.value.filter((item) => {
    // 关键字筛选：匹配租客姓名、房东姓名、预约日期
    const matchesKeyword =
      !filters.value.keyword ||
      (item.renter_name &&
        item.renter_name.toLowerCase().includes(filters.value.keyword.toLowerCase())) ||
      (item.landlord_name &&
        item.landlord_name.toLowerCase().includes(filters.value.keyword.toLowerCase())) ||
      (item.scheduled_date &&
        item.scheduled_date.toLowerCase().includes(filters.value.keyword.toLowerCase())) ||
      (item.scheduled_time &&
        item.scheduled_time.toLowerCase().includes(filters.value.keyword.toLowerCase()))

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

// 删除预约
const delRes = async (reservation) => {
  try {
    await ElMessageBox.confirm('确定要删除这个预约吗？', '删除预约', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await delReservation({ reservation_id: reservation.id })
    const result = await adminGetReservationList()
    if (result.code === 200) {
      reservationData.value = result.data
      ElMessage.success('删除成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.log(error)
      ElMessage.error('删除失败')
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
  const result = await adminGetReservationList()
  if (result.code === 200) {
    reservationData.value = result.data
  }
})
</script>

<style scoped>
/* 容器样式 */
.reservation-container {
  padding: 30px 40px;
  width: 100%;
  max-width: 1400px;
  min-height: calc(100vh - 120px);
  background: #f5f7fa;
  box-sizing: border-box;
  margin: 0 auto;
}

.reservation-list {
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
.reservation-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid #e4e7ed;
}

.reservation-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.8);
}

/* 卡片内容样式 */
.reservation-header {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background: linear-gradient(135deg, #3498db, #4fddf7);
  color: white;
  border-radius: 12px 12px 0 0;
  margin-bottom: 15px;
}

.reservation-content,
.reservation-status,
.reservation-actions {
  padding: 0 20px 15px;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.reservation-actions {
  justify-content: flex-end;
  gap: 10px;

  background: #fafafa;
  border-radius: 0 0 12px 12px;
  margin-top: 15px;
  margin-bottom: 0;
}

.reservation-header .label {
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
</style>
