<template>
	<gracePage :customHeader="false">
		<!-- 页面主体 -->
		<view slot="gBody" class="grace-body">
			<view class="marginTop">
				<!-- <image src="http://static.hcoder.net/graceui/logo201908.png" mode="widthFix" class="logo"></image> -->
				<image src="/static/img/logo_white_150.png" mode="widthFix" class="logo"></image>
			</view>
			<form @submit="loginNow" class="grace-form" style="margin-top:80rpx;">
				<view class="grace-form-item grace-border-b">
					<view class="grace-pnper">
						<picker :value="pnpre" @change="changePre" :range="pnpres" name="pn_pre" style="text-align:left;">
							<text class="grace-text">+{{pnpres[pnpre]}}</text><text class="grace-text grace-icons icon-arrow-down" style="margin-left:10rpx;"></text>
						</picker>
					</view>
					<view class="grace-form-body">
						<input type="number" v-model="phoneno" class="grace-form-input" name="pn" placeholder="请输入手机号码" />
					</view>
				</view>
				<view class="grace-form-item">
					<text class="grace-form-label">短信验证码</text>
					<view class="grace-form-body">
						<input type="number" class="grace-form-input" name="yzm" placeholder="请输入验证码" />
					</view>
					<view class="login-sendmsg-btn grace-bg-blue grace-border-radius" @tap="getVCode">{{vcodeBtnName}}</view>
				</view>
				<view class="grace-margin-top">
					<!-- <button form-type="submit" type="primary" class="grace-button grace-border-radius grace-gtbg-blue">
						登录 <text class="grace-icons icon-arrow-right"></text>
					</button> -->
					
					<view class="footer grace-padding grace-flex grace-space-between" style="padding: 20rpx;">
						<button form-type="submit" class="grace-button" style="width: 40%; height: 90rpx;" type="primary" plain="true">登录</button>
						<button class="grace-button" style="width: 40%; height: 90rpx;" type="primary" @click="toRole">注册</button>
					</view>
					
				</view>
			</form>
			<!-- 第三方登录 -->
			<view v-if="!isH5 && isShowWX" style="position:relative;  width:100%; margin-top: 120upx;">
				<view class="grace-line-title grace-margin-top">
					<view class="grace-line-title-line"></view>
					<text class="grace-line-title-text">第三方登录</text>
					<view class="grace-line-title-line"></view>
				</view>
				<view class="grace-margin-top grace-nowrap grace-flex-center">
					<text class="grace-login-three-items grace-icons icon-weixin grace-blue wxFontSize" @tap="loginWithWx"></text>
				</view>
			</view>
			
		</view>
		<view slot="gFooter" class="grace-absolute-lb grace-padding grace-flex grace-space-between" style="">
			<!-- 第三方登录 -->
			<view style="position:fixed; left:25rpx; bottom:40rpx; width:700rpx;">
				
				<!-- <image src="/static/img/Icon-76@3x.png" mode="widthFix" class="logo grace-border-radius-small"></image> -->
				<view class="grace-flex-center" style="margin-top: 15upx;">
					<text class="grace-gray">蚂蚁智慧包装</text>
				</view>
				<view class="grace-flex-center">
					<text class="grace-gray">MYXPACK CO.LTD</text>
				</view>
			</view>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import { fail } from 'assert';
import { mapActions } from 'vuex'

