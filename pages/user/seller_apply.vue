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
				<!-- <view class="grace-title grace-margin-top">短信验证码</view> -->
					
					<view class="grace-form-item grace-border-b">
						<text class="grace-form-label">短信验证码</text>
						<view class="grace-form-body">
							<input v-model="mobile_code" type="number" class="grace-form-input" name="yzm" placeholder="请输入验证码" />
						</view>
						<view class="login-sendmsg-btn grace-bg-blue grace-border-radius" @tap="getVCode">{{vcodeBtnName}}</view>
					</view>
				<view class="grace-form-item grace-border-b">
					<text class="grace-form-label">姓名</text>
					<view class="grace-form-body">
						<input type="text" class="grace-form-input" name="name" placeholder="请输入姓名" />
					</view>
				</view>
				<view class="grace-form-item grace-border-b">
					<text class="grace-form-label">邀请码</text>
					<view class="grace-form-body">
						<input type="text" class="grace-form-input" v-model="h5InviteCode" name="yqm" placeholder="请输入邀请码" />
					</view>
				</view>

				<view class="grace-margin-top">
					<button form-type="submit" type="primary" class="grace-button grace-border-radius grace-gtbg-blue">
						用户注册
					</button>
				</view>
			</form>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import { fail } from 'assert';
import { byInviteCode, applySeller } from '@/http/user.js'
import { mapGetters } from 'vuex'
var graceChecker = require("../../graceUI/jsTools/graceChecker.js");
export default {
	data() {
		return {
			pnpre : 0,
			pnpres : ['86', '01', '11', '26', '520'],
			vcodeBtnName: "获取验证码",
			countNum : 60,
			countDownTimer : null,
			mobile_code: '',
			phoneno : '', // 手机号
			name: '', // 姓名
			h5InviteCode: ''
		}
	},
	computed:{
		...mapGetters(['userInfo'])
	},
	onShow() {
		if(this.userInfo.code) {
			this.h5InviteCode = this.userInfo.code
		} else {
			this.h5InviteCode = ''
		}
	},
	methods:{
		changePre : function(e){
			this.pnpre = e.detail.value;
		},
		loginNow : function(e){
			// 表单验证
			var rule = [
				{ name: "pn", checkType: "phoneno", errorMsg: "请填写正确的手机号" },
				{ name: "yzm", checkType: "string", checkRule: "4,6", errorMsg: "请正确填写验证码" },
				{ name: "name", checkType: "string", checkRule:'1,',  errorMsg: "请填写姓名" },
				{ name: "yqm", checkType: "string", checkRule: "4,6", errorMsg: "请正确填写邀请码" },
			];
			var formData = e.detail.value;
			var checkRes = graceChecker.check(formData, rule);
			// 验证通过
			if (checkRes) {
				console.log(e);
				this.loginRequest(e.detail.value.pn, e.detail.value.yqm, e.detail.value.name)
			} else {
				uni.showToast({ title: graceChecker.error, icon: "none" });
			}
		},
		loginRequest(phone, yqm, name) {
			byInviteCode({phone, invite_code: yqm, mobile_code: this.mobile_code}).then(res => {
				console.log(res)
				applySeller({
					phone,
					name: name,
					invite_user_id: res.item.id,
					mobile_code: this.mobile_code
				}).then(applyRes => {
					console.log(applyRes)
					uni.showToast({ title: "注册成功，等待系统审核", icon: "none" });
					setTimeout(function(){
						if(this.$isH5Share) {
							this.gotoDownH5()
						} else {
							uni.navigateTo({
								url: '/pages/user/login'
							})
						}
					},2000)
				}).catch(()=> {
					if (this.$isH5Share) {
						setTimeout(function(){
							this.gotoDownH5()
						},2000)
					}
				})
			})
		},
		gotoDownH5 () {
			window.open('http://d.firim.top/ub1y')
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
			this.$http.get('apiv1/send/verifycode', { mobile: this.phoneno, message_type: 'verify_code',action_type: 'bind' }).then(() => {				
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
		}
	},
	components:{
		gracePage
	}
}
</script>
<style>
.marginTop{margin-top:100rpx;}
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
</style>