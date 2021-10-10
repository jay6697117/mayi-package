<template>
	<gracePage :customHeader="false">
		<!-- 页面主体 -->
		<view class="grace-body" slot="gBody">
			<view class="grace-list-items grace-bg-white grace-margin-top">
				<view class="grace-list-body">
					<view class="grace-list-title">
						<text class="grace-list-title-text">{{ curOrderAddress.receiver  }}</text>
						<text class="grace-list-title-desc">{{ curOrderAddress.mobile }}</text>
					</view>
					<view class="grace-list-body-desc">{{ curOrderAddress.city + curOrderAddress.address }}</view>
				</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
			<view v-for="good in curOrderGoods" :key="good.id" class="grace-flex grace-margin-top grace-bg-white" style="padding: 20rpx;">
				<image style="width: 160rpx;height:160rpx;margin-right: 20rpx;" :src="good.avatar"></image>
				<div class="grace-flex-v1">
					<view class="grace-bold">{{good.name}}({{good.spec}})</view>
					<view>材质：{{good.memo}}</view>
					<view class="grace-margin-top">x{{good.goods_count}}</view>
				</div>
				<view>￥{{good.sale_price | formatPrice}}</view>
			</view>
			<view class="grace-list grace-bg-white grace-margin-top">
				<view class="grace-list-items">
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">订单类型：</text>
							<text class="grace-list-title-desc" style="marginRight: 12px;">{{order.order_type | formatOrderType}}</text>
						</view>
					</view>
				</view>
				<view class="grace-list-items" v-if="order.order_type == 1">
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">配送时间</text>
							<text v-if="order.delivery_date" class="grace-list-title-desc" style="marginRight: 12px;">{{order.delivery_date | formatDateSecond}}</text>
							<text v-else class="grace-list-title-desc" style="marginRight: 12px;">无</text>

						</view>
					</view>
				</view>
				<view class="grace-list-items" v-if="order.biz_user_info">
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">开单人员</text>
							<text class="grace-list-title-desc" style="marginRight: 12px;">{{order.biz_user_info.username}}（{{order.biz_user_info.mobile}}）</text>
						</view>
					</view>
				</view>
				<view class="grace-list-items" v-if="order.manager_user_info">
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">销售经理</text>
							<text class="grace-list-title-desc" style="marginRight: 12px;">{{order.manager_user_info.username}}（{{order.manager_user_info.mobile}}）</text>
						</view>
					</view>
				</view>
				<view class="grace-list-items" v-if="order.assistant_user_info">
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">销售助理</text>
							<text class="grace-list-title-desc" style="marginRight: 12px;">{{order.assistant_user_info.username}}（{{order.assistant_user_info.mobile}}）</text>
						</view>
					</view>
				</view>
				<view class="grace-list-items">
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">备注</text>
							<text class="grace-list-title-desc" style="marginRight: 12px;">{{order.delivery_declare}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="grace-bold" style="text-align: right;margin: 25rpx 0">
				合计 <text class="grace-red grace-margin">￥
					<text class="grace-h3">{{curOrderTotalPrice | formatPrice}}</text>
				</text>
			</view>
			<template v-if="role === 'supplier'">
				<view v-if="curOrderStatus === 3" class="grace-flex grace-margin-top">
					<view class="grace-flex1">
						<button
							class="grace-button"
							style="line-height:80rpx;backgroundColor: #fff;"
							formType="submit"
							type="default"
							@click="onSubmit(-2)"
						>拒单</button>
					</view>
					<view style="width: 32rpx;"></view>
					<view class="grace-flex1">
						<button
							class="grace-button"
							style="line-height:80rpx;"
							formType="submit"
							type="primary"
							@click="onSubmit(4)"
						>接单</button>
					</view>
				</view>
				<view v-if="curOrderStatus === 4" class="grace-margin-top">
					<button
							class="grace-button"
							style="line-height:80rpx;"
							formType="submit"
							type="primary"
							@click="onSubmit(5)"
						>生产</button>
				</view>
				<view v-if="curOrderStatus === 5" class="grace-margin-top">
					<button
							class="grace-button"
							style="line-height:80rpx;"
							formType="submit"
							type="primary"
							@click="onSubmit(6)"
						>生成完成</button>
				</view>
				<view v-if="curOrderStatus === 6" class="grace-margin-top">
					<button
							class="grace-button"
							style="line-height:80rpx;"
							formType="submit"
							type="primary"
							@click="onSubmit(7)"
						>发货</button>
				</view>
				<view v-if="curOrderStatus === 7" class="grace-margin-top">
					<button
							class="grace-button"
							style="line-height:80rpx;"
							formType="submit"
							type="primary"
							@click="onSubmit(8)"
						>派送</button>
				</view>
			</template>
			<template v-if="role === 'customer'">
				<view v-if="curOrderStatus >= 1 && curOrderStatus <= 7" class="grace-margin-top">
					<button
							class="grace-button"
							style="line-height:80rpx;"
							formType="submit"
							type="primary"
							@click="onRemindOrder()"
						>催单</button>
				</view>
				<view v-if="curOrderStatus === 8" class="grace-margin-top">
					<button
							class="grace-button"
							style="line-height:80rpx;"
							formType="submit"
							type="primary"
							@click="onSubmit(9)"
						>签收</button>
				</view>
				<view v-if="curOrderStatus === 9" class="grace-margin-top">
					<button
							class="grace-button"
							style="line-height:80rpx;"
							formType="submit"
							type="primary"
							@click="onSubmit(10)"
						>完成</button>
				</view>
			</template>
			<template v-if="role ==='seller'">
				<view v-if="curOrderStatus === 1" class="grace-flex grace-margin-top">
					<view class="grace-flex1">
						<button
							class="grace-button"
							style="line-height:80rpx;backgroundColor: #fff;"
							formType="submit"
							type="default"
							@click="onCheck(-1)"
						>拒单</button>
					</view>
					<view style="width: 32rpx;"></view>
					<view class="grace-flex1">
						<button
							class="grace-button"
							style="line-height:80rpx;"
							formType="submit"
							type="primary"
							@click="onCheck(3)"
						>通过</button>
					</view>
				</view>
				<view v-if="curOrderStatus >= 3 && curOrderStatus <= 7" class="grace-margin-top">
					<button
							class="grace-button"
							style="line-height:80rpx;"
							formType="submit"
							type="primary"
							@click="onRemindOrder()"
						>催单</button>
				</view>
			</template>
			<view class="order-track">
				<view class="grace-margin-top">
					<text class="grace-title">订单状态跟踪</text>
				</view>
				<uni-steps :options="orderTrackList" active-color="#007AFF" :active="0" direction="column" />
			</view>
		</view>
	</gracePage>
</template>
<script>
	import http from '@/utils/http.js'
    import { mapState, mapGetters, mapActions } from 'vuex'
	import { orderTrackData } from '@/http/order'
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	// var graceJS = require("../../Grace.JS/grace.js");

	export default {
		filters: {
			formatOrderType (type) {
				return type == 1 ? '配送' : '库存'
			}
		},
		data() {
			return {
				id: '',
				no: '',
				orderTrackList: []
			};
		},
		computed: {
			...mapState({
				order: state => state.order.curOrder
			}),
			...mapGetters(['curOrderAddress', 'curOrderGoods', 'curOrderTotalPrice', 'curOrderStatus', 'role'])
		},
		methods: {
			...mapActions(['getOrderDetail', 'changeOrderStatus', 'checkOrderStatus', 'reminderOrder']),
			onSubmit (status) {
				this.changeOrderStatus({ id: this.id, no: this.no, status }).then(() => {
					uni.navigateBack()
				})
			},
			onCheck (status) {
				this.checkOrderStatus({ id: this.id, no: this.no, status }).then(() => {
					uni.navigateBack()
				})
			},
			onRemindOrder () {
				this.reminderOrder({id: this.id }).then(() => {
					uni.showToast({
						title: '您已催单！',
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack()
					},1000); 
				})
			},
			toDate : function(timeStamp, returnType){
					timeStamp = parseInt(timeStamp);
					var date = new Date();
					if(timeStamp < 90000000000 ){
						date.setTime(timeStamp * 1000);
					}else{
						date.setTime(timeStamp );
					}
					var y = date.getFullYear();
					var m = date.getMonth() + 1;
					m = m < 10 ? ('0' + m) : m;
					var d = date.getDate();
					d = d < 10 ? ('0' + d) : d;
					var h = date.getHours();
					h = h < 10 ? ('0' + h) : h;
					var minute = date.getMinutes();
					var second = date.getSeconds();
					minute = minute < 10 ? ('0' + minute) : minute;
					second = second < 10 ? ('0' + second) : second;
					if(returnType == 'str'){return y + '-' + m + '-' + d + ' '+ h +':' + minute;}
					return [y, m, d, h, minute, second];
				},
		},
		onLoad(params) {
			this.id = params.id
			this.no = params.no
			this.getOrderDetail(params)
			orderTrackData({id: this.id}).then(data => {
				if(data && data.items) {
					this.orderTrackList = data.items.map(item => {
						item.title = item.content
						// item.desc = item.track_time
						item.desc = this.toDate(item.track_time, 'str')
						return item
					})
				}
			})
		}
	};
</script>
<style lang="scss">
	.order-card {
		background-color: #fff;
		box-sizing: border-box;
	}
	.order-track {
		background-color: #fff;
		padding: 25rpx;
		margin-top:25rpx;
	}
	.grace-margin-top {
		margin-top: 0rpx !important;
	}
</style>