var graceChecker = require("../../graceUI/jsTools/graceChecker.js");
export default {
	data() {
		return {
			pnpre : 0,
			pnpres : ['86', '01', '11', '26', '520'],
			vcodeBtnName: "获取验证码",
			countNum : 60,
			countDownTimer : null,
			phoneno : '',// 手机号
			isH5: true, // 是否是H5
			isShowWX: false // iOS暂时不支持
		}
	},
	methods:{
		...mapActions(['iosReview']),
		loginWithWx : function(){
			// uni.showToast({
			// 	title:"请完善登录功能", icon:"none"
			// })
			let strongThis = this
			uni.getProvider({
			    service: 'oauth',
			    success: function(res) {
			        console.log(res.provider, res.provider.indexOf('weixin') );
			        //支持微信、qq和微博等
			        if (res.provider.indexOf('weixin') !== -1) {
			console.log('login weixin start')
			
					uni.login({
						provide: 'weixin',
						success(res) {
							console.log('login weixin', res)
							
							let data = {}
							// #ifdef MP-WEIXIN
							data = { code: res.code}
							// #endif
							// #ifdef APP-PLUS
							data = {
								// type: 1, 
								wechat_token: res.authResult.access_token,
								open_id: res.authResult.openid
							}
							// #endif
							console.log('auth data = ', data, res)
							strongThis.$store.dispatch('loginWithWeixin', data).then(res => {
								console.log('dispatch Login = ', res)
								if (res.message === 'OK') {
									// uni.switchTab reLaunch
									uni.switchTab({url: '/pages/index/index'})
								}
							})
						},
						fail(err){
							console.log(err)
							uni.showToast({
								ucon: 'none',
								title: "授权失败"
							})
						}
					})
			        }
			    }
			});
		},
		changePre : function(e){
			this.pnpre = e.detail.value;
		},
		loginNow : function(e){
			// 表单验证
			var rule = [
				{ name: "pn", checkType: "phoneno", errorMsg: "请填写正确的手机号" },
				{ name: "yzm", checkType: "string", checkRule: "4,6", errorMsg: "请正确填写短信验证码" },
			];
			var formData = e.detail.value;
			var checkRes = graceChecker.check(formData, rule);
			// 验证通过
			if (checkRes) {
				console.log(e);
				this.loginRequest(e.detail.value.pn, e.detail.value.yzm)
			} else {
				uni.showToast({ title: graceChecker.error, icon: "none" });
			}
		},
		loginRequest(phone, yzm) {
			this.$store.dispatch('login', {
			  "client_type": "mobile",
			  "code": yzm,
			  "mobile": phone
			}).then(res => {
				console.log('dispatch Login = ', res)
				if (res.message === 'OK') {
					// uni.switchTab reLaunch
					uni.switchTab({url: '/pages/index/index'})
				}
			})
		},
		getVCode : function(){
			var myreg=/^[1][0-9]{10}$/;
			if (!myreg.test(this.phoneno)){
				uni.showToast({ title: '请正确填写手机号码', icon : "none"});
				return false;
			}
			// 手机号码为 :  this.phoneno
			// vcodeBtnName 可以阻止按钮被多次点击 多次发送 return 会终止函数继续运行
			if (this.vcodeBtnName != '获取验证码' && this.vcodeBtnName != '重新发送'){return ;}
			this.vcodeBtnName =  "发送中...";
			// 与后端 api 交互，发送验证码 【自己写的具体业务代码】
			this.$http.get('apiv1/send/verifycode', { mobile: this.phoneno, message_type: 'verify_code' }).then(() => {				
				// 假设发送成功，给用户提示
				uni.showToast({ title: '短信已发送，请注意查收', icon : "none"});
				// 倒计时
				this.countNum = 60;
				this.countDownTimer = setInterval(function(){this.countDown();}.bind(this), 1000);
			})
		},
		countDown : function(){
			if (this.countNum < 1){
			  clearInterval(this.countDownTimer);
			  this.vcodeBtnName = "重新发送";
			  return ;
			}
			this.countNum--;
			this.vcodeBtnName =  this.countNum + '秒重发';
		},
		reg : function(){
			wx.showToast({ title: "注册页面类似登录，请自行完善 (:", icon: "none" });
		},
		toRole () {
			if(this.$appTypeNum === '1') {
				uni.navigateTo({
					url: '/pages/user/supplier_apply'
				})
			} else {
				uni.navigateTo({
					url: '/pages/user/role'
				})			
			}

		}
	},
	beforeMount() {
		
		// #ifdef APP-PLUS
		this.isH5 = false
		// 检查版本更新
		uni.getSystemInfo({
			success:(res) => {
				//检测当前平台，如果是安卓则启动安卓更新  
				console.log('平台信息',res)
				if (res.platform=="android"){  
					this.isShowWX = true
				} else {
					// 苹果审核校验
					this.iosReview({
						version: this.$iosVersion
					}).then(res => {
						this.isH5 = false
						if (res.code === 20000) {
							this.isShowWX = res.data.show
						} else if(res.code === 60001){
							this.isShowWX = true
						}
					})
				}
			}
		})
		// #endif

	},
	onLoad() {
		// #ifdef APP-PLUS		
		// #endif
	},
	components:{
		gracePage
	}
}
</script>
<style>
.marginTop{
	margin-top:100rpx;;
	height: 68rpx;
}
.logo{
	width:150rpx;
	/* height:68rpx; */
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
}
.login-sendmsg-btn{height:60rpx; width:200rpx; flex-shrink:0; margin-left:30rpx; text-align:center; background-color:#3688FF; line-height:60rpx; font-size:26rpx;}
.grace-pnper{width:168rpx; flex-shrink:0;}
.grace-form-label{width:168rpx;}
.grace-form-input{text-align:left;}
.grace-form-item{padding:10rpx 0;}
.grace-login-three-items{display:block; width:88rpx; height:88rpx; line-height:88rpx; font-size:60rpx; color:#3688FF; text-align:center; margin:10rpx;}
/* .footer {
	height: 250px;
	background-color: rgba(255, 255, 255, 0.5);
} */
.logo{
	width:150rpx;
	/* height:68rpx; */
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
}
.wxFontSize {
	font-size: 80rpx;
}
</style>