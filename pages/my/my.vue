<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body">
			<view class="my-top-card">
				<view class="grace-flex grace-rows grace-flex-vcenter grace-margin-top my-card" @click="headClick">
					<image class="avatar" :src="userInfo.avatar || defaultHeader" mode="aspectFill"></image>
					<div class="top-right">
						<text class="grace-h5">{{ userInfo.name || userInfo.username }}</text>
						<div v-if="userInfo.signin_user_type === 'user'" class="rank-info" @click.stop="rankClick">
							<view class="left-icon-bg">
								<image class="img" src="../../static/img/my/my_rank_icon.png" alt=""></image>
							</view>
							<div class="">当前排名：NO.{{userStatisticsData.income_rank}}</div>
						</div>
					</div>
				</view>
				<view v-if="userInfo.signin_user_type === 'user'" class="my-card-footer grace-border-t">
					<view class="my-card-footer-item grace-border-r">
						<view class="grace-icons grace-blue value-show"> ¥{{ userStatisticsData.yesterday_sales | formatPrice}}</view>
						<view class="grace-icons value-name"> 昨日销售额</view>
					</view>
					<view class="my-card-footer-item grace-border-r">
						<view class="grace-icons grace-blue value-show"> ¥{{userStatisticsData.yesterday_profit | formatPrice}}</view>
						<view class="grace-icons value-name"> 昨日收益</view>
					</view>
					<!-- <view class="my-card-footer-item">
						<view class="grace-icons grace-blue value-show"> ¥{{userStatisticsData.transfer_enable_count | formatPrice}}</view>
						<view class="grace-icons value-name"> 可提现金额</view>
					</view> -->
				</view>
				
			</view>
			
			<!-- <view class="ucenter-line"></view> -->
			<view v-if=" role === 'customer'">
				<view class="my-card-view">
					<view class="my-card-body">
						<view class="my-card-desc">
							<view class="my-card-title">
								<text class="my-card-name">采购数据统计</text>
							</view>
						</view>
					</view>
					<view class="my-card-footer">
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> ¥{{ customerStatisticsData.month_purchase | formatMonthMoneyData}}</view>
							<view class="grace-icons current-value-name"> 本月采购额</view>
						</view>
						<view class="my-card-footer-item">
							<view class="grace-icons grace-blue value-show"> ¥{{customerStatisticsData.year_purchase | formatYearMoneyData}}</view>
							<view class="grace-icons current-value-name"> 年采购额</view>
						</view>
					</view>
				</view>
				<view class="my-card-view">
					<view class="my-card-body">
						<view class="my-card-desc">
							<view class="my-card-title">
								<text class="my-card-name">行为数据统计</text>
							</view>
						</view>
					</view>
					<view class="my-card-footer ">
						<view class="my-card-footer-item ">
							<view class="grace-icons grace-blue value-show">{{ customerStatisticsData.order_count }}</view>
							<view class="grace-icons"> 使用APP下单数</view>
						</view>
						<view class="my-card-footer-item grace-border-l">
							<view class="grace-icons grace-blue value-show"> 提升25% </view>
							<view class="grace-icons"> 采购效率</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else-if="userInfo.signin_user_type === 'user'">
				<view class="my-card-view">
					<view class="my-card-body">
						<view class="">
							<view class="row">
								<view class="cell" @click="gotoColumn(0)">
									<view class="img-bg">
										<image class="img" src="../../static/img/my/my_9_1.png">	
										</image>
									</view>
									<view class="title">
										成交订单数
									</view>
								</view>
								<view class="cell" @click="gotoColumn(1)">
									<view class="img-bg">
										<image class="img" src="../../static/img/my/my_9_2.png">	
										</image>
									</view>
									<view class="title">
										成交客户数
									</view>
								</view>
								<view class="cell" @click="gotoColumn(2)">
									<view class="img-bg">
										<image class="img" src="../../static/img/my/my_9_3.png">	
										</image>
									</view>
									<view class="title">
										成交销售额
									</view>
								</view>
							</view>
							<view class="row" @click="gotoColumn(3)">
								<view class="cell">
									<view class="img-bg">
										<image class="img" src="../../static/img/my/my_9_4.png">	
										</image>
									</view>
									<view class="title">
										收益总额
									</view>
								</view>
								<!-- <view class="cell" @click="gotoColumn(4)">
									<view class="img-bg">
										<image class="img" src="../../static/img/my/my_9_5.png">	
										</image>
									</view>
									<view class="title">
										邀约客户量
									</view>
								</view> -->
							</view>
							
						</view>
						
					</view>
				</view>
				<!-- <view class="my-card-view">
					<view class="my-card-body">
						<view class="my-card-desc">
							<view class="my-card-title">
								<text class="my-card-name">收益数据统计</text>
							</view>
						</view>
					</view>
					
					<view class="my-card-footer">
						<view class="my-card-desc my-card-sub-name">月销售额</view>
					</view>
					<view class="my-card-footer grace-border-b">
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> ¥{{ userStatisticsData.month_sales | formatMonthMoneyData}}</view>
							<view class="grace-icons current-value-name"> 本月</view>
						</view>
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> ¥{{userStatisticsData.month_sales | formatMonthMoneyData(-1)}}</view>
							<view class="grace-icons value-name"> {{ new Date() | formatMonth(-1) }}</view>
						</view>
						<view class="my-card-footer-item">
							<view class="grace-icons grace-blue value-show"> ¥{{userStatisticsData.month_sales | formatMonthMoneyData(-2)}}</view>
							<view class="grace-icons value-name"> {{ new Date() | formatMonth(-2) }} </view>
						</view>
					</view>
					<view class="my-card-footer">
						<view class="my-card-desc my-card-sub-name">月收益</view>
					</view>
					<view class="my-card-footer">
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> ¥{{ userStatisticsData.month_profit | formatMonthMoneyData}}</view>
							<view class="grace-icons current-value-name"> 本月</view>
						</view>
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> ¥{{userStatisticsData.month_profit | formatMonthMoneyData(-1)}}</view>
							<view class="grace-icons value-name">{{ new Date() | formatMonth(-1) }}</view>
						</view>
						<view class="my-card-footer-item">
							<view class="grace-icons grace-blue value-show"> ¥{{userStatisticsData.month_profit | formatMonthMoneyData(-2)}}</view>
							<view class="grace-icons value-name"> {{ new Date() | formatMonth(-2) }} </view>
						</view>
					</view>
				</view>
				<view class="my-card-view">
					<view class="my-card-body">
						<view class="my-card-desc">
							<view class="my-card-title">
								<text class="my-card-name">年产生交易总额统计</text>
							</view>
						</view>
					</view>
					<view class="my-card-footer ">
						<view class="my-card-footer-item ">
							<view class="grace-icons grace-blue value-show">¥{{ userStatisticsData.year_sales | formatYearMoneyData}}</view>
							<view class="grace-icons current-value-name">今年 </view>
						</view>
						<view class="my-card-footer-item grace-border-l">
							<view class="grace-icons grace-blue value-show"> ¥{{ userStatisticsData.year_sales | formatYearMoneyData(-1)}} </view>
							<view class="grace-icons value-name"> {{ new Date() | formatYear(-1)}}年</view>
						</view>
					</view>
				</view> -->
			</view>
			<view v-else-if="role === 'supplier'">
				<view class="my-card-view">
					<view class="my-card-body">
						<view class="my-card-desc">
							<view class="my-card-title">
								<text class="my-card-name">月接单单数数据统计</text>
							</view>
						</view>
					</view>
					<view class="my-card-footer">
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> {{ supplierStatisticsData.month_order_count | formatMonthData}}单</view>
							<view class="grace-icons current-value-name"> 本月</view>
						</view>
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> {{supplierStatisticsData.month_order_count | formatMonthData(-1)}}单</view>
							<view class="grace-icons value-name"> {{ new Date() | formatMonth(-1) }}</view>
						</view>
						<view class="my-card-footer-item">
							<view class="grace-icons grace-blue value-show"> {{supplierStatisticsData.month_order_count | formatMonthData(-2)}}单</view>
							<view class="grace-icons value-name"> {{ new Date() | formatMonth(-2) }} </view>
						</view>
					</view>
				</view>
				<view class="my-card-view">
					<view class="my-card-body">
						<view class="my-card-desc">
							<view class="my-card-title">
								<text class="my-card-name">月接单金额统计</text>
							</view>
						</view>
					</view>
					<view class="my-card-footer">
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> ¥{{ supplierStatisticsData.month_order_money | formatMonthMoneyData}}</view>
							<view class="grace-icons current-value-name"> 本月</view>
						</view>
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> ¥{{supplierStatisticsData.month_order_money | formatMonthMoneyData(-1)}}</view>
							<view class="grace-icons value-name"> {{ new Date() | formatMonth(-1) }}</view>
						</view>
						<view class="my-card-footer-item">
							<view class="grace-icons grace-blue value-show"> ¥{{supplierStatisticsData.month_order_money | formatMonthMoneyData(-2)}}</view>
							<view class="grace-icons value-name"> {{ new Date() | formatMonth(-2) }} </view>
						</view>
					</view>
				</view>
				<view class="my-card-view">
					<view class="my-card-body">
						<view class="my-card-desc">
							<view class="my-card-title">
								<text class="my-card-name">年接单单数数据统计</text>
							</view>
						</view>
					</view>
					<view class="my-card-footer">
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> {{ supplierStatisticsData.year_order_count | formatYearData}}单</view>
							<view class="grace-icons current-value-name"> 本年</view>
						</view>
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> {{supplierStatisticsData.year_order_count | formatYearData(-1)}}单</view>
							<view class="grace-icons value-name"> {{ new Date() | formatYear(-1) }}年</view>
						</view>
						<view class="my-card-footer-item">
							<view class="grace-icons grace-blue value-show"> {{supplierStatisticsData.year_order_count | formatYearData(-2)}}单</view>
							<view class="grace-icons value-name"> {{ new Date() | formatYear(-2) }}年 </view>
						</view>
					</view>
				</view>
				<view class="my-card-view">
					<view class="my-card-body">
						<view class="my-card-desc">
							<view class="my-card-title">
								<text class="my-card-name">年接单金额统计</text>
							</view>
						</view>
					</view>
					<view class="my-card-footer">
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> ¥{{ supplierStatisticsData.year_order_money | formatYearMoneyData}}</view>
							<view class="grace-icons current-value-name"> 本年</view>
						</view>
						<view class="my-card-footer-item grace-border-r">
							<view class="grace-icons grace-blue value-show"> ¥{{supplierStatisticsData.year_order_money | formatMonthMoneyData(-1)}}</view>
							<view class="grace-icons value-name"> {{ new Date() | formatYear(-1) }}年</view>
						</view>
						<view class="my-card-footer-item">
							<view class="grace-icons grace-blue value-show"> ¥{{supplierStatisticsData.year_order_money | formatMonthMoneyData(-2)}}</view>
							<view class="grace-icons value-name"> {{ new Date() | formatYear(-2) }}年</view>
						</view>
					</view>
				</view>
			</view>
			<view class="grace-list grace-margin-top">
				<navigator url="/pages/order/order" class="grace-list-items">
					<text class="grace-list-icon grace-icons icon-order grace-blue"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">我的订单</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</navigator>
				<!-- <view class="grace-list-items" v-if="role === 'customer'" @click="toInvoice">
					<text class="grace-list-icon grace-icons icon-article grace-green"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">我要开票</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view> -->
				<view class="grace-list-items" v-if="role === 'customer'" @click="toAddress">
					<text class="grace-list-icon grace-icons icon-position grace-yellow"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">我的地址</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<view class="grace-list-items" v-if="role.indexOf('seller') > -1" @click="toIncome">
					<text class="grace-list-icon grace-icons icon-article grace-green"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">我的收益</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<view class="grace-list-items" @click="toChangePhone">
					<text class="grace-list-icon grace-icons icon-tel grace-green"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">修改手机</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<view class="grace-list-items" v-if="!isH5" @click="toInvite">
					 <text class="grace-list-icon grace-icons icon-share grace-blue-sky"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">邀请好友使用</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<!-- weixin -->
				<view v-if="!isH5 && isShowWX" class="grace-list-items" @click="toBindOrUnBindWeixin">
					<text class="grace-list-icon grace-icons icon-weixin grace-green"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text" v-if="userInfo.open_id">更改绑定微信</text>
							<text class="grace-list-title-text" v-else>绑定微信</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<!-- help2 -->
				<view v-if="!isH5" class="grace-list-items" @click="checkVersion">
					<text class="grace-list-icon grace-icons icon-help2 grace-green"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">关于应用：{{ currentVersion }}</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<view v-if="!isH5" class="grace-list-items" @click="feedback">
					<text class="grace-list-icon grace-icons icon-kf1 grace-green"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">在线反馈</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<view class="grace-list-items" @click="logoutBtnClick">
					<view class="grace-list-body">
						<view class="grace-flex-center">
							<view class="grace-blue color-demo" >退出登录</view>
						</view>
					</view>
				</view>
				<!-- <order-item
					v-for="item in list"
					:key="item.sell_order_id"
					:id="item.sell_order_id"
					:no="item.sell_order_id"
					:order_no="item.order_info? item.order_info.order_no : ''"
					:totalPrice="item.amount"
					:time="item.created_at"
					:status="item.status"
					:customerName="item.order_info.customer.name"
					:percent="item.percent"
					class="grace-margin-top">
				</order-item> -->
				
			</view>
			<graceDialog title="提示"  :show="showBindWeiXinDialog" :isCloseBtn='false'>
				
					<view class="dialog-content" slot="content">
						<text v-if="userInfo.open_id">确认更改绑定的微信操作吗？</text>
						<text v-else>确认绑定微信操作吗？</text>
					</view>
					<view slot="btns" class="grace-space-between">
						<text class="grace-dialog-buttons" @tap="cancleWeixinDialog">取消</text>
						<text class="grace-dialog-buttons grace-blue" @tap="confirmToBindWeixin">确认</text>
					</view>
				</graceDialog>
		</view>
	</gracePage>
