<template>
	<view>
		<gracePage :customHeader="false">
			<view slot="gBody" class="grace-body">
			<form @submit="formSubmit" class="grace-form" style="margin-top:25px;">
				<!-- <graceFlex :classes="['row','xcenter']">
					<image class="avatar row xcenter" :src="avatar || this.userInfo.avatar || defaultHeader" mode="aspectFill" @click="headClick"></image>
				</graceFlex> -->
				<!-- <view class="grace-form-item grace-border-b">
					<text class="grace-form-label">用户名称:</text>
					<view class="grace-form-body">
						<input type="text" class="grace-form-input" name="name" placeholder="请输入用户名称" :value='computedName'/>
					</view>
				</view> -->
				<view class="grace-form-item grace-border-b">
					<text class="grace-form-label">手机号码:</text>
					<view class="grace-form-body">
						<input type="number" v-model="phoneno" class="grace-form-input" name="pn" placeholder="请输入手机号码" />
					</view>
				</view>
				<view class="grace-form-item">
					<text class="grace-form-label">短信验证码</text>
					<view class="grace-form-body">
						<input type="number" class="grace-form-input" v-model="yzm" name="yzm" placeholder="请输入验证码" />
					</view>
					<view class="login-sendmsg-btn grace-bg-blue grace-border-radius" @tap="getVCode">{{vcodeBtnName}}</view>
				</view>
				<view class="grace-margin-top">
					<button form-type="submit" type="primary" class="grace-button grace-border-radius grace-gtbg-blue">
						提交
					</button>
				</view>
			</form>
			</view>
		</gracePage>

	</view>
</template>

<script>
	import { mapGetters, mapActions, mapState } from "vuex"
	import gracePage from "../../graceUI/components/gracePage.vue";
	import { baseURL } from '@/utils/ipConfig.js'
	import upload7niu from "@/utils/upload7niu.js"
	var graceChecker = require("../../graceUI/jsTools/graceChecker.js");
	
export default{
	data() {
		return {
			avatar: '',
			defaultHeader: 'https://graceui.oss-cn-beijing.aliyuncs.com/faces/1.png',
			vcodeBtnName: "获取验证码",
			countNum : 60,
			countDownTimer : null,
			phoneno: '', // 手机号
			yzm: '' // 验证码
		}
	},
	components:{
		gracePage
	},
	computed: {
		...mapGetters(['role','userInfo']),
		computedName () {
			if(this.userInfo.name && this.userInfo.name.length > 0) {
				return this.userInfo.name
			} else if(this.userInfo.username && this.userInfo.username.length > 0) {
				return this.userInfo.username
			} else {
				return ''
			}
		}
	},
	mounted() {
		this.phoneno = this.userInfo.mobile	
	},
	methods:{
		...mapActions(['updateUserAvatar', 'updateUserInfo']),
		headClick () {
			// return
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
						this.avatar = url
					})
				}
			});
		},
		formSubmit(e) {

			this.avatar = this.avatar || this.userInfo.avatar
			// 表单验证
			var rule = [
				{ name: "pn", checkType: "phoneno", errorMsg: "请填写正确的手机号" },
				{ name: "yzm", checkType: "string", checkRule: "4,6", errorMsg: "请正确填写短信验证码" },
			];
			var formData = {  avatar: this.avatar, ...e.detail.value};
			var checkRes = graceChecker.check(formData, rule);
			// 验证通过
			if (checkRes) {
				console.log(e);
				this.summitRequest({
					mobile: e.detail.value.pn,
					mobile_code: this.yzm
				})
			} else {
				uni.showToast({ title: graceChecker.error, icon: "none" });
			}
		},
		summitRequest (params) {
			this.updateUserInfo({
				mobile_code: params.mobile_code,
				mobile: params.mobile
			}).then(res=>{
				console.log('updateUserAvatar =', res)
				uni.showToast({
					ucon: 'none',
					title: "更改信息成功"
				})
				setTimeout(function(){
					uni.navigateBack()
				},1500)
			}).catch(error=>{
				console.log('updateUserAvatar  error =', error)
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
			this.$http.get('apiv1/send/verifycode', { mobile: this.phoneno, message_type: 'verify_code', action_type: 'bind' }).then(() => {				
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
	}
}
</script>

<style>
/* .my-card {
	height: 180rpx;
	background-color: #fff;
	padding: 0 48rpx; */
	.avatar {
		height: 120rpx;
		width: 120rpx;
		border-radius: 60rpx;
		/* margin-right: 40rpx; */
		margin: 40rpx 0rpx;
	}
/* } */

.grace-form-label{width:168rpx;}
.grace-form-input{text-align:left;}
.login-sendmsg-btn{height:60rpx; width:200rpx; flex-shrink:0; margin-left:30rpx; text-align:center; background-color:#3688FF; line-height:60rpx; font-size:26rpx;}
</style>
