<template>
	<gracePage :customHeader="false">
		<!-- 页面主体 -->
		<view class="grace-body" slot="gBody">
			<view class="grace-list-items grace-bg-white grace-margin-top" @click="toAddr">
				<view class="grace-list-body">
					<view class="grace-list-title">
						<text class="grace-list-title-text">{{ defaultAddress ? defaultAddress.receiver : '暂无'  }}</text>
						<text class="grace-list-title-desc">{{ defaultAddress ? defaultAddress.mobile : '暂无' }}</text>
					</view>
					<view class="grace-list-body-desc">{{ defaultAddress ? (defaultAddress.city + defaultAddress.address) : '请添加地址' }}</view>
				</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
			<view v-for="good in goods" :key="good.id" class="grace-flex grace-margin-top grace-bg-white" style="padding: 20rpx;">
				<image style="width: 160rpx;height:160rpx;margin-right: 20rpx;" :src="good.avatar"></image>
				<div class="grace-flex-v1">
					<view class="grace-bold">{{good.name}}({{good.spec}})</view>
					<view>材质：{{good.desc}}</view>
					<view class="grace-margin-top">x{{good.num}}</view>
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
					<text class="grace-h3">{{selectedGoodTotalPrice | formatPrice}}</text>
				</text>
			</view>
			<view style="padding:22rpx 0;">
				<button class="grace-button" style="line-height:80rpx;" formType="submit" type="primary" @click="onSubmit">提交订单</button>
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
	import graceDialog from '../../graceUI/components/graceDialog.vue';
    import { mapGetters, mapState, mapActions } from 'vuex'
	export default {
		data() {
			return {
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
			...mapGetters(['selectAddress', 'selectedGoodTotalPrice']),
			...mapState({
				goods: state => state.goods.selectedGoods
			}),
			defaultAddress() { // 如果有选中的地址 使用选中的 如果没有使用默认
				let defaultAddress = this.$store.getters.defaultAddress
				if(this.selectAddress) {
					return this.selectAddress
				} else if(defaultAddress){
					return defaultAddress
				} else {
					return null
				}
			}
			// selectAddress() {
				 // let addressRow = uni.getStorageSync('selectAddress')
				 // if (addressRow){
					//  return addressRow
				 // } else {
					//  return null
				 // }				 
			// }
		},
		methods: {
			...mapActions(['createOrder']),
			change1 : function(val){this.order_type = val;},
			toAddr () {
				// uni.navigateTo({
				// 	url: '/pages/address/address'
				// })
				// 商品详情 选择收货地址
				uni.navigateTo({
					url:'/pages/address/address?type=select'
				})
			},
			confirm1:function (res) {
				this.delivery_date = res[0]+'-'+res[1]+'-'+res[2];
			},
			clearInput: function() {
				this.name2 = "";
			},
			bindPickerChange: function(e) {
				console.log(e);
				this.genderIndex = e.detail.value;
			},
			showPwd: function() {
				this.pwdType = this.pwdType == "password" ? "text" : "password";
			},
			onSubmit () {
				if (!this.defaultAddress) {
					uni.showToast({ title: '请添加地址', icon : "none"});
					return
				}
				this.showCommitDialog = true
			},
			confirmToCommitOrder () {
				this.showCommitDialog = false
				const delivery_date = /^[\d\-\:\s]+$/.test(this.delivery_date) ? new Date(this.delivery_date).getTime() / 1000 : null
				this.createOrder({
					customer_id: +this.$store.state.user.userInfo.id,
					delivery_declare: this.delivery_declare,
					order_type: +this.order_type,
					delivery_date
				}).then(() => {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				})
			},
			cancleDialog () {
				this.showCommitDialog = false
			}
		},
		beforeMount() {
			//  http.post(
			// 	'apiv1/user/signin/mobile',
			// 	{
			// 	  "client_type": "mobile",
			// 	  "code": "887766",
			// 	  "mobile": "15838050281"
			// 	},  // 此处 {} 代表不设置 header 数据
			// 	function(res){
			// 		console.log('login=',res);
			// 		http.get(
			// 			'apiv1/user/info',
			// 			{'id':res.data.id}
			// 		).then(res => {
			// 			console.log('userInfo = ', res)
			// 		})
			// 	}
			// );

			// this.$store.dispatch('login', {
			// 	"client_type": "mobile",
			// 	"code": "887766",
			// 	"mobile": "15838050281"
			// }).then(res => {
			// 	console.log('dispatch Login = ', res)
			// 	this.$store.dispatch('getUserInfo').then(resUserInfo => {
			// 		console.log('userinfo2 =', resUserInfo)
			// 	})
			// })

			this.$store.dispatch('getAddressList')



		}
	};
</script>
<style lang="scss">
	.order-card {
		background-color: #fff;
		box-sizing: border-box;
	}
</style>
