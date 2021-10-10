<template>
	<scroll-view scroll-y class="grace-body" @scrolltolower="load">
		<order-item
			v-for="item in ordering"
			:key="item.no"
			:id="item.id"
			:no="item.no"
			:order_no="item.order_no"
			:totalPrice="item.totalPrice"
			:time="item.time"
			:status="item.status"
			:customerName="item.customer? item.customer.name : ''"
			class="grace-margin-top">
		</order-item>
		<graceEmpty v-if="ordering.length === 0">
			<view slot="img" class="empty-view">
				<!-- 请根据您的项目要求制作并更换为空图片 -->
				<image class="empty-img" mode="widthFix" src="https://staticimgs.oss-cn-beijing.aliyuncs.com/empty.png"></image>
			</view>
			<text slot="text" class="grace-text-small grace-gray">抱歉，暂无订单数据</text>
		</graceEmpty>
	</scroll-view>
</template>
<script>
	import { mapActions, mapState } from "vuex"
	import graceEmpty from "../../graceUI/components/graceEmptyNew.vue";
	
	export default {
		components:{ graceEmpty },
		data() {
			return {
				page: 1
			};
		},
		computed: {
			...mapState({
				ordering: state => state.order.orders.all
			})
		},
		methods: {
			...mapActions(['fetchOrder', 'refreshOrder']),
			load () {
				this.fetchOrder({ order_status: 'all' })
			}
		}
	};
</script>
<style>
	.order-card {
		background-color: #fff;
		box-sizing: border-box;
	}
	.empty-view{width:280rpx; height:280rpx; border-radius:280rpx; background-color:#F6F7F8; margin-top:300rpx;}
	.empty-img{width:220rpx; height:200rpx; margin:40rpx; border-radius:200rpx;}
	.grace-text-small{margin-top:10px;}
</style>
