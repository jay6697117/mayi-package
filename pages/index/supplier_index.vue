<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body grace-flex-v1">
			<view class="grace-margin-top">
				<graceNavBar :items="tabs" lineHeight="80rpx" :isCenter="true" :currentIndex="currentIndex" :size="0" padding="20rpx"
				 activeLineBg="#3688FF" textAlign="center" activeColor="#3688FF" activeLineWidth="100%" activeLineHeight="2rpx"
				 :margin="10" @change="navChange"></graceNavBar>
			</view>
			<swiper class="content grace-margin-top" style="height: 600px;" :current="currentIndex" @change="swiperChange">
				<swiper-item class="content" v-for="(itemTab, index0) in tabs" :key="index0">
					<scroll-view v-if="currentIndex === 1" scroll-x>
						
					<graceSegmentedControl :items="status.map(({ label }) => label)" :current="current" @change="change"></graceSegmentedControl>
					</scroll-view>
					<scroll-view scroll-y class="content" @scrolltolower="load">
						<order-item
							v-for="(item, index) in curOrders"
							:key="item.no + index"
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
		</view>
	</gracePage>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex';
	import OrderItemV2 from "./components/order-item-v2.vue"
	import graceEmpty from "../../graceUI/components/graceEmptyNew.vue";
	
	export default {
		components: { OrderItemV2,graceEmpty },
		data() {
			return {
				currentIndex: 0,
				tabs: ["待接单的订单", "进行中的订单"],
				current: 0,
				orderStatus: 'ordering'
			};
		},
		computed: {
			...mapGetters(['role']),
			...mapState({
				orders: state => state.order.orders
			}),
			curOrders () {
				return this.orders[this.orderStatus]
			},
			status () {
				return [{
						label: '已接单', value: 'ordered'
					}, {
						label: '生产中', value: 'making'
					}, {
						label: '生产完成', value: 'maked'
					}, {
						label: '发货', value: 'shipment'
					}, {
						label: '运输中', value: 'delivering'
				}]
			}
		},
		methods: {
			...mapActions(['fetchOrder', 'refreshOrder']),
			change: function(e) {
				this.current = e;
				this.orderStatus = this.status[e].value
				this.refreshOrder({ order_status: this.orderStatus })
			},
			navChange: function(e) {
				this.current = 0
				this.currentIndex = e;
				this.orderStatus = e ? 'ordered' : 'ordering'
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
		},
		onShow () {
			this.refreshOrder({ order_status: this.orderStatus })
			if (this.role.indexOf('seller') > -1 ) {
				uni.setNavigationBarTitle({
					title: '我的客户的订单'
				});
			}
			
		}
	};
</script>
<style>

	/* 局部选项卡应该固定高度 可以避免选项切换引起的页面抖动 */
	.content {
		width: 100%;
		height: calc(100% - 140rpx);
		background-color: #f5f6f8;
		text-align: center;
	}
</style>
