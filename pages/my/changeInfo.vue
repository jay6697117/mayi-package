<template>
	<view>
		<gracePage :customHeader="false">
			<view slot="gBody" class="grace-body">
			<form @submit="formSubmit" class="grace-form" style="margin-top:25px;">
				<graceFlex :classes="['row','xcenter']">
					<image class="avatar row xcenter" :src="avatar || this.userInfo.avatar || defaultHeader" mode="aspectFill" @click="headClick"></image>
				</graceFlex>
				<view class="grace-form-item grace-border-b">
					<text class="grace-form-label">用户名称:</text>
					<view class="grace-form-body">
						<input type="text" class="grace-form-input" name="name" placeholder="请输入用户名称" :value='computedName'/>
					</view>
				</view>
				<!-- <view class="grace-form-item grace-border-b">
					<text class="grace-form-label">手机号码:</text>
					<view class="grace-form-body">
						<input type="number" :value="userInfo.mobile" class="grace-form-input" name="pn" placeholder="请输入手机号码" />
					</view>
				</view> -->
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
				{ name: "name", checkType: "string", checkRule:'1,',  errorMsg: "请填写用户名称" },
				// { name: "pn", checkType: "phoneno", errorMsg: "请填写正确的手机号" },
				{ name: "avatar", checkType: "string", checkRule:'1,',  errorMsg: "请选择用户头像" },
			];
			var formData = {  avatar: this.avatar, ...e.detail.value};
			var checkRes = graceChecker.check(formData, rule);
			// 验证通过
			if (checkRes) {
				console.log(e);
				this.summitRequest({
					avatar: this.avatar,
					// name: e.detail.value.name,
					mobile: e.detail.value.pn
				})
			} else {
				uni.showToast({ title: graceChecker.error, icon: "none" });
			}
		},
		summitRequest (params) {
			this.updateUserInfo({
				avatar: params.avatar,
				name: params.name,
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
		}
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
</style>
