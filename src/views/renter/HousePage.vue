<template>
  <div class="search-container">
    <h2 class="search-title">搜索房源</h2>

    <!-- 搜索和筛选栏 -->
    <el-card shadow="always" class="search-card">
      <el-row :gutter="20" align="middle">
        <el-col :span="8">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索房源编号/地址..."
            clearable
            size="large"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>

        <!-- 房租区间筛选 -->
        <el-col :span="5">
          <el-input-number
            v-model="priceRange.min"
            :min="0"
            :max="100000"
            :step="100"
            placeholder="最低租金"
            controls-position="right"
            size="large"
            class="price-input"
          />
        </el-col>

        <el-col :span="1" style="text-align: center">
          <span style="line-height: 40px; color: #666; font-weight: 500">-</span>
        </el-col>

        <el-col :span="5">
          <el-input-number
            v-model="priceRange.max"
            :min="0"
            :max="100000"
            :step="100"
            placeholder="最高租金"
            controls-position="right"
            size="large"
            class="price-input"
          />
        </el-col>

        <!-- 重置筛选按钮 -->
        <el-col :span="3" :offset="2">
          <el-button @click="resetFilters" type="info" plain size="large" style="width: 100%">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 房源列表 -->
    <div v-if="!filteredHouseList || filteredHouseList.length === 0" class="empty-state">
      <el-empty :description="hasActiveFilters ? '没有找到符合条件的房源' : '暂无房源信息'">
        <template #image>
          <el-icon :size="60"><House /></el-icon>
        </template>
      </el-empty>
    </div>

    <div v-else class="property-list-container">
      <div class="property-list">
        <el-card
          v-for="house in filteredHouseList"
          :key="house.id"
          shadow="hover"
          class="property-card"
        >
          <div class="house-card">
            <div class="house-info">
              <h3 class="house-number">
                <el-tag type="info" effect="dark" size="large">{{ house.house_number }}</el-tag>
              </h3>
              <p class="house-address">
                <el-icon><Location /></el-icon>
                地址：{{ house.position }}
              </p>
              <p class="house-price">
                <el-icon><Money /></el-icon>
                月租：<span class="price-value">¥{{ house.price }}</span>
              </p>
            </div>

            <div class="house-actions">
              <el-button type="info" size="large" @click="showHouseInfo(house)" class="info-btn">
                <el-icon><Document /></el-icon>
                基础信息
              </el-button>

              <!-- 管理按钮 - 下拉菜单 -->
              <el-dropdown
                @command="handleManageCommand($event, house)"
                placement="bottom-end"
                trigger="click"
              >
                <el-button type="warning" size="large" class="manage-btn">
                  <el-icon><Setting /></el-icon>
                  管理
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="collect">
                      <el-icon><Star /></el-icon>
                      <span>收藏房源</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="reservation">
                      <el-icon><Calendar /></el-icon>
                      <span>看房预约</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="signLease" divided>
                      <el-icon><Document /></el-icon>
                      <span>租赁签约</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="report" divided>
                      <el-icon><Warning /></el-icon>
                      <span>举报房源</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>

  <!-- 基础信息对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="currentHouse ? '房源基础信息 - ' + currentHouse.house_number : '房源信息'"
    :width="500"
  >
    <div v-if="currentHouse" class="house-detail">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="产权编号">
          {{ currentHouse.house_number }}
        </el-descriptions-item>
        <el-descriptions-item label="地址">
          {{ currentHouse.position }}
        </el-descriptions-item>
        <el-descriptions-item label="月租金"> ¥{{ currentHouse.price }} </el-descriptions-item>
        <el-descriptions-item label="类型">
          {{ currentHouse.house_type }}
        </el-descriptions-item>
        <el-descriptions-item label="户型">
          {{ currentHouse.house_layout }}
        </el-descriptions-item>
        <el-descriptions-item label="面积"> {{ currentHouse.area }} ㎡ </el-descriptions-item>
        <el-descriptions-item label="楼层">
          {{ currentHouse.floor_level }}
        </el-descriptions-item>
        <el-descriptions-item label="朝向">
          {{ currentHouse.face }}
        </el-descriptions-item>
        <el-descriptions-item label="房东账号">
          {{ currentHouse.landlord_name }}
        </el-descriptions-item>
        <el-descriptions-item label="电话号码">
          {{ currentHouse.landlord_phone_number }}
        </el-descriptions-item>
        <el-descriptions-item label="上传时间">
          {{ currentHouse.create_time }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
  <el-dialog v-model="reservationVisible" :width="500">
    <ReservationPage :house_id="reservationHouse.id" @close="reservationVisible = false" />
  </el-dialog>
  <el-dialog v-model="reportVisible" :width="500">
    <ReportDialog :house="reportedHouse" @close="reportVisible = false" />
  </el-dialog>
  <el-dialog v-model="signVisible" :width="600">
    <SignDialog v-model="signVisible" :house-info="signHouse" @close="signVisible = false" />
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { Search, Document, Setting, ArrowDown } from '@element-plus/icons-vue'
import { setRenterCollect, getVacantHouse } from '@/util/api'
import ReservationPage from '../../components/ReservationPage.vue'
import ReportDialog from '../../components/ReportDialog.vue'
import SignDialog from '../../components/SignDialog.vue'
// 处理数据，添加默认值
const houseList = ref([]) //房屋信息数组
const dialogVisible = ref(false) //房屋基本信息对话框是否显示
const reservationVisible = ref(false) //看房预约对话框是否显示
const currentHouse = ref(null) //展示基础信息的房子
const reservationHouse = ref(null) //建立看房预约的房子
const reportedHouse = ref(null) //举报的房子
const reportVisible = ref(false) //举报对话框是否显示
const signVisible = ref(false) //租金签约对话框是否显示
const signHouse = ref(null) //租金签约的房子

// 搜索和筛选相关
const searchKeyword = ref('') //搜索关键词

// 房租区间筛选
const priceRange = reactive({
  min: null,
  max: null,
})

// 在组件挂载时加载数据
onMounted(async () => {
  houseList.value = await getVacantHouse()
})

// 计算是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return searchKeyword.value.trim() !== '' || priceRange.min !== null || priceRange.max !== null
})

