<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body">
			<div class="input-view">
				<textarea class="textarea" v-model="feedBackText" placeholder="反馈内容：" />
			</div>
			<view class="commit-view">
				<button type="primary" class="grace-button commit-btn" @click="commitClick">提交</button>
			</view>
			<graceHeaderAlert ref="graceHeaderAlert1" background="#9DD26D">
				<text class="grace-icons icon-right grace-white grace-h5" style="margin-right:20rpx;"></text>
				<text class="grace-h5 grace-white">提交成功</text>
			</graceHeaderAlert>
			<graceHeaderAlert ref="graceHeaderAlert2" background="#FF0036" :width="500">
				<text class="grace-h5 grace-white">X 提交失败</text>
			</graceHeaderAlert>
			<graceHeaderAlert ref="graceHeaderAlert3" background="#FF0036" :width="500">
				<text class="grace-h5 grace-white">请输入反馈内容</text>
			</graceHeaderAlert>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import { mapGetters, mapActions, mapState } from "vuex"
import graceHeaderAlert from '../../graceUI/components/graceHeaderAlert.vue';

export default{
	data() {
		return {
			feedBackText: ''
		}
	},
	computed: {
		...mapGetters(['role','userInfo'])
	},
	methods:{
		...mapActions(['feedBack']),
		openComment:function () {
			this.$refs.graceComment.open();
			this.$refs.graceComment.setAt('GraceUI');// 设置 at 信息
		},
		commitClick : function (e) {
			console.log(this.feedBackText);
			// 评论数据以对象形式报错在 e 变量内，您可以连接 api 进行后续的功能开发
			// e.at - at 用户昵称
			// e.content 评论内容 , 可以此处进行字数验证
			// e.img 评论图片, 临时地址，可以结合 api 进行上传
			
			if (this.feedBackText.length > 0) {
				this.feedBack({content: this.feedBackText}).then(res => {
					this.$refs.graceHeaderAlert1.open();
				}).catch(() => {
					this.$refs.graceHeaderAlert2.open();
				})
			} else {
				this.$refs.graceHeaderAlert3.open();
			}
		}
	},
	onLoad: function (){},
	components:{
		gracePage
	}
}
</script>
<style lang="scss">	
.input-view {
	margin-top: 20rpx;
	padding: 20rpx;
	background: white;

}
.textarea {
	width:  686rpx;
	height: 400rpx;

	font-size: 30rpx;
	font-family: SourceHanSansSC;
	font-weight: 500;
	color: #333333;
}
.commit-view {
	display: flex;
	justify-content: right;
	margin-top: 20rpx;
	.commit-btn {
		margin-right: 10rpx;
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
	}
}

</style>