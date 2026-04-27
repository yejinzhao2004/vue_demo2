<template>
  <div class="simple-report-form">
    <!-- 举报描述 -->
    <div class="form-section">
      <label for="report-description" class="form-label">举报描述</label>
      <!-- 可以通过拖动右下角的按钮来拖动改变组件的宽度和高度 -->
      <textarea
        v-model="report_content"
        placeholder="请详细描述您发现的房屋问题..."
        class="desc-input"
        rows="5"
        :maxlength="500"
        id="report-description"
      ></textarea>
      <div class="char-count">{{ report_content.length }}/500</div>
    </div>

    <!-- 提交按钮 -->
    <div class="form-actions">
      <button type="button" @click="handleCancel" class="btn btn-secondary">取消</button>
      <button
        @click="handleSubmit"
        :disabled="!canSubmit"
        class="btn btn-primary"
        :class="{ disabled: !canSubmit }"
      >
        {{ isSubmitting ? '提交中...' : '提交举报' }}
      </button>
    </div>

    <!-- 提示信息 -->
    <div v-if="showTips" class="tips-section">
      <div class="tip-icon">💡</div>
      <div class="tip-content">请如实描述问题，我们会尽快核实处理</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { setReportedHouse } from '../util/api'
import { ElMessage } from 'element-plus'

const props = defineProps({
  house: {
    house_number: {},
    id: {},
  },
})
const emit = defineEmits(['close'])
// 举报描述
const report_content = ref('')

// 提交状态
const isSubmitting = ref(false)

// 是否显示提示
const showTips = ref(true)

// 计算属性
const canSubmit = computed(() => {
  return report_content.value.trim().length >= 10
})

// 处理方法
const handleSubmit = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true
  const data = {
    house_id: props.house.id,
    house_number: props.house.house_number,
    report_content: report_content.value,
    reporter_id: JSON.parse(window.sessionStorage.getItem('user')).id,
  }
  console.log(data)
  let result = await setReportedHouse(data)
  if (result.code === 200) {
    ElMessage.success(result.info)
  } else {
    ElMessage.error(result.errorInfo)
  }
  emit('close')
  report_content.value = ''
  isSubmitting.value = false
}

const handleCancel = () => {
  emit('close')
  report_content.value = ''
  isSubmitting.value = false
}
</script>

<style scoped>
.simple-report-form {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.desc-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical; /* 只允许用户调整高度 */
  transition: border-color 0.3s; /* 添加边框变色时的过渡效果 */
}

.desc-input:focus {
  outline: none; /* 移除默认的聚焦样式 */
  border-color: #409eff; /* 设置聚焦时的边框颜色 */
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #409eff;
  color: white;
}

.btn-primary:hover:not(.disabled) {
  background-color: #66b1ff;
}

.btn-primary.disabled {
  background-color: #a0cfff;
  /*鼠标指针变成禁止符号 */
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f4f4f5;
  color: #606266;
}

.btn-secondary:hover {
  background-color: #e9e9eb;
}

.tips-section {
  margin-top: 24px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tip-icon {
  font-size: 18px;
}

.tip-content {
  font-size: 13px;
  color: #409eff;
}
</style>
