<template>
  <div>
    <h2>我的房源</h2>

    <!-- 搜索和筛选栏 -->
    <el-card shadow="never" class="search-card">
      <el-row :gutter="20" align="middle">
        <el-col :span="8">
          <el-input v-model="searchKeyword" placeholder="搜索房源编号/地址..." clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="statusFilter" placeholder="全部状态" clearable>
            <el-option label="已出租" value="已出租" />
            <el-option label="空闲中" value="空闲中" />
            <el-option label="待审核" value="待审核" />
            <el-option label="未通过" value="未通过" />
            <el-option label="已下架" value="已下架" />
          </el-select>
        </el-col>
        <!-- 重置筛选按钮 -->
        <el-col :span="2">
          <el-button @click="resetFilters" type="info" plain>重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 处理空数据情况 -->
    <div v-if="!filteredHouseList || filteredHouseList.length === 0" class="empty-state">
      <p>{{ searchKeyword || statusFilter ? '没有找到符合条件的房源' : '暂无房源信息' }}</p>
    </div>

    <div v-else class="property-list">
      <div>
        <div v-for="house in filteredHouseList" :key="house.id" class="property-list-item">
          <div class="house-card">
            <div class="house-info">
              <h3>{{ house.house_number }}</h3>
              <p>地址：{{ house.position }}</p>
              <el-tag :type="getStatusTagType(house.status)">
                {{ house.status }}
              </el-tag>
              <p v-if="house.status == '未通过'" style="color: #f56c6c">
                未通过原因：{{ house.reject_reason }}
              </p>
              <p>月租：¥{{ house.price }}</p>
            </div>

            <div class="house-actions">
              <el-button type="info" size="default" @click="showHouseInfo(house)">
                <el-icon><Document /></el-icon>
                基础信息
              </el-button>

              <!-- 管理按钮 - 下拉菜单 -->
              <el-dropdown @command="handleManageCommand($event, house)" trigger="click">
                <el-button type="warning" size="default">
                  <el-icon><Setting /></el-icon>
                  管理
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <!-- 已出租的房源 -->
                    <template v-if="house.status === '已出租'">
                      <el-dropdown-item command="tenantInfo" divided> 租客信息 </el-dropdown-item>
                    </template>

                    <!-- 空闲中的房源 -->
                    <template v-if="house.status === '空闲中'">
                      <el-dropdown-item command="offline">暂时下架</el-dropdown-item>
                      <el-dropdown-item command="viewings" divided> 看房记录 </el-dropdown-item>
                    </template>

                    <!-- 已下架的房源 -->
                    <template v-if="house.status === '已下架'">
                      <el-dropdown-item command="publish">重新上架</el-dropdown-item>
                    </template>
                    <!-- 未通过的房源 -->
                    <template v-if="house.status === '未通过'"> </template>
                    <template v-if="house.status !== '已出租'">
                      <el-dropdown-item command="delete" divided>
                        <span style="color: #f56c6c">删除房源</span>
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 租客信息对话框 -->
    <el-dialog v-model="tenantDialogVisible" title="租客信息" :width="400">
      <div v-if="tenantData" class="tenant-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="租客姓名">
            {{ tenantData.username || '---' }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ tenantData.phone_number || '---' }}
          </el-descriptions-item>
          <el-descriptions-item label="房屋编号">
            {{ tenantData.house_number || '---' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="tenantDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

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
          <el-descriptions-item label="上传时间">
            {{ currentHouse.create_time }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(currentHouse.status)">
              {{ currentHouse.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item v-if="currentHouse.status === '未通过'" label="未通过原因">
            {{ currentHouse.reject_reason }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteHouse, housePublish, houseOffline, getHouseList } from '@/util/api'
import { getUserInfo } from '@/util/api'
import store from '@/store'

// 处理数据，添加默认值
const houseList = ref([]) //房屋信息数组
const dialogVisible = ref(false) //房屋基本信息对话框是否显示
const tenantDialogVisible = ref(false) //租客信息对话框是否显示
const currentHouse = ref(null) //当前被操作的房子
const tenantData = ref(null) // 租客数据

// 搜索和筛选相关
const searchKeyword = ref('') //搜索关键词
const statusFilter = ref('') //状态筛选词
const user_id = JSON.parse(window.sessionStorage.getItem('user')).id

// 计算属性 - 过滤后的房源列表
//当 houseList.value、searchKeyword.value或 statusFilter.value中任何一个变化时，computed函数会自动重新执行
const filteredHouseList = computed(() => {
  let result = houseList.value

  // 关键词搜索
  if (searchKeyword.value) {
    //toLowerCase进行小写转换，实现区别大小写的搜索
    const keyword = searchKeyword.value.toLowerCase()
    // 使用数组的 filter()方法创建新数组
    // 保留满足条件的元素，移除不满足的元素
    result = result.filter(
      // house遍历result内的元素
      (house) =>
        // 判断关键词是否在房产编号或地址内内出现
        (house.house_number && house.house_number.toLowerCase().includes(keyword)) ||
        (house.position && house.position.toLowerCase().includes(keyword)),
    )
  }

  // 状态筛选
  if (statusFilter.value) {
    result = result.filter((house) => house.status === statusFilter.value)
  }

  return result
})

// 管理按钮命令处理
const handleManageCommand = async (command, house) => {
  console.log(`执行管理命令 ${command} 对房源:`, house.house_number)

  switch (command) {
    case 'tenantInfo':
      // 查看租客信息
      await showTenantInfo(house)
      break
    case 'publish':
      // 重新发布
      ElMessageBox.confirm(`确定上架房源 "${house.house_number}" 吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(async () => {
          await housePublish(house)
          houseList.value = await getHouseList(user_id)
        })
        .catch(() => {
          console.log('用户取消了操作')
        })

      break
    case 'offline':
      // 暂时下架
      ElMessageBox.confirm(`确定要暂时下架房源 "${house.house_number}" 吗？`, '暂时下架', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(async () => {
          await houseOffline(house)
          houseList.value = await getHouseList(user_id)
        })
        .catch(() => {
          console.log('用户取消了操作')
        })
      break
    case 'viewings':
      // 看房记录
      ElMessage.info('看房记录功能待实现')
      break
    case 'delete':
      // 删除房源
      ElMessageBox.confirm(`确定要删除房源 "${house.house_number}" 吗？此操作不可撤销。`, '警告', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
      })
        .then(() => {
          // 这里调用API删除
          deleteHouse(house)
          houseList.value = houseList.value.filter((h) => h.id !== house.id)
        })
        .catch(() => {
          console.log('用户取消了操作')
        })
      break
  }
}

// 显示房源基础信息
const showHouseInfo = async (house) => {
  currentHouse.value = house
  dialogVisible.value = true
}

// 显示租客信息
const showTenantInfo = async (house) => {
  // 获取租客信息
  const data = await getUserInfo(house.renter)

  if (data) {
    tenantData.value = {
      username: house.renter,
      phone_number: data.phone_number,
      house_number: house.house_number,
    }
    tenantDialogVisible.value = true
  }
}

// 根据状态获取标签类型
const getStatusTagType = (status) => {
  const statusMap = {
    已出租: 'success',
    空闲中: 'primary',
    待审核: 'warning',
    未通过: 'danger',
    下架中: 'info',
  }
  return statusMap[status] || 'info'
}

// 重置所有筛选条件
const resetFilters = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
}

watch(
  () => store.state.HouseListStatus,
  async () => {
    houseList.value = await getHouseList(user_id)
  },
)
onMounted(async () => {
  const user_id = JSON.parse(window.sessionStorage.getItem('user')).id
  houseList.value = await getHouseList(user_id)
})
</script>

<style scoped>
.search-card {
  margin-bottom: 20px;
  padding: 20px;
}

.property-list {
  height: 470px;
  overflow-y: auto;
  overflow-x: hidden;
}

.house-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.house-info h3 {
  margin: 0 20px 10px 0;
  width: 350px;
  word-wrap: break-word; /* 允许单词内换行 */
}

.house-info p {
  margin: 5px 0;
  color: #666;
}

.house-actions {
  display: flex;
  gap: 10px;
  width: 250px;
  margin-right: 50px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
}

.house-detail {
  max-height: 500px;
  overflow-y: auto;
}

.tenant-detail {
  padding: 10px;
}
</style>
