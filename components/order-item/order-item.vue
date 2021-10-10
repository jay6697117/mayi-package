<template>
<div class="order-item grace-border grace-margin-top">	
		<view class="order-card" @click="toDetail">
			<div class="grace-flex-v1">	
				<view v-if="role.indexOf('seller') > -1">
					<text class="grace-bold">客户名称</text>：<text>{{customerName}}</text>
				</view>	
				<view>
					<text class="grace-bold">订单号</text>：<text>{{order_no}}</text>
				</view>
				<view>
					<text class="grace-bold">订单金额</text>：<text>￥{{totalPrice | formatPrice}}</text>
				</view>
				<view>
					<text class="grace-bold">订单接单时间</text>：<text>{{time | formatTime2}}</text>
				</view>
			</div>
			<div v-if="status" class="status">
				<div v-if="role === 'customer'">{{status | formatCustomerOrderStatus}}</div>
				<div v-else>{{status | formatOrderStatus}}</div>
			</div>
			<div v-if="percent" class="status grace-red">
				+{{( totalPrice * percent / 100) | formatPrice}}
			</div>
		</view>
		<view class="order-handle" v-if="status === 10 && role === 'customer'">
			<!-- <button type="default" class="grace-button" size="mini">联系售后</button> -->
			<button type="default" class="grace-button" size="mini" @click.stop="toRecheckout">再来一单</button>
			<button type="default" class="grace-button" size="mini" @click.stop="toInvoice">我要开票</button>
		</view>
	</div>
</template>

<script>
	import { mapGetters } from "vuex"
	export default {
		props: {
			id: [String, Number],
			no: [String, Number],
			order_no: [String, Number],
			totalPrice: [String, Number],
			time: [String, Number],
			status: [String, Number],
			percent: [String, Number],
			customerName: String
		},
		computed: {
			...mapGetters(['role'])
		},
		methods: {
			toRecheckout () {
				uni.navigateTo({
					url: `/pages/order/recheckout?id=${this.id}&no=${this.no}`
				})
			},
			toDetail () {
				uni.navigateTo({
					url: `/pages/order/detail?id=${this.id}&no=${this.no}`
				})
			},
			toInvoice () {
				uni.navigateTo({
					url: `/pages/invoice/invoice?id=${this.id}`
				})
			}
		}
	}
</script>

<style>
	.order-item {
		display: flex;
		flex-direction: column;
		border-radius: 24rpx;
		overflow: hidden;
	}
	.order-handle {
		background-color: #ccc;
		text-align: right;
		padding: 12rpx 24rpx;
	}
	.order-handle button {
		margin-left: 8px;
	}
	.order-card {
		background-color: #fff;
		padding: 24rpx;
		text-align: left;
		display: flex;
		align-items: center;
	}
	.status {
		font-size: 40rpx;
		font-weight: bold;
	}
</style>
