<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body">
			<view class="grace-title grace-margin-top">公司信息</view>
			<form class="grace-form">
			    <view class="grace-form-item grace-border-b">
				<view class="grace-form-body">
					<input v-model="form.name" type="text" class="grace-form-input" name="name1" placeholder="请输入内容"></input>
				</view>
			    </view>
			</form>
			<view class="grace-title grace-margin-top">上传营业执照</view>
			<!-- 图片选择  -->
			<view style="margin-top:5rpx;">
				<graceSelectImgAndUpload :maxFileNumber="9" ref="selectimgandupload" @change="changeImage"
				uploadServerUrl="https://upload.qbox.me/" :formData="{ key, token }"></graceSelectImgAndUpload>
			</view>
			<!-- <view class="grace-title grace-margin-top">公司相关资料</view>
			<view style="margin-top:5rpx;">
				<view v-for="(file, index) in form.doc" class="upload-file">
					<view class="info">
						<text class="grace-icons icon-order"></text>
						<text>{{file.name}}</text>
					</view>
					<text class="grace-icons icon-close2" @click="form.doc.splice(index, 1)"></text>
				</view>	
				<button type="primary" size="mini" class="grace-button" @click="upload('doc')">
					上传
				</button>
			</view> -->
			<view class="grace-title grace-margin-top">手机号码</view>
			<form class="grace-form">
			    <view class="grace-form-item grace-border-b">
				<view class="grace-form-body">
					<input v-model="form.phone" type="text" class="grace-form-input" name="name1" placeholder="请输入内容"></input>
				</view>
			    </view>
					<view class="grace-title grace-margin-top">短信验证码</view>
					<view class="grace-form-item grace-border-b">
						<view class="grace-form-body">
							<input v-model="form.mobile_code" type="number" class="grace-form-input" name="yzm" placeholder="请输入验证码" />
						</view>
						<view class="login-sendmsg-btn grace-bg-blue grace-border-radius" @tap="getVCode">{{vcodeBtnName}}</view>
					</view>
			</form>
			<view class="grace-margin-top">
				<button form-type="submit" type="primary" class="grace-button grace-border-radius grace-gtbg-blue" @click="onSubmit">
					用户注册
				</button>
			</view>
		</view>
	</gracePage>
</template>
<script>
	import {getQiniuToken} from '@/http/file.js'
	import { applySupplier } from '@/http/user.js'
export default {
	data () {
		return {
			qiniu_uri: '',
			key: '',
			token: '',
			vcodeBtnName: "获取验证码",
			countNum : 60,
			countDownTimer : null,
			current: {				
				type: '',
				url: ''
			},
			form: {
				name: '',
				phone: '',
				mobile_code: '',
				license: [],
				doc: []
			},
			
		}
	},
	methods: {
		getVCode : function(){
			var myreg=/^[1][0-9]{10}$/;
			if (!myreg.test(this.form.phone)){
				uni.showToast({ title: '请正确填写手机号码', icon : "none"});
				return false;
			}
			// 手机号码为 :  this.phoneno
			// vcodeBtnName 可以阻止按钮被多次点击 多次发送 return 会终止函数继续运行
			if (this.vcodeBtnName != '获取验证码' && this.vcodeBtnName != '重新发送'){return ;}
			this.vcodeBtnName =  "发送中...";
			// 与后端 api 交互，发送验证码 【自己写的具体业务代码】
			this.$http.get('apiv1/send/verifycode', { mobile: this.form.phone, message_type: 'verify_code', action_type: 'bind' }).then(() => {				
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
		changeImage (list) {
			getQiniuToken().then(({ key, qiniu_uri, token }) => {
				this.key = key
				this.qiniu_uri = qiniu_uri
				this.token = token
				this.$nextTick(function(){
					this.$refs.selectimgandupload.upload(list.length - 1, () => {
						this.form.license.push(qiniu_uri)
					})
				})
			})
		},
		onSubmit () {
			applySupplier(this.form).then(() => {
				uni.showToast({ title: "注册成功，等待系统审核", icon: "none" });
				setTimeout(function(){
					uni.navigateTo({
										url: '/pages/user/login'
									})
				},2000)
			})
		}
	}
}
</script>
<style>
.login-sendmsg-btn{height:60rpx; width:200rpx; flex-shrink:0; margin-left:30rpx; text-align:center; background-color:#3688FF; line-height:60rpx; font-size:26rpx;}
	.grace-form-input {
		text-align: left;
	}
	.upload-file {
		margin-bottom: 24rpx;
		display: flex;
	}
	.upload-file .info {
		flex: 1;
	}
</style>