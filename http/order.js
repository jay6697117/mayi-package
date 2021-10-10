import { createHttp } from "@/utils/http";

// const http = createHttp('http://api.myxpack.com/apiv1/')
import { baseURL } from '@/utils/ipConfig.js'
const http = createHttp(baseURL + 'apiv1/')

export const queryProfitList = (params) => {
  params = {
    limit: 10, ...params
  }
  return http.get('order/profit_list', params).then(res => {
    return res.data
  })
}

export const queryOrderList = (params) => {
  params = {
    limit: 10, ...params
  }
  if (params.user_type === 'supplier') {
    return http.get('order/supplier_order_list', params).then(res => {
      if (res.data.items) {
        const items = res.data.items.map(({ order_no, split_order_id, created_at, sell_order_id, goods_money, status, customer }) => {
          return { order_no, no: split_order_id, id: sell_order_id, time: created_at, totalPrice: goods_money, status, customer }
        })
        return { ...res.data, items }
      }
      return res.data
    })
  }
  return http.get('order/order_list', params).then(res => {
    if (res.data.items) {
      const items = res.data.items.map(({ order_no, id, total_price, status, updated_at, customer }) => {
        return { order_no, no: id, id, time: updated_at, totalPrice: total_price, status, customer }
      })
      return { ...res.data, items }
    }
    return res.data
  })
}

export const createOrder = (params) => {
	return http.post('order/create', params).then(res => {
		return res.data
	})
}

export const getOrderById = ({ id, user_type, no }) => {
	return http.get(`order/order_info/${id}`).then(res => {
    const { detail_orders, ...order_info } = res.data
    if (user_type === 'supplier') {
      let goods = null
      let split_order_id = no
      let total_price = 0
      let status = 0
      detail_orders.forEach(item => {
        item.split_orders.forEach(subItem => {
          let order = subItem
          if (+order.id === +no) {
            goods = [{ ...order.goods, goods_count: order.goods_count }]
            total_price = order.goods_money
            status = order.status
          }
        })
      })
      return { ...order_info, split_order_id, goods, total_price, status }
    }
    const goods = detail_orders.map(({ goods, goods_count }) => {
      return { ...goods, goods_count }
    })
    return { ...order_info, goods }
	})
}

export const updateOrderStatus = (params) => {
	return http.post(`order/update_order_status`, params)
}
// 操作 审核已创建订单 拒绝已创建订单
export const checkOrderStatus = (params) => {
  return http.post(`order/auto_review_order`, params)
}
export const fetchProfit = (params) => {
	return http.get('order/profit_list', params).then((res) => {
		return res.data
	})
}

export const orderTrackData = (params) => {
	return http.get(`order/order_track_data/${params.id}`).then((res) => {
		return res.data
	})
}