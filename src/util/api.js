import requestUtil from '@/util/request'
import { ElMessage } from 'element-plus'

export const getBalance = async (info) => {
  let result = await requestUtil.post('user/GetBalance', info)
  if (result.data.code == 200) {
    return result.data.balance
  } else {
    ElMessage.error(result.data.errorInfo)
    return null
  }
}
export const adminGetReservationList = async (info) => {
  let result = await requestUtil.post('admin/AdminGetReservationList', info)
  if (result.data.code == 200) {
    return result.data
  } else {
    return null
  }
}
export const adminGetReportedHouse = async (info) => {
  let result = await requestUtil.post('admin/AdminGetReportedHouse', info)
  if (result.data.code == 200) {
    return result.data
  } else {
    return null
  }
}
export const adminSetReportedHouse = async (info) => {
  let result = await requestUtil.post('admin/AdminSetReportedHouse', info)
  if (result.data.code == 200) {
    return result.data
  }
}
export const getOrderList = async (info) => {
  let result = await requestUtil.post('admin/GetOrderList', info)
  if (result.data.code == 200) {
    return result.data
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}
export const auditHouse = async (info) => {
  let result = await requestUtil.post('admin/AuditHouse', info)
  if (result.data.code == 200) {
    return result.data
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}
export const adminGetHouseList = async (info) => {
  let result = await requestUtil.post('admin/AdminGetHouseList', info)
  if (result.data.code == 200) {
    return result.data
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}
export const updateUserStatus = async (info) => {
  let result = await requestUtil.post('admin/UpdateUserStatus', info)
  if (result.data.code == 200) {
    ElMessage.success(result.data.info)
    return result.data
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}
export const getUserList = async (info) => {
  let result = await requestUtil.post('admin/GetUserList', info)
  if (result.data.code == 200) {
    return result.data.data
  } else {
    ElMessage.error(result.data.errorInfo)
    return null
  }
}
export const deleteOrder = async (info) => {
  let result = await requestUtil.post('house/DeleteOrder', info)
  if (result.data.code == 200) {
    ElMessage.success(result.data.info)
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}

export const confirmOrder = async (info) => {
  let result = await requestUtil.post('house/ConfirmOrder', info)
  if (result.data.code == 200) {
    ElMessage.success(result.data.info)
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}

export const cancelOrder = async (info) => {
  let result = await requestUtil.post('house/CancelOrder', info)
  if (result.data.code == 200) {
    ElMessage.success(result.data.info)
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}

export const getOrder = async (info) => {
  let result = await requestUtil.post('house/GetOrder', info)
  if (result.data.code == 200) {
    return result.data.data
  } else {
    ElMessage.error(result.data.errorInfo)
    return null
  }
}
export const setOrder = async (info) => {
  let result = await requestUtil.post('house/SetOrder', info)
  if (result.data.code == 200) {
    null
  } else {
    ElMessage.error(result.data.errorInfo)
  }
  return result.data.code
}
export const getLandlordName = async (info) => {
  let result = await requestUtil.post('house/GetLandlordName', { house_id: info })
  let data = result.data
  if (data.code == 200) {
    return data.data
  } else {
    ElMessage.error(data.errorInfo)
    return null
  }
}

export const delReservation = async (info) => {
  let result = await requestUtil.post('house/DelReservation', info)
  if (result.data.code == 200) {
    ElMessage.success(result.data.info)
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}

export const endReservation = async (info) => {
  let result = await requestUtil.post('house/EndReservation', info)
  if (result.data.code == 200) {
    ElMessage.success(result.data.info)
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}
export const confirmReservation = async (info) => {
  let result = await requestUtil.post('house/ConfirmReservation', info)
  if (result.data.code == 200) {
    ElMessage.success(result.data.info)
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}
export const cancelReservation = async (info) => {
  let result = await requestUtil.post('house/CancelReservation', info)
  if (result.data.code == 200) {
    ElMessage.success(result.data.info)
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}
export const renterGetReservation = async (info) => {
  let result = await requestUtil.post('house/RenterGetReservation', info)
  let data = result.data
  if (data.code == 200) {
    return data.houses_data
  } else {
    ElMessage.error(data.errorInfo)
  }
}

export const landlordGetReservation = async (info) => {
  let result = await requestUtil.post('house/LandlordGetReservation', info)
  let data = result.data
  if (data.code == 200) {
    return data.houses_data
  } else {
    ElMessage.error(data.errorInfo)
  }
}

export const getUserInfo = async (user_name) => {
  let result = await requestUtil.post('user/GetUserInfo', { user_name })
  let data = result.data

  if (data.code == 200) {
    return data.data
  } else if (data.code == 404) {
    console.log(data.errorInfo)
    return null
  } else {
    ElMessage.error(data.errorInfo)
    return null
  }
}
export const deleteImage = async (imgName) => {
  let result = await requestUtil.post('user/DeleteImage', { filename: imgName })
  let data = result.data
  if (data.code == 200) {
    return
  } else {
    console.log(data.errorInfo)
  }
}
export const getReportedHouse = async (id) => {
  let result = await requestUtil.post('house/GetReportedHouse', { reporter_id: id })
  let data = result.data
  return data
}

export const setReportedHouse = async (info) => {
  let result = await requestUtil.post('house/SetReportedHouse', info)
  let data = result.data
  return data
}

export const delReportedHouse = async (info) => {
  let result = await requestUtil.post('house/DelReportedHouse', info)
  let data = result.data
  if (data.code == 200) {
    ElMessage.success(data.info)
  } else {
    ElMessage.error(data.errorInfo)
  }
  return data
}
export const setReservation = async (info) => {
  let result = await requestUtil.post('house/SetReservation', info)
  let data = result.data
  return data
}

export const deleteHouse = async (house) => {
  let result = await requestUtil.post('house/DeleteHouse', house)
  let data = result.data
  if (data.code == 200) {
    ElMessage.success(data.info)
  } else {
    ElMessage.error(data.errorInfo)
  }
}

export const housePublish = async (house) => {
  let result = await requestUtil.post('house/HousePublish', house)
  let data = result.data
  if (data.code == 200) {
    ElMessage.success(data.info)
  } else {
    ElMessage.error(data.errorInfo)
  }
  return data
}

export const houseOffline = async (house) => {
  let result = await requestUtil.post('house/HouseOffline', house)
  let data = result.data
  if (data.code == 200) {
    ElMessage.success(data.info)
  } else {
    ElMessage.error(data.errorInfo)
  }
  return data
}

export const getRenterCollect = async (renter_id) => {
  let result = await requestUtil.post('house/GetRenterCollect', { renter_id: renter_id })
  let data = result.data

  if (data.code == 200) {
    return data.data
  } else {
    ElMessage.error(data.errorInfo)
    return null
  }
}

export const delRenterCollect = async (data) => {
  let result = await requestUtil.post('house/DelRenterCollect', data)
  if (result.data.code == 200) {
    console.log(result.data.info)
    return result.data.code
  } else if (result.data.code == 400) {
    ElMessage.info(result.data.info)
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}

export const setRenterCollect = async (data) => {
  const result = await requestUtil.post('house/SetRenterCollect', data)
  if (result.data.code == 200) {
    ElMessage.success(result.data.info)
  } else if (result.data.code == 400) {
    ElMessage.info(result.data.info)
  } else {
    ElMessage.error(result.data.errorInfo)
  }
}

export const getVacantHouse = async () => {
  try {
    let result = await requestUtil.post('house/GetVacantHouse')
    let data = result.data

    if (data.code == 200) {
      return data.data
    } else if (data.code == 404) {
      console.log(data.errorInfo)
      return null
    } else {
      ElMessage.error(data.errorInfo)
      return null
    }
  } catch (error) {
    console.error('获取租客信息异常:', error)
    return null
  }
}

export const getHouseList = async (id) => {
  let result = await requestUtil.post('user/GetHouseList', { user_id: id })
  let data = result.data

  if (data.code == 200) {
    return data.houseList
  } else {
    ElMessage.error(data.errorInfo)
  }
}

export const payDeposit = async (userId, deposit, houseId) => {
  let result = await requestUtil.post('user/PayDeposit', {
    user_id: userId,
    deposit: deposit,
    house_id: houseId,
  })
  if (result.data.code == 200) {
    null
  } else {
    ElMessage.error(result.data.errorInfo)
  }
  return result.data
}
