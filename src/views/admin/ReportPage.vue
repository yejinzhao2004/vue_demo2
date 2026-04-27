<template>
  <div class="report-container">
    <h2 class="title">举报管理</h2>

    <!-- 添加筛选表单 -->
    <div class="filter-container">
      <el-input
        v-model="filters.keyword"
        placeholder="请输入举报人/被举报房源编号/举报内容"
        class="search-input"
        clearable
      />

      <el-select v-model="filters.status" placeholder="请选择状态" class="status-select" clearable>
        <el-option label="待处理" value="待处理" />
        <el-option label="已处理" value="已处理" />
        <el-option label="已驳回" value="已驳回" />
      </el-select>

      <el-button type="primary" @click="resetFilters">重置</el-button>
    </div>

    <div v-if="filteredReportData && filteredReportData.length > 0" class="report-list">
      <el-card v-for="(item, index) in filteredReportData" :key="index" class="report-card">
        <div class="report-header">
          <span class="label">举报人名称:</span>
          <div>{{ item.reporter_name }}</div>
        </div>
        <div class="report-content">
          <span class="label">被举报房源编号:</span>
          <el-tag type="info" effect="light" size="large">{{ item.house_number }}</el-tag>
        </div>
        <div class="report-content">
          <span class="label">举报内容:</span>
          <el-tag type="info" effect="light" size="large">{{ item.report_content }}</el-tag>
        </div>
        <div class="report-content">
          <span class="label">举报时间:</span>
          <el-tag type="info" effect="light" size="large">{{ item.create_time }}</el-tag>
        </div>
        <div class="report-status">
          <span class="label">状态:</span>
          <el-tag :type="getStatusType(item.status)" effect="dark" size="small">
            {{ item.status }}
          </el-tag>
        </div>
        <div class="report-content" v-if="item.status === '已处理'">
          <span class="label">处理结果:</span>
          <el-tag type="info" effect="light" size="large">{{ item.result }}</el-tag>
        </div>
        <div class="report-actions" v-if="item.status !== '待处理'">
          <el-button type="danger" @click="delete_report(item.id)">删除</el-button>
        </div>

        <div class="report-actions" v-if="item.status === '待处理'">
          <el-button type="success" @click="handleReport(item.id, '已处理')">处理</el-button>
          <el-button type="warning" @click="handleReport(item.id, '已驳回')">驳回</el-button>
          <el-button type="danger" @click="delete_report(item.id)">删除</el-button>
        </div>
      </el-card>
    </div>
    <template v-else>
      <el-empty description="暂无符合条件的举报记录" />
    </template>
  </div>
</template>

<script setup>
import { delReportedHouse, adminGetReportedHouse, adminSetReportedHouse } from '@/util/api'
import { onMounted, ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

let reportData = ref([])

// 筛选条件
const filters = ref({
  keyword: '',
  status: '',
})

// 计算属性：根据筛选条件过滤举报数据
const filteredReportData = computed(() => {
  return reportData.value.filter((item) => {
    // 关键字筛选：匹配举报人ID、房源编号或举报内容
    const matchesKeyword =
      !filters.value.keyword ||
      item.reporter.toString().includes(filters.value.keyword) ||
      item.house_number.toLowerCase().includes(filters.value.keyword.toLowerCase()) ||
      item.report_content.toLowerCase().includes(filters.value.keyword.toLowerCase())

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
    待处理: 'warning',
    已处理: 'success',
    已驳回: 'danger',
  }
  return statusMap[status] || 'info'
}

// 处理举报
const handleReport = async (reportId, status) => {
  try {
    await ElMessageBox.confirm(`确定要将该举报修改为"${status}"状态吗？`, '处理举报', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: status === '已处理' ? 'success' : 'warning',
    })
    let reason = ''
    if (status === '已处理') {
      // 由于ElMessageBox.prompt()返回的是一个promise对象，所以需要用await等待用户输入，然后进行解构获取其中的value属性
      const { value } = await ElMessageBox.prompt('请输入处理结果：', '处理结果', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入处理结果',
      })
      reason = value
    }
    const data = {
      report_id: reportId,
      status: status,
      reason: reason,
    }
    // 调用处理举报的API
    await adminSetReportedHouse(data)

    // 更新列表
    const result = await adminGetReportedHouse()
    if (result.code === 200) {
      reportData.value = result.data
      ElMessage.success(`${status}成功`)
    } else {
      ElMessage.error(`处理失败: ${result.msg}`)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error('处理失败')
    }
  }
}

// 删除举报
const delete_report = async (reportId) => {
  try {
    await ElMessageBox.confirm('确定要删除这个举报记录？', '删除举报', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await delReportedHouse({ report_id: reportId })
    const result = await adminGetReportedHouse()
    if (result.code === 200) {
      reportData.value = result.data
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

onMounted(async () => {
  // 获取所有举报数据
  let result = await adminGetReportedHouse()
  if (result.code === 200) {
    reportData.value = result.data.map((item) => ({
      ...item,
      visible: false, // 添加可见性控制字段
    }))
  }
})
</script>

<style scoped>
/* 容器样式 */
.report-container {
  padding: 30px 40px;
  width: 100%;
  max-width: 1400px;
  min-height: calc(100vh - 120px);
  background: #f5f7fa;
  box-sizing: border-box;
  margin: 0 auto;
}

.report-list {
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
.report-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid #e4e7ed;
}

.report-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.8);
}

/* 卡片内容样式 */
.report-header {
  display: flex;

  align-items: flex-start;
  padding: 20px;
  background: linear-gradient(135deg, #e74c3c, #f39c12);
  color: white;
  border-radius: 12px 12px 0 0;
  margin-bottom: 15px;
}

.report-content,
.report-status,
.report-actions {
  padding: 0 20px 15px;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.report-actions {
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  background: #fafafa;
  border-radius: 0 0 12px 12px;
  margin-top: 15px;
  margin-bottom: 0;
}

.report-header .label {
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