// 重置所有筛选条件
const resetFilters = () => {
  searchKeyword.value = ''
  priceRange.min = null
  priceRange.max = null
}

// 计算属性 - 过滤后的房源列表
const filteredHouseList = computed(() => {
  let result = houseList.value

  //搜索关键词筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      (house) =>
        (house.house_number && house.house_number.toLowerCase().includes(keyword)) ||
        (house.position && house.position.toLowerCase().includes(keyword)),
    )
  }

  // 房租区间筛选
  if (priceRange.min !== null && priceRange.min >= 0) {
    result = result.filter((house) => {
      // 确保house.price是数字类型
      const price = Number(house.price)
      return !isNaN(price) && price >= priceRange.min
    })
  }

  if (priceRange.max !== null && priceRange.max > 0) {
    result = result.filter((house) => {
      const price = Number(house.price)
      return !isNaN(price) && price <= priceRange.max
    })
  }

  return result
})

// 管理按钮命令处理
const handleManageCommand = async (command, house) => {
  console.log(`执行管理命令 ${command} 对房源:`, house.house_number)

  switch (command) {
    case 'collect': {
      const data = {
        house_id: house.id,
        renter_id: JSON.parse(window.sessionStorage.getItem('user')).id,
      }
      await setRenterCollect(data)
      break
    }
    case 'report':
      report(house)
      break
    case 'reservation':
      reservation(house)
      break
    case 'signLease':
      sign(house)
      break
  }
}

// 显示房源基础信息
const showHouseInfo = (house) => {
  currentHouse.value = house
  dialogVisible.value = true
}

const reservation = (house) => {
  reservationVisible.value = true
  reservationHouse.value = house
}
const report = (house) => {
  reportedHouse.value = house
  reportVisible.value = true
}
const sign = (house) => {
  signVisible.value = true
  signHouse.value = house
}
</script>

<style scoped>
/* 容器样式 */

.search-container {
  background-color: #c4c2c2;
  border-radius: 30px;
  padding: 30px;
  text-align: center;
  width: 1100px;
  height: 800px;
  box-sizing: border-box;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

/* 标题样式 */
.search-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* 搜索卡片样式 */
.search-card {
  margin: 0 30px 20px 30px;
  padding-right: 40px;
  height: auto;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

.search-card :deep(.el-card__body) {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 价格输入框 */
.price-input {
  width: 100%;
}

.price-input :deep(.el-input__wrapper) {
  padding-left: 12px;
  padding-right: 12px;
}

/* 房源列表容器 */
.property-list-container {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  padding-right: 5px;
}

.property-list-container::-webkit-scrollbar {
  display: none;
}

/* 房源列表样式 */
.property-list {
  padding: 30px;
}

/* 房源卡片样式 */
.property-card {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

.property-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8) !important;
}

/* 房源信息样式 */
.house-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.house-info {
  flex: 1;
  text-align: left;
  min-width: 0; /* 防止内容溢出 */
}

.house-number {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.house-address,
.house-price {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.house-price .price-value {
  color: #e6a23c;
  font-weight: 600;
  font-size: 16px;
}

/* 操作按钮区域 */
.house-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.info-btn,
.manage-btn {
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* 空状态样式 */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.empty-state :deep(.el-empty__description) {
  font-size: 16px;
  color: #666;
  margin-top: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-container {
    padding: 20px;
    border-radius: 20px;
  }

  .search-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .house-card {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .house-info {
    text-align: center;
  }

  .house-actions {
    width: 100%;
    justify-content: center;
  }

  .info-btn,
  .manage-btn {
    flex: 1;
  }
}
</style>
