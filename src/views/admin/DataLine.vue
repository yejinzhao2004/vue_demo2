<template>
  <div class="data-overview-container">
    <el-row :gutter="20" class="overview-row">
      <!-- 用户数量 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
        <div class="overview-card">
          <div class="card-icon bg-blue">
            <i class="el-icon-user"></i>
          </div>
          <div class="card-content">
            <p class="card-title">用户总数</p>
            <p class="card-number">{{ userCount }}</p>
          </div>
        </div>
      </el-col>

      <!-- 房源数量 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
        <div class="overview-card">
          <div class="card-icon bg-green">
            <i class="el-icon-house"></i>
          </div>
          <div class="card-content">
            <p class="card-title">房源总数</p>
            <p class="card-number">{{ houseCount }}</p>
          </div>
        </div>
      </el-col>

      <!-- 租赁中订单数量 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
        <div class="overview-card">
          <div class="card-icon bg-orange">
            <i class="el-icon-document"></i>
          </div>
          <div class="card-content">
            <p class="card-title">租赁中订单</p>
            <p class="card-number">{{ rentingOrderCount }}</p>
          </div>
        </div>
      </el-col>

      <!-- 待审核房源数量 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
        <div class="overview-card">
          <div class="card-icon bg-purple">
            <i class="el-icon-finished"></i>
          </div>
          <div class="card-content">
            <p class="card-title">待审核房源</p>
            <p class="card-number">{{ pendingHouseCount }}</p>
          </div>
        </div>
      </el-col>

      <!-- 待处理举报数量 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
        <div class="overview-card">
          <div class="card-icon bg-red">
            <i class="el-icon-warning"></i>
          </div>
          <div class="card-content">
            <p class="card-title">待处理举报</p>
            <p class="card-number">{{ pendingReportCount }}</p>
          </div>
        </div>
      </el-col>

      <!-- 今日订单数量 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
        <div class="overview-card">
          <div class="card-icon bg-teal">
            <i class="el-icon-timer"></i>
          </div>
          <div class="card-content">
            <p class="card-title">今日订单</p>
            <p class="card-number">{{ todayOrderCount }}</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表展示区域 -->
    <el-card class="chart-card">
      <template #header>
        <div class="clearfix">
          <span>近期数据趋势</span>
          <el-button style="float: right; padding: 3px 0" type="text">查看更多</el-button>
        </div>
      </template>
      <div class="chart-container">
        <el-empty description="暂无图表数据" v-if="!chartLoaded"></el-empty>
        <div v-else class="chart-placeholder">这里将展示数据趋势图表</div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserList, adminGetHouseList, getOrderList, adminGetReportedHouse } from '@/util/api'

// 初始化各项统计数据
const userCount = ref(0)
const houseCount = ref(0)
const rentingOrderCount = ref(0)
const pendingHouseCount = ref(0)
const pendingReportCount = ref(0)
const todayOrderCount = ref(0)
const chartLoaded = ref(false)

// 获取用户数量
const loadUserCount = async () => {
  try {
    const result = await getUserList({ page: 1, limit: 1 }) // 获取第一页一条数据，主要是为了获取总数
    if (result && result.total !== undefined) {
      userCount.value = result.total
    } else {
      userCount.value = 0
    }
  } catch (error) {
    console.error('获取用户数量失败:', error)
    userCount.value = 0
  }
}

// 获取房源数量
const loadHouseCount = async () => {
  try {
    const result = await adminGetHouseList({ page: 1, limit: 1, status: '' }) // 获取所有房源
    if (result && result.total !== undefined) {
      houseCount.value = result.total
    } else {
      houseCount.value = 0
    }
  } catch (error) {
    console.error('获取房源数量失败:', error)
    houseCount.value = 0
  }
}

// 获取租赁中订单数量
const loadRentingOrderCount = async () => {
  try {
    // 这里需要获取租赁中的订单，暂时用全部订单代替
    const result = await getOrderList({ page: 1, limit: 1 })
    if (result && result.total !== undefined) {
      rentingOrderCount.value = result.total
    } else {
      rentingOrderCount.value = 0
    }
  } catch (error) {
    console.error('获取订单数量失败:', error)
    rentingOrderCount.value = 0
  }
}

// 获取待审核房源数量
const loadPendingHouseCount = async () => {
  try {
    // 获取审核状态为待审核的房源
    const result = await adminGetHouseList({ page: 1, limit: 1, status: 'pending' })
    if (result && result.total !== undefined) {
      pendingHouseCount.value = result.total
    } else {
      pendingHouseCount.value = 0
    }
  } catch (error) {
    console.error('获取待审核房源数量失败:', error)
    pendingHouseCount.value = 0
  }
}

// 获取待处理举报数量
const loadPendingReportCount = async () => {
  try {
    const result = await adminGetReportedHouse({ page: 1, limit: 1, status: 'pending' })
    if (result && result.total !== undefined) {
      pendingReportCount.value = result.total
    } else {
      pendingReportCount.value = 0
    }
  } catch (error) {
    console.error('获取待处理举报数量失败:', error)
    pendingReportCount.value = 0
  }
}

// 获取今日订单数量
const loadTodayOrderCount = async () => {
  try {
    // 这里可能需要一个专门获取今日订单的API，暂时用全部订单代替
    const result = await getOrderList({ page: 1, limit: 1, date: 'today' })
    if (result && result.total !== undefined) {
      todayOrderCount.value = result.total
    } else {
      todayOrderCount.value = 0
    }
  } catch (error) {
    console.error('获取今日订单数量失败:', error)
    todayOrderCount.value = 0
  }
}

// 加载所有数据
const loadData = async () => {
  try {
    // 并行加载所有数据
    await Promise.all([
      loadUserCount(),
      loadHouseCount(),
      loadRentingOrderCount(),
      loadPendingHouseCount(),
      loadPendingReportCount(),
      loadTodayOrderCount(),
    ])

    // 模拟图表加载
    setTimeout(() => {
      chartLoaded.value = true
    }, 1000)

    ElMessage.success('数据加载成功')
  } catch (error) {
    console.error('数据加载失败:', error)
    ElMessage.error('数据加载失败，请稍后重试')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.data-overview-container {
  padding: 20px;
}

.overview-row {
  margin-bottom: 20px;
}

.overview-card {
  display: flex;
  align-items: center;
  height: 100px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  font-size: 24px;
  margin-right: 15px;
}

.bg-blue {
  background-color: #409eff;
}

.bg-green {
  background-color: #67c23a;
}

.bg-orange {
  background-color: #e6a23c;
}

.bg-purple {
  background-color: #9013fe;
}

.bg-red {
  background-color: #f56c6c;
}

.bg-teal {
  background-color: #20b2aa;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #606266;
  margin: 0 0 5px 0;
}

.card-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.chart-card {
  margin-top: 20px;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 4px;
}

@media screen and (max-width: 768px) {
  .overview-card {
    margin-bottom: 15px;
  }

  .card-number {
    font-size: 20px;
  }
}
</style>
