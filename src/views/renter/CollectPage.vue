<template>
  <div class="search-container">
    <h2 class="search-title">我的收藏</h2>
    <!-- 房源列表 -->
    <div v-if="!houseList || houseList.length === 0">
      <el-empty description="暂无房源信息"> </el-empty>
    </div>

    <div v-else class="property-list-container">
      <div class="property-list">
        <el-card v-for="house in houseList" :key="house.id" shadow="hover" class="property-card">
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
              <p class="house-time">
                <el-icon><Clock /></el-icon>
                收藏时间：<span>{{ house.collected_time }}</span>
              </p>
            </div>

            <div class="house-actions">
              <el-button type="info" size="large" @click="showHouseInfo(house)" class="info-btn">
                <el-icon><Document /></el-icon>
                基础信息
              </el-button>

              <!-- 管理按钮 - 下拉菜单 -->
              <el-dropdown @command="handleManageCommand($event, house)" placement="bottom-end">
                <el-button type="warning" size="large" class="manage-btn">
                  <el-icon><Setting /></el-icon>
                  管理
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="cancelCollect">
                      <el-icon><Star /></el-icon>
                      <span>取消收藏</span>
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
          <el-descriptions-item label="房东名字">
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
      <SignDialog :house-info="signHouse" @close="signVisible = false" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { delRenterCollect } from '@/util/api'
import { getRenterCollect } from '@/util/api'
import ReservationPage from '../../components/ReservationPage.vue'
import ReportDialog from '../../components/ReportDialog.vue'
import SignDialog from '../../components/SignDialog.vue'

const userId = JSON.parse(sessionStorage.getItem('user')).id
// 处理数据，添加默认值
const houseList = ref([])
const dialogVisible = ref(false)
const reservationVisible = ref(false)
const currentHouse = ref(null)
const reservationHouse = ref(null)
const reportedHouse = ref(null)
const reportVisible = ref(false)
const signVisible = ref(false)
const signHouse = ref(null)

// 在组件挂载时加载数据
onMounted(async () => {
  houseList.value = await getRenterCollect(userId)
})

// 管理按钮命令处理
const handleManageCommand = async (command, house) => {
  switch (command) {
    case 'cancelCollect': {
      const data = {
        renter_id: userId,
        house_id: house.id,
      }
      const result = await delRenterCollect(data)
      if (result == 200) {
        houseList.value = await getRenterCollect(userId)
      }
      break
    }
    case 'reservation':
      reservation(house)
      break
    case 'report':
      report(house)
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
.property-list {
  padding: 30px;
}
.search-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
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
/* 房源列表容器 */
.property-list-container {
  margin-top: -23px;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  padding-right: 5px;
}

.property-list-container::-webkit-scrollbar {
  display: none;
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
.house-price,
.house-time {
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

.empty-state :deep(.el-empty__description) {
  font-size: 16px;
  color: #666;
  margin-top: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
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
