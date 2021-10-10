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
			<view class="grace-margin-top grace-bg-white grace-padding">
				<view class="grace-form-item" style="align-items:flex-start;">
					<view class="grace-form-label">类型：</view>
					<view class="grace-form-body">
						<graceSelectTags :items="demo1" type="radio" @change="change1"></graceSelectTags>
					</view>
				</view>
				<view style="padding-bottom: 12px;" v-if="order_type == 1">
					<graceDateTime @confirm="confirm1" :value="delivery_date" :isTime="false">
						<text class="demo grace-border-radius">{{delivery_date}}<text class="grace-icons icon-date icon-left-margin"></text></text>
					</graceDateTime>
				</view>
			</view>
			
			<view class="grace-form-item grace-margin-top grace-bg-white grace-padding">
				<text class="grace-form-label">备注：</text>
				<view class="grace-form-body" style="padding:20rpx 0;">
					<textarea class="grace-textarea" v-model="delivery_declare" row="1" placeholder="订单备注" />
				</view>
			</view>
			<view class="grace-margin-top grace-bold" style="text-align: right;">
				合计 <text class="grace-red grace-margin">￥
					<text class="grace-h3">{{curOrderTotalPrice | formatPrice}}</text>
				</text>
			</view>
			<view class="grace-margin-top">
				<input type="hidden">
				<button
						class="grace-button"
						style="line-height:80rpx;"
						type="primary"
						@click="onSubmit"
					>再来一单</button>
			</view>
			<graceDialog title="提示"  :show="showCommitDialog" :isCloseBtn='false'>
				
					<view class="dialog-content grace-flex-center" slot="content">
						<text >请确认订单无误？</text>
					</view>
					<view slot="btns" class="grace-space-between">
						<text class="grace-dialog-buttons" @tap="cancleDialog">取消</text>
						<text class="grace-dialog-buttons grace-blue" @tap="confirmToCommitOrder">确认</text>
					</view>
				</graceDialog>
		</view>
	</gracePage>
</template>
<script>
	import http from '@/utils/http.js'
	import { formatTime } from '@/utils/filters'
    import { mapState, mapGetters, mapActions } from 'vuex'
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
				order_type: '1',
				delivery_date: '配送时间',
				delivery_declare: '',
				demo1: [
					{ name: '配送', value: '1', checked: true },
					{ name: '库存', value: '2', checked: false }
				],
				showCommitDialog: false
			};
		},
		computed: {
			...mapState({
				order: state => state.order.curOrder
			}),
			...mapGetters(['curOrderAddress', 'curOrderGoods', 'curOrderTotalPrice', 'curOrderStatus', 'role'])
		},
		methods: {
			...mapActions(['getOrderDetail']),
			change1 (){},
			onSubmit (status) {
				this.showCommitDialog = true
			},
			confirm1:function (res) {
				this.delivery_date = res[0]+'-'+res[1]+'-'+res[2];
			},
			confirmToCommitOrder () {
				this.showCommitDialog = false
				const delivery_date = /^[\d\-\:\s]+$/.test(this.delivery_date) ? new Date(this.delivery_date).getTime() / 1000 : null
				this.$http.post('apiv1/order/repeat_create', {
					customer_Id: +this.$store.state.user.userInfo.id,
					delivery_declare: this.delivery_declare,
					delivery_date,
					user_type: this.$store.state.user.userInfo.signin_user_type,
					order_id: +this.id
				}).then(() => {
					// uni.navigateBack()
					uni.reLaunch({
						url: '/pages/index/index'
					})
				})
			},
			cancleDialog () {
				this.showCommitDialog = false
			}
		},
		onLoad(params) {
			this.id = params.id
			this.no = params.no
			this.getOrderDetail(params).then(({ delivery_date, delivery_declare, order_type }) => {
				this.delivery_date = formatTime(delivery_date)
				this.delivery_declare = delivery_declare
				this.order_type = order_type
				this.demo1 = this.demo1.filter(item => {
					item.checked = true
					return item.value == order_type
				})
			})
		}
	};
</script>
<style lang="scss">
	.order-card {
		background-color: #fff;
		box-sizing: border-box;
	}
</style>
