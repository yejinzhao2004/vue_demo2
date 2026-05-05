<template>
  <div class="data-overview-container">
    <el-row :gutter="20" class="overview-row">
      <!-- 用户数量 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4">
        <div class="overview-card">
          <div class="card-icon bg-blue">
            <el-icon><User /></el-icon>
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
            <el-icon><House /></el-icon>
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
            <el-icon><List /></el-icon>
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
            <el-icon><Loading /></el-icon>
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
            <el-icon><Warning /></el-icon>
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
            <el-icon><List /></el-icon>
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
import { getDataLine } from '@/util/api'

// 响应式数据
const userCount = ref(0)
const houseCount = ref(0)
const rentingOrderCount = ref(0)
const pendingHouseCount = ref(0)
const pendingReportCount = ref(0)
const todayOrderCount = ref(0)
const chartLoaded = ref(false)

// 初始化数据
onMounted(async () => {
  try {
    const result = await getDataLine()
    if (result.code === 200) {
      userCount.value = result.data.user_count
      houseCount.value = result.data.house_count
      rentingOrderCount.value = result.data.renting_order_count
      pendingHouseCount.value = result.data.pending_house_count
      pendingReportCount.value = result.data.pending_report_count
      todayOrderCount.value = result.data.today_order_count
    }
  } catch (error) {
    console.error('数据初始化失败:', error)
  }
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
  margin-bottom: 20px;
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
