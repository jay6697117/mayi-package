import { createOrder, queryOrderList, getOrderById, updateOrderStatus, checkOrderStatus } from '@/http/order'
import { orderStatus } from '@/utils/orderStatus'
export default {
  state: {
    orders: {
      all: [],
      created: [],
      proceed: [],
      completed: [],
      ordering: [],
      ordered: [],
      making: [],
      maked: [],
      shipment: [],
      delivering: []
    },
    page: 1,
    curOrder: {}
  },
  mutations: {
    refreshOrders (state, { order_status, list }) {
      state.orders[order_status] = list
    },
    fetchOrders (state, { order_status, list }) {
      state.orders[order_status] = state.orders[order_status].concat(list)
    },
    setCurOrder(state, data) {
      state.curOrder = data
    },
    setPage(state, data) {
      state.page = data
    }
  },
  actions: {
	reminderOrder({ rootState }, { id}) {
		return this.http.get(`apiv1/order/reminder_order/${id}`).then(res => {
					return res
				})
	},
    changeOrderStatus({ rootState }, { id, status: order_status, no }) {
      return updateOrderStatus({
        user_type: rootState.user.userInfo.signin_user_type,
        order_id: +id,
        split_order_id: +no,
        order_status
      })
    },
    checkOrderStatus({ rootState }, { id, status: order_status, no }) {
      return checkOrderStatus({
        user_type: rootState.user.userInfo.signin_user_type,
        order_id: +id,
        // split_order_id: +no,
        order_status,
        is_auto_split_order: order_status === 3
      })
    },
    getOrderDetail({ commit, rootState }, { id, no }) {
      return getOrderById({
        id, no, user_type: rootState.user.userInfo.signin_user_type
      }).then(data => {
        commit('setCurOrder', data)
		return data
      })
    },
    refreshOrder({ rootGetters, rootState, commit }, { order_status }) {
      commit('setPage', 1)
      console.log('orderstate=',order_status)
      return queryOrderList({
        page: 1,
        order_status: orderStatus[order_status].value,
        user_type: rootState.user.userInfo.signin_user_type,
        user_id: rootState.user.userInfo.id,
      }).then(({ items }) => {
        if (!items) {
			commit('refreshOrders', { order_status, list: [] })
          return Promise.reject()
        }
		commit('setPage', 2)
        commit('refreshOrders', { order_status, list: items })
      })
    },
    fetchOrder({ rootGetters, rootState, commit, state }, { order_status }) {
    return queryOrderList({
        page: state.page,
        order_status: orderStatus[order_status].value,
        user_type: rootState.user.userInfo.signin_user_type,
        user_id: rootState.user.userInfo.id,
    }).then(({ items }) => {
			if (!items) {
				return Promise.reject()
      }
      commit('setPage', state.page + 1)
      commit('fetchOrders', { order_status, list: items })
    })
    },
    createOrder({ rootGetters, rootState }, { customer_id, delivery_declare, order_type, delivery_date }) {
    return createOrder({
        customer_id: customer_id,
        details: rootState.goods.selectedGoods.map(({ id, num, sale_price, memo }) => ({
          goods_id: id,
          goods_count: num,
          goods_money: num * sale_price,
          goods_price: sale_price,
          memo
        })),
        shipping_info_id: rootGetters.selectAddress ? rootGetters.selectAddress.id :rootGetters.defaultAddress.id,
        total_price: rootGetters.selectedGoodTotalPrice,
        user_type: rootState.user.userInfo.signin_user_type,
		delivery_declare, order_type, delivery_date
    })
    }
  },
  getters: {
    curOrderStatus (state) {
      return +state.curOrder.status
    },
    curOrderAddress (state) {
      return state.curOrder.shipping_info || {}
    },
    curOrderGoods (state) {
		if (!state.curOrder.goods) {
			return []
		}
      return state.curOrder.goods.map((good) => {
        return { ...good, avatar: good.image_uris.length > 0 ? good.image_uris[0]: '' }
      })
    },
    curOrderTotalPrice (state) {
      return state.curOrder.total_price
    },
    curSplitOrderId (state) {
      return +state.curOrder.split_orders[0].id
    }
  },
}