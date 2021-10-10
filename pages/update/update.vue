<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body" style="padding-bottom:150rpx;">
			<view class="grace-title grace-h4" style="margin-top:50px;">
				有新的版本
			</view>
			<view class="grace-text">
				<text>{{updateContent.desc}}</text>
			</view>
		</view>
		<view slot="gFooter" class="concerns-footer" @tap="download" v-if="updateContent != null">
			<graceProgressButton :buttonText="buttonText" borderRadius="50rpx" :val="progress"></graceProgressButton>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceProgressButton from "../../graceUI/components/graceProgressButton.vue";
export default{
	data() {
		return {
			progress : 0,
			buttonText : "安装新版本",
			fileUrl  : '',
			updateContent : null
		}
	},
	components:{
		gracePage,
		graceProgressButton
	},
	onLoad:function(){
		// uni.request({
		// 	url:'http://grace.hcoder.net/api/index/version',
		// 	success:(res)=>{
		// 		this.updateContent = res.data;
		// 	}
		// })
		this.$store.dispatch('update').then(res => {
			this.updateContent = res.data
		})
	},
	methods:{
		download : function(){
			if(this.buttonText != "安装新版本"){return ;}
			this.buttonText = "开始下载新版本";
			// 根据进度判断要做什么
			// 0 下载
			if(this.progress == 0){
				const downloadTask = uni.downloadFile({
					url : this.updateContent.resource_url,
					success : (res) => {
						if (res.statusCode === 200) {
							this.progress = 100;
							this.buttonText = '正在安装';
							uni.showToast({
								title :'新版本下载成功，开始安装',
								icon  :"none"
							});
							plus.runtime.install(res.tempFilePath);
						}
					}
				});
				downloadTask.onProgressUpdate((res) => {
					this.progress = res.progress;
				});
			}
		}
	}
}
</script>
<style>
.concerns-footer{padding:10rpx 20rpx; background-color:#F4F5F6;}
</style>