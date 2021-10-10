<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body">
			<view class="grace-flex grace-columns grace-flex-vcenter" style="height: 200rpx;justify-content: center;">		
				<view class="grace-h4">
					赠送好友邀请码
				</view>
				<view class="grace-h6">
					此邀请码仅限申请账号时使用
				</view>
			</view>
			<view class="grace-number-inputs grace-margin-top">
				<view v-for="str in code" class="grace-number-input">{{str}}</view>
			</view>
			<view class="grace-margin-top">
				<button form-type="submit" type="primary" class="grace-button grace-border-radius grace-gtbg-blue" @click="onShare">
					点击分享
				</button>
			</view>
		</view>
	</gracePage>
</template>

<script>
	import { mapGetters } from "vuex"
	import appShare, { closeShare } from "@/js_sdk/zhouWei-APPshare/plugins/share/index.js"
	export default {
		data() {
			return {
				// code: ''
			}
		},
		computed: {
			...mapGetters(['role','userInfo']),
			code() {
				return this.userInfo.invite_code || this.userInfo.invitation_code
			}
			
		},
		methods: {
			copyClick() {
				uni.setClipboardData({
				    data: this.code,
				    success: function () {
				        console.log('success');
						uni.toast('您已成功复制到剪贴板');
						
				    }
				});
			},
			onShare(){
			                let shareData = {
			                    shareUrl:`http://m2.myxpack.com/#/?code=${this.code}&user_type=${this.userInfo.signin_user_type}`,
			                    shareTitle:"蚂蚁包装",
			                    shareContent:" 蚂蚁包装，为您多一层保障",
			                    shareImg:"http://image.myxpack.com/87ba017f-2a5d-4543-b641-d85024eefcbe",
			                    appId : "wx35304d4adf2c6d04", // 默认不传type的时候，必须传appId和appPath才会显示小程序图标
			                    appPath : "pages/home/home",
			                    appWebUrl : "http://m2.myxpack.com/#/",
			                };
			                // 调用
			                let shareObj = appShare(shareData,res => {
			                    console.log("分享成功回调",res);
			                    // 分享成功后关闭弹窗
			                    // 第一种关闭弹窗的方式
			                    closeShare();
			                });
			                // setTimeout(() => {
			                //     // 第二种关闭弹窗的方式
			                //     shareObj.close();
			                // },5000);
			            }
		},
		onLoad(params) {
			// this.code = params.code
		}
	}
</script>

<style>
.grace-number-inputs{
	display:flex; flex-wrap:nowrap; justify-content:center;
	background-color: #fff;
	border: 1px solid #eee;
	border-radius: 30rpx;
	padding: 100rpx 0;
}
.grace-number-input{width:80rpx; font-size:32rpx; font-weight:700; color:#A5A7B2; height:80rpx; text-align:center; line-height:80rpx; margin:10rpx; border:1px solid #D5D6D8; background-color:#FFFFFF; border-radius:10rpx;}
</style>
