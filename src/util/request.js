import axios from 'axios'
//本地局域网或本机访问
// const getCurrentBaseUrl = () => {
//   const backendHost = window.location.hostname // 当前页面的主机名,如果是本地主机访问则是localhost，如果是其他设备通过局域网访问，则获取局域网的IP
//   const backendPort = '8000' // 后端服务端口

//   return `http://${backendHost}:${backendPort}/`
// }

// let baseUrl = getCurrentBaseUrl()
// const httpService = axios.create({
//   baseURL: baseUrl,
//   timeout: 3000,
// })

// // ngrok 访问
// // 直接修改为你的 ngrok 地址
let baseUrl = 'https://jolliness-subscript-trustable.ngrok-free.dev/'

const httpService = axios.create({
  baseURL: baseUrl,
  timeout: 20000,
})
//请求拦截器
httpService.interceptors.request.use(
  function (config) {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)
//响应拦截器
httpService.interceptors.response.use(
  function (response) {
    // 检查响应头中是否有新的 token
    const newToken = response.headers['authorization']
    if (newToken) {
      sessionStorage.setItem('token', newToken)
      console.log('Token已通过响应头自动更新')
    }

    return response
  },
  function (error) {
    return Promise.reject(error)
  },
)

export function get(url, params = {}) {
  return httpService({
    url: url,
    method: 'get',
    params: params,
  })
}

export function post(url, params = {}) {
  return httpService({
    url: url,
    method: 'post',
    data: params,
  })
}

export function getServerUrl() {
  return baseUrl
}

export default {
  post,
  getServerUrl,
  get,
}
