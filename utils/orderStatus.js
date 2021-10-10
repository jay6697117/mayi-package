// const (
//  CreateOrderStatus      = 1  // 创建订单
//  ValidOrderStatus       = 2  // 有效订单
//  ReceiveWaitOrderStatus = 3  //待接单
//  ReceiveOrderStatus     = 4  // 接收订单
//  ProductInOrderStatus   = 5  // 生产订单中
//  ProductedOrderStatus   = 6  //订单生产完成
//  DeliverWaitOrderStatus = 7  // 订单生产完成待派送
//  DeliverOrderStatus     = 8  // 派送中
//  SignAcceptOrderStatus  = 9  // 签收订单
//  FinishOrderStatus      = 10 // 完成订单

//  InvalidOrderStatus       = -1 // 无效订单
//  ReceiveRefuseOrderStatus = -2 // 拒绝接单
//  SignRefuseOrderStatus    = -3 // 拒绝签收订单
// )

export const orderStatus = {
	all: {
		value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, -2, -3]
	},
	completed: {
		value: [10, -1, -2, -3]
	},
	proceed: {
		value: [1, 2, 3, 4, 5, 6, 7, 8, 9]
	},
	created: {
		value: [2]
	},
	ordering: {
		value: [3]
	},
	ordered: {
		value: [4]
	},
	making: {
		value: [5]
	},
	maked: {
		value: [6]
	},
	shipment: {
		value: [7]
	},
	delivering: {
		value: [8]
	}
}