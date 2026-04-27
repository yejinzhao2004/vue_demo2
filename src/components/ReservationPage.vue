<template>
  <div class="appointment">
    <h3>预约看房</h3>

    <!-- 日期选择 -->
    <div class="date-picker">
      <div class="week-days">
        <div
          v-for="day in weekDays"
          :key="day.date"
          :class="['day', { selected: selectedDate === day.date }]"
          @click="selectDate(day.date)"
        >
          <div>{{ day.weekday }}</div>
          <div>{{ day.day }}日</div>
        </div>
      </div>
    </div>

    <!-- 时间表 -->
    <div class="time-table" v-if="selectedDate">
      <div v-for="time in timeSlots" :key="time">
        <button
          :class="['time-btn', { selected: selectedTime === time }]"
          @click="selectTime(time)"
        >
          {{ time }}
        </button>
      </div>
    </div>

    <!-- 确认按钮 -->
    <button v-if="selectedDate && selectedTime" class="confirm-btn" @click="confirm">
      确认预约 &nbsp;&nbsp;&nbsp;{{ selectedDate }} {{ selectedTime }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { setReservation } from '@/util/api'

const props = defineProps({
  house_id: null,
})
const renter_id = JSON.parse(window.sessionStorage.getItem('user')).id
// 响应式数据
const selectedDate = ref(null)
const selectedTime = ref(null)
const weekDays = ref([])
const timeSlots = ref(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '18:00', '19:00'])
const emit = defineEmits(['close'])

// 生成未来7天的日期
const generateWeekDays = () => {
  const today = new Date()
  const days = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    // 通过setDate更改date中Date的值之后，其中Month，FullYear和Day等的值也会根据月份与年份等递进
    date.setDate(today.getDate() + i)

    days.push({
      date: `${date.getMonth() + 1}.${date.getDate()}`,
      weekday: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
      day: date.getDate(),
    })
  }

  weekDays.value = days
}

// 选择日期
const selectDate = (date) => {
  selectedDate.value = date
  selectedTime.value = null
}

// 选择时间
const selectTime = (time) => {
  selectedTime.value = time
}

// 确认预约
const confirm = async () => {
  const data = {
    renter_id: renter_id,
    house_id: props.house_id,
    selectedDate: selectedDate.value,
    selectedTime: selectedTime.value,
  }
  console.log(data)
  let result = await setReservation(data)
  if (result.code == 200) {
    ElMessage.success(
      `预约成功,等待房东确认：日期:${selectedDate.value} 时间:${selectedTime.value}`,
    )
  } else {
    ElMessage.error(result.errorInfo)
  }
  emit('close')
  selectedDate.value = null
  selectedTime.value = null
}

// 组件挂载时初始化日期
onMounted(() => {
  generateWeekDays()
})
</script>

<style scoped>
.appointment {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.week-days {
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

.day {
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}

.day.selected {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.time-table {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.time-btn {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.time-btn.selected {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.confirm-btn {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