</template>
<script>
	import { mapGetters, mapActions, mapState } from "vuex"
	import graceDialog from '../../graceUI/components/graceDialog.vue';
    import upload7niu from "@/utils/upload7niu.js"
	import { fetchProfit } from '@/http/order'
	import { compareVersion } from '@/utils/methods.js'	
	import { baseURL } from '@/utils/ipConfig.js'
	// import { timeFormat } from '@/utils/date.js'
	import date from '@/utils/date.js'
	
export default {
	data() {
		return {
			showBindWeiXinDialog: false,
			defaultHeader: 'https://graceui.oss-cn-beijing.aliyuncs.com/faces/1.png',
			currentVersion: '',
			checkClick: false,
			isH5: false, // 是否是H5
			isShowWX: false,
			customerStatisticsData: {}, //统计数据
			supplierStatisticsData: {},
			userStatisticsData: {},
			userColumnTypes: ['order_count', 'customer_count', 'sales_count', 'profit_count']// order_count(成交订单数) customer_count(成交客户数) sales_count(成交销售额度) profit_count(收益总额度)
		}
	},
	computed: {
		...mapState({
			list: state => state.profit.profit
		}),
		...mapGetters(['role','userInfo'])
	},
	methods:{
		...mapActions(['refreshProfit', 'updateUserAvatar', 'statisticsCustomerData', 'statisticsUserData', 'statisticsSupplierData']),
		headClick () {
			uni.navigateTo({
				url: '/pages/my/changeInfo'
			})
			return
			uni.request({
				url: baseURL + 'apiv1/qiniu/token', //仅为示例，并非真实接口地址。
				data: {
					// text: 'uni.request'
				},
				header: {
					// 'custom-header': 'hello' //自定义请求头信息
				},
				success: (res) => {
					console.log('7niu地址=', res.data.data)
					upload7niu(res.data.data).then(url=> {
						console.log('url =',url)
						this.updateUserAvatar({
							avatar: url
						}).then(res=>{
							console.log('updateUserAvatar =', res)
							uni.showToast({
								ucon: 'none',
								title: "更改头像成功"
							})
						}).catch(error=>{
							console.log('updateUserAvatar  error =', error)
						})
					})
				}
			});
		},
		toChangePhone () {
			uni.navigateTo({
				url: '/pages/my/changePhone'
			})
		},
		toAddress () {
			uni.navigateTo({
				url: '/pages/address/address'
			})
			// 商品详情 选择收货地址
			// uni.navigateTo({
			// 	url:'/pages/address/address?type=select'
			// })
		},
		toInvoice () {
			uni.navigateTo({
				url: '/pages/invoice/invoice'
			})
		},
		toIncome () {
			uni.navigateTo({
				url: '/pages/my/income'
			})
		},
		toInvite () {
			uni.navigateTo({
				url: `/pages/user/invite?code=${this.$store.state.user.userInfo.invite_code}`
			})
		},
		toBindOrUnBindWeixin (){
			this.showBindWeiXinDialog = true
		},
		confirmToBindWeixin() {
			this.showBindWeiXinDialog = false
			let strongSelf = this
			uni.login({
				provide: 'weixin',
				success(res) {
					let data = {}
					// #ifdef MP-WEIXIN
					data = { code: res.code}
					// #endif
					// #ifdef APP-PLUS
					data = {
						type: 1, 
						access_token: res.authResult.access_token,
						openid: res.authResult.openid
					}
					// #endif
					console.log('auth data = ', data, res)
					
					strongSelf.$store.dispatch('bindWeixin', {
						open_id: data.openid,
						wechat_token: data.access_token
					}).then(res => {
						console.log('weixin', res)
						if (res.code === 20000) {
							
							uni.showToast({
								ucon: 'none',
								title: '绑定成功'
							})
							// this.$store.commit('updateUserInfo',
							// {
							// 	openid: data.openid
							// })
						}
					})
					
				},
				fail(err){
					uni.showToast({
						ucon: 'none',
						title: "授权失败"
					})
				}
			})
		},
		cancleWeixinDialog() {
			this.showBindWeiXinDialog = false
		},
		logoutBtnClick() {
			this.$store.dispatch('logout')
			this.$store.dispatch('jimLoginOut')
			uni.reLaunch({
			    url: '/pages/user/login'
			});
		},
		checkVersion() {
			if(this.checkClick){
				return
			}
			this.checkClick = true
			// 检查版本更新
			uni.getSystemInfo({
				success:(res) => {
					//检测当前平台，如果是安卓则启动安卓更新  
					console.log('平台信息',res)
					if(res.platform=="android"){  
						this.AndroidCheckUpdate();  
					}  
				}  
			})
		},
		AndroidCheckUpdate(){
			// 版本检查
			this.$store.dispatch('update').then(res => {
				console.log(res);
				if(compareVersion(res.data.version, this.currentVersion) === 1){
					if(res.data.force_update) {
						uni.reLaunch({
							url:'../update/update'
						})	
					} else {
						uni.navigateTo({
							url:'../update/update'
						})
					}
			
				}else {
					uni.showToast({title: '已经是最新版本'})
				}
				this.checkClick = false
			}).catch(()=> {
				this.checkClick = false
			})
		},
		rankClick() {
			uni.navigateTo({
				url: `/pages/my/rank`
			})
		},
		gotoColumn(typeNo) {
			uni.navigateTo({
				url: `/pages/my/column/column?type=${this.userColumnTypes[typeNo]}`
			})
		},
		feedback() {
			uni.navigateTo({
				url: `/pages/my/feedback`
			})
		}
	},
	onShow () {
		this.refreshProfit()
		// #ifdef APP-PLUS 
		plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
			console.log(JSON.stringify(wgtinfo));
			this.currentVersion = wgtinfo.version //应用版本号
		})
		// #endif
	},
	onLoad() {
		// #ifdef APP-PLUS
		// this.isH5 = false
		// #endif
		// 检查版本更新
		uni.getSystemInfo({
			success:(res) => {
				//检测当前平台，如果是安卓则启动安卓更新  
				console.log('平台信息',res)
				if(res.platform=="android"){  
					this.isShowWX = true
				}  
			}  
		})
		if(this.role === 'customer') {
			this.statisticsCustomerData().then(res => {
				this.customerStatisticsData = res.data
			})
		}
		if(this.userInfo.signin_user_type === 'user') {
			this.statisticsUserData().then(res => {
				this.userStatisticsData = res.data
			})
		}
		if(this.role === 'supplier') {
			this.statisticsSupplierData().then(res => {
				this.supplierStatisticsData = res.data
			})
		}
	},
}
</script>
<style lang="scss">
.my-top-card {
	background-color: #fff;
}
.my-card {
	height: 180rpx;
	background-color: #fff;
	padding: 0rpx 48rpx;
	.avatar {
		height: 120rpx;
		width: 120rpx;
		border-radius: 60rpx;
		margin-right: 40rpx;
	}
	.top-right {
		.rank-info {
			margin-top: 10rpx;
			height: 40rpx;
			padding-right: 10rpx;

			border: 1rpx solid #2668B3;
			border-radius: 5rpx;
			line-height: 40rpx;
			font-size: 20rpx;
			font-family: SourceHanSansSC;
			font-weight: 400;
			color: #2668B3;
			display: flex;
			.left-icon-bg {
				background: #2668B3;
				border-radius: 0  5rpx 5rpx 0;
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
				.img {
					margin: 5rpx 5rpx;
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
	}
}
.color-demo{text-align:center; width:212rpx; height:66rpx; font-size:22rpx; line-height:66rpx; border-radius:6rpx; background-color:#F6F7F8; margin:10rpx;}
.bottomBtn {
	display: flex;
}
.add{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		justify-content: center;
		align-items: center;
		.btn{
			box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: #3688FF;
			color: #fff;
			justify-content: center;
			align-items: center;
			.icon{
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}
			font-size: 30upx;
		}
	}
.ucenter-face{width:100rpx !important; height:100rpx !important;}
.ucenter-face-image{width:100rpx !important; height:100rpx !important;}
.ucenter-line{height:12rpx; background-color:#F4F5F6; margin:16rpx 0;}
.dialog-content{padding:25rpx; font-size:26rpx; text-align:center; line-height:60rpx;background-color:#F8F8F8; display:block;}
/* 卡片视图 */
	.my-card-view{margin-top:30rpx; margin-bottom:8rpx; border-radius:10rpx; background-color:#FFFFFF; padding:30rpx 25rpx 0;}
	.my-card-body{flex-direction:row; flex-wrap:nowrap; display:flex; padding-bottom: 30rpx;}
	.my-card-img{width:100rpx; height:100rpx; border-radius:80rpx; flex-shrink:0;}
	.my-card-desc{width:100rpx; margin-left:30rpx; flex:auto;}
	.my-card-title{flex-direction:row; display:flex; align-items:center; flex-wrap:nowrap;}
	.my-card-name{
		font-weight:bold;
		font-size:36rpx; color:#333333; line-height:50rpx; margin-right:20rpx;}
	.my-card-text{line-height:50rpx; font-size:24rpx; color:#888888; display:block;}
	.my-card-footer{display:flex; flex-direction:row; flex-wrap:nowrap; padding:20rpx 0; justify-content:space-between;}
	.my-card-footer-item{width:700rpx; text-align:center; line-height:38rpx; font-size:26rpx; color:#666666;}
.my-card-sub-name {
	font-size: 30rpx;
	font-weight:500;
	color: #333333;
}
.value-show {
	font-size:30rpx;
	font-weight:bold;
	color:rgba(40,105,179,1);
}
.value-name {
	color: #999999;
	font-size: 24rpx;
}
.current-value-name {
	color: #333333;
	font-size: 28rpx;
	font-weight: bold;
}

.row {
	display: flex;
	// justify-content: space-around;
	.cell {
		margin: 29rpx 55rpx;
		width: 120rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.img-bg{
			background: rgb(240,240,240);
			border-radius: 15rpx;
			width: 96rpx;
			height: 96rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 10rpx;
			.img {
				width: 42rpx;
				height: 44rpx;
			}
		}
		.title {
			font-size: 24rpx;
			font-weight: 500;
			color: #343434;
		}
	}
}
</style>