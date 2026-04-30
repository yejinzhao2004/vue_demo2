<template>
  <!-- :close-on-click-modal="false"
    :close-on-press-escape="false"使得用户不能通过点击对话框以外的区域关闭对话框
    以及不能按esc键关闭对话框 -->
  <el-dialog
    v-model="showDialog"
    :title="dialogTitle"
    width="600px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="sign-content">
      <div class="contract-info">
        <h3>{{ contractTitle }}</h3>
        <p><strong>房源编号：</strong>{{ houseNumber }}</p>
        <p><strong>月租金：</strong>¥{{ price }}/月</p>
        <p><strong>地址：</strong>{{ address }}</p>
      </div>

      <div class="contract-preview">
        <h4>租赁合同预览</h4>
        <div class="preview-content">
          <p>出租方（甲方）：{{ landlordName }}</p>
          <p>承租方（乙方）：{{ tenantName }}</p>
          <p>租赁期限：{{ leaseTerm }}</p>
          <p>押金：¥{{ deposit }}</p>
          <p>付款方式：{{ paymentMethod }}</p>
          <p>违约责任及其他条款...</p>
        </div>
      </div>

      <div class="signature-section">
        <el-checkbox v-model="agreed" size="large" class="agreement-checkbox" id="agreement">
          我已阅读并同意上述租赁合同的所有条款
        </el-checkbox>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="signContract" :disabled="!agreed" :loading="submitting">
          {{ submitting ? '签署中...' : '确认签署' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getLandlordName, setOrder, getBalance, payDeposit } from '@/util/api'

// 定义组件 props
const props = defineProps({
  houseInfo: {
    type: Object,
    default: () => ({}),
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
})

// 定义 emits
// update:modelValue是父组件向子组件传递的参数，控制弹窗的显示和隐藏
// signed是子组件向父组件传递的参数，表示合同签署成功
const emit = defineEmits(['close', 'signed'])

const agreed = ref(false) //作用是记录用户是否同意合同条款
const submitting = ref(false) //创建一个用于控制签署流程的布尔值
const userId = JSON.parse(sessionStorage.getItem('user')).id
// 合同相关信息
const dialogTitle = '房屋租赁合同签署'
const contractTitle = computed(() => `房屋租赁合同 - ${props.houseInfo.house_number || ''}`)
const houseNumber = computed(() => props.houseInfo.house_number || '')
const price = computed(() => props.houseInfo.price || 0)
const address = computed(() => props.houseInfo.position || '')
const landlordName = ref('')
const tenantName = ref('')
const leaseTerm = ref('一年')
const deposit = computed(() => price.value * 2)
const paymentMethod = ref('押二付一')
const landlordPhoneNumber = ref('')
const userInfo = JSON.parse(sessionStorage.getItem('user') || '{}')
const position = computed(() => props.houseInfo.position || '')
const regulations = ref('违约责任及其他条款...')
const showDialog = ref(true)
const houseId = computed(() => props.houseInfo.id)
const getLandlord = async () => {
  let result = getLandlordName(props.houseInfo.id)
  return result
}

// 处理关闭弹窗
const handleClose = () => {
  if (submitting.value) return

  ElMessageBox.confirm('确认关闭签署窗口？您尚未完成签署。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    emit('close')
  })
}

// 处理签署合同
const signContract = async () => {
  if (!agreed.value) {
    ElMessage.warning('请先阅读并同意合同条款')
    return
  }

  submitting.value = true
  const balance = await getBalance(userId)
  ElMessageBox.confirm(
    `确认支付押金💰${deposit.value}到账户${landlordName.value}吗？当前账户余额为💰${balance}`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(async () => {
      try {
        if (balance < deposit.value) {
          ElMessage.error('余额不足，请充值!')
        } else {
          const data = {
            renter: tenantName.value,
            landlord: landlordName.value,
            landlord_phone: landlordPhoneNumber.value,
            renter_phone: userInfo.phone_number,
            house: props.houseInfo.house_number,
            price: price.value,
            position: position.value,
            regulations: regulations.value,
            rental_duration: leaseTerm.value,
            deposit: deposit.value,
            payment_method: paymentMethod.value,
          }
          const orderResult = await setOrder(data)
          if (orderResult === 200) {
            const payResult = await payDeposit(userId, deposit.value, houseId.value)
            if (payResult.code === 200) {
              ElMessage.success(`签署成功！账号余额为💰${payResult.balance}`)
              emit('signed')
            }
          }
        }
      } catch (error) {
        console.error('签署失败:', error)
        ElMessage.error('签署失败，请稍后重试')
      } finally {
        emit('close')
      }
    })
    .catch(() => {
      submitting.value = false
    })
}

watch(
  () => props.modelValue,
  async () => {
    const data = await getLandlord()
    landlordName.value = data.landlord_name
    landlordPhoneNumber.value = data.landlord_phone_number
    agreed.value = false
    submitting.value = false
    tenantName.value = userInfo.username
  },
)

onMounted(async () => {
  const data = await getLandlord()
  landlordName.value = data.landlord_name
  landlordPhoneNumber.value = data.landlord_phone_number
  agreed.value = false
  submitting.value = false
  tenantName.value = userInfo.username
})
</script>

<style scoped>
.contract-info h3 {
  color: #333;
  margin-bottom: 15px;
}

.contract-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.contract-preview {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.contract-preview h4 {
  margin-top: 0;
  color: #333;
}

.preview-content p {
  margin: 8px 0;
  font-size: 13px;
  color: #555;
}

.signature-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  text-align: center;
}

.agreement-checkbox {
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
