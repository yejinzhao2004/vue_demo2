<template>
  <div class="report-container">
    <h2 class="title">举报详情</h2>

    <div v-if="reportData && reportData.length > 0" class="report-list">
      <el-card v-for="(item, index) in reportData" :key="index" class="report-card" shadow="always">
        <div class="card-header">
          <span class="label">房产编号:</span>
          <div>{{ item.house_number }}</div>
        </div>
        <div class="card-content">
          <span class="label">举报内容:</span>
          <el-tag type="info" effect="dark" size="large">{{ item.report_content }}</el-tag>
        </div>
        <div class="card-content">
          <span class="label">举报时间:</span>
          <el-tag type="info" effect="dark" size="large">{{ item.create_time }}</el-tag>
        </div>
        <div class="card-status">
          <span class="label">状态:</span>
          <el-tag :type="getStatusType(item.status)" effect="dark" size="small">{{
            item.status
          }}</el-tag>
        </div>
        <div v-if="item.status === '已处理'" class="card-content">
          <span class="label">处理结果:</span>
          <el-tag type="info" effect="dark" size="large">{{ item.result }}</el-tag>
        </div>
        <div class="card-actions">
          <el-button type="danger" @click="delete_report(item.id)">删除</el-button>
        </div>
      </el-card>
    </div>

    <template v-else>
      <el-empty description="未找到举报信息" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { delReportedHouse, getReportedHouse } from '@/util/api'
import { ElMessageBox } from 'element-plus'

// 数据
const reportData = ref([]) // 初始化为空数组

// 从 sessionStorage 获取 reporter_id
const getReporterIdFromSession = () => {
  const user = JSON.parse(sessionStorage.getItem('user')).id
  return user
}

const reporterId = getReporterIdFromSession()
// 获取举报详情
const fetchReportDetail = async () => {
  const result = await getReportedHouse(reporterId)
  if (result.code == 200) {
    reportData.value = result.data
  }
}

const delete_report = async (report_id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个举报信息吗？', '删除举报信息', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await delReportedHouse({ report_id: report_id })
    await fetchReportDetail()
  } catch (error) {
    if (error !== 'cancel') {
      console.log(error)
    }
  }
}
const getStatusType = (status) => {
  const statusMap = {
    待处理: 'warning',
    已处理: 'success',
    已驳回: 'danger',
  }
  return statusMap[status] || '未知'
}
// 页面加载时自动获取数据
onMounted(async () => {
  if (getReporterIdFromSession()) {
    await fetchReportDetail()
  }
})
</script>

<style scoped>
.report-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(470px, 1fr));
  gap: 20px;
  padding: 10px;
}
/* 容器样式 */
.report-container {
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
.report-card {
  margin-bottom: 25px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.report-card:hover {
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
  background: linear-gradient(90deg, #e74c3c, #f39c12);
  color: white;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
}

.card-header + .card-content {
  border-top: none;
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
  .report-container {
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
