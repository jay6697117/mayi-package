<template>
	<view class="grace-body">
		<view class="grace-margin-top">
			<graceNavBar :items="tabs" lineHeight="80rpx" :isCenter="true" :currentIndex="currentIndex" :size="0" padding="20rpx"
				activeLineBg="#3688FF" textAlign="center" activeColor="#3688FF" activeLineWidth="100%" activeLineHeight="2rpx"
				:margin="10" @change="navChange"></graceNavBar>
		</view>
		<swiper class="content grace-margin-top" :current="currentIndex" @change="swiperChange">
			<swiper-item class="content" v-for="(item, index) in tabs" :key="index">
				<scroll-view scroll-y class="content" @scrolltolower="load">
					<order-item
						v-for="item in curOrders"
						:key="item.id"
						:id="item.id"
						:no="item.no"
						:order_no="item.order_no"
						:totalPrice="item.totalPrice"
						:time="item.time"
						:status="item.status"
						:customerName="item.customer.name"
						class="grace-margin-top">
					</order-item>
					<graceEmpty v-if="curOrders.length === 0">
						<view slot="img" class="empty-view">
							<!-- 请根据您的项目要求制作并更换为空图片 -->
							<image class="empty-img" mode="widthFix" src="https://staticimgs.oss-cn-beijing.aliyuncs.com/empty.png"></image>
						</view>
						<text slot="text" class="grace-text-small grace-gray">抱歉，暂无订单数据</text>
					</graceEmpty>
				</scroll-view>
			</swiper-item>
		</swiper>
		<button type="primary" class="grace-button grace-margin-top" @click="toGoods">
			我要下单
		</button>
	</view>
</template>

<script>
	import { mapActions, mapState } from 'vuex'
	import OrderItemV2 from "./components/order-item-v2.vue"
	import graceEmpty from "../../graceUI/components/graceEmptyNew.vue";
	
	export default {
		components: { OrderItemV2,graceEmpty },
		data() {
			return {
				currentIndex: 0,
				tabs: ["进行中的订单", "已完成的订单"],
				cates: ["已接单", "生产中", "生产完成", "发货", "运输中"],
				current: 0,
        page: 1,
				orderStatus: 'proceed'
			};
		},
		computed: {
			...mapState({
				proceed: state => state.order.orders.proceed,
				completed: state => state.order.orders.completed
			}),
			curOrders () {
				return this.currentIndex === 0 ? this.proceed : this.completed
			}
		},
		methods: {
			...mapActions(['fetchOrder', 'refreshOrder']),
			change: function(e) {
				this.current = e;
			},
			navChange: function(e) {
				this.currentIndex = e;
				this.orderStatus = e ? 'completed' : 'proceed'
				this.refreshOrder({ order_status: this.orderStatus })
			},
			swiperChange: function(e) {
				var index = e.detail.current;
				this.currentIndex = index;
			},
			load () {
        this.fetchOrder({ order_status: this.orderStatus })
      },
			toGoods () {
				uni.navigateTo({
					url: "/pages/order/goods"
				})
			}
		}
	};
</script>
<style>
	.grace-body {
		flex: 1;
	}
	/* 局部选项卡应该固定高度 可以避免选项切换引起的页面抖动 */
	.content {
		width: 100%;
		/* height: calc(100% - 140rpx); */
		height: 800rpx;
		background-color: #f5f6f8;
		text-align: center;
	}
	.empty-view{width:280rpx; height:280rpx; border-radius:280rpx; background-color:#F6F7F8; margin-top:300rpx;}
	.empty-img{width:220rpx; height:200rpx; margin:40rpx; border-radius:200rpx;}
	.grace-text-small{margin-top:10px;}
</style>
