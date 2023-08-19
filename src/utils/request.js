/* 封装axios用于发送请求 */
import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

// 创建一个新的axios实例
// 不会污染原始的axios实例
const request = axios.create({
  baseURL: 'http://cba.itlike.com/public/index.php?s=/api/',
  timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么

    // 开启加载
    Toast.loading({
      message: '请求中...',
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0
    })

    // 只要有token，就在请求时携带，便于请求需要授权的接口
    const token = store.getters.token
    if (token) {
      config.headers['Access-Token'] = token
      config.headers.platform = 'H5'
    }

    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    const res = response.data
    if (res.status !== 200) {
      Toast(res.message)
      return Promise.reject(res.message)
    } else {
      // 清除 loading 中的效果
      Toast.clear()
    }
    // 对响应数据做点什么
    return res
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default request
