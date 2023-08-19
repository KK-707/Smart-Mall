import { getCartList, changeCount, delSelect } from '@/api/cart'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state() {
    return {
      cartList: []
    }
  },
  mutations: {
    setCartList(state, newList) {
      state.cartList = newList
    },
    toggleCheck(state, goodsId) {
      // 让点击提供的id的isChecked值取反
      const goods = state.cartList.find((item) => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    toggleAllCheck(state, flag) {
      // flag由方法通过commit传递
      // 让所有的小选框同步设置
      state.cartList.forEach((item) => {
        item.isChecked = flag
      })
    },
    changeCount(state, { goodsId, value }) {
      const obj = state.cartList.find((item) => item.goods_id === goodsId)
      obj.goods_num = value
    }
  },
  actions: {
    async getCartAction(context) {
      const { data } = await getCartList()
      // 后台返回的数据中，不包含复选框的选中状态，为了实现将来的功能
      // 需要手动维护数据，给每一项，添加一个isChecked状态（标记当前商品是否选中）
      data.list.forEach((item) => {
        item.isChecked = true
      })
      context.commit('setCartList', data.list)
    },
    async changeCountAction(context, obj) {
      const { goodsId, value, skuId } = obj
      // 先本地修改
      context.commit('changeCount', {
        goodsId,
        value
      })
      // 再同步到后台
      await changeCount(goodsId, value, skuId)
    },
    // 删除购物车数据
    async delSelect(context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map((item) => item.id)
      await delSelect(cartIds)
      Toast('删除成功')
      //   this.$toast('删除成功') // 不能这么使用，因为this指向了store实例而不是vue组件实例

      // 重新拉取最新的购物车数据 (重新渲染)
      context.dispatch('getCartAction')
    }
  },
  getters: {
    // 求所有商品累加总数
    cartTotal(state) {
      return state.cartList.reduce(
        (sum, item, index) => sum + item.goods_num,
        0
      )
    },
    // 选中的商品项
    selCartList(state) {
      return state.cartList.filter((item) => item.isChecked)
    },
    // 选中的总数，还可以接收getters
    selCount(state, getters) {
      return getters.selCartList.reduce(
        (sum, item, index) => sum + item.goods_num,
        0
      )
    },
    // 选中的总价
    selPrice(state, getters) {
      return getters.selCartList
        .reduce((sum, item, index) => {
          return sum + item.goods_num * item.goods.goods_price_min
        }, 0)
        .toFixed(2)
    },
    // 是否全选
    isAllChecked(state) {
      // 检查 state.cartList 数组中的每个元素的 isChecked 属性是否都为 true
      return state.cartList.every((item) => item.isChecked)
    }
  }
}
