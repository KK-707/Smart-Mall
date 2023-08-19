import { getInfo, setInfo } from '@/utils/storage'

/* 将登录权证信息存入 vuex */
export default {
  namespaced: true,
  state() {
    return {
      userInfo: getInfo()
    }
  },
  mutations: {
    setUserInfo(state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }
  },
  actions: {
    logout(context) {
      // context，它表示 Vuex store 的上下文对象
      // 个人信息重置 自己模块调用 mutation 不开启全局
      context.commit('setUserInfo', {})
      // 购物车信息重置 跨模块调用 mutation 用 { root: true } 开启全局
      context.commit('cart/setCartList', [], { root: true })
    }
  }
}
