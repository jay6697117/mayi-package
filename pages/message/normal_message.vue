<template>
	<view>
		<view class="SegmentedControlIn">
			<graceSegmentedControl :items="cates" :current="current" @change="change"></graceSegmentedControl>
		</view>
		<!-- 聊天 -->
		<scroll-view v-if="current === 0" scroll-y class="grace-list grace-margin-top" :style="{height:scrollHeight+'px'}">
			<view class="grace-list-items grace-body" 
			v-for="(s, index) in conversation" :key="index" 
			 @tap="navChat(s)">
				<view class="grace-list-image grace-relative">
					<image class="grace-list-image" :src="s.avatar ? s.avatar :defaultHeader" mode="widthFix"></image>
					
					<view class="grace-badge-point" v-if="s.unread_msg_count"></view>
				</view>
				<view class="grace-list-body grace-border-b">
					<view class="grace-list-title">
						<!-- 标题信息 -->
						<text class="grace-list-title-text">
						{{ s.nickName || s.username || s.name || '' }}
						</text>
						<!-- 时间 -->
						<text class="grace-list-title-desc">
							{{ s.mtime | formatTime }}
						</text>
					</view>
					<!-- 描述信息 -->
					<view class="grace-list-body-desc">
						{{ s.content || '' }}
					</view>
				</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
			<graceEmpty v-if="conversation.length === 0">
				<view slot="img" class="empty-view">
					<!-- 请根据您的项目要求制作并更换为空图片 -->
					<image class="empty-img" mode="widthFix" src="https://staticimgs.oss-cn-beijing.aliyuncs.com/empty.png"></image>
				</view>
				<text slot="text" class="grace-text-small grace-gray">抱歉，暂无聊天数据</text>
			</graceEmpty>
		</scroll-view>
		<!-- 通讯录 -->
		<view v-if="current === 1" class="grace-list grace-body">
			<view class="grace-list-items" v-for="(item,index) in systemImGroup" :key="index" @tap="navChat(item)">
				<view class="grace-list-image">
					<image class="grace-list-image" src="/static/img/message_system.png" mode="widthFix"></image>
				</view>
				<view class="grace-list-body grace-border-b">
					<view class="grace-list-title">
						<text class="grace-list-title-text">{{item.name}}</text>
					</view>
					<view class="grace-list-body-desc">{{item.desc}}</view>
				</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
			<graceEmpty v-if="systemImGroup.length === 0">
				<view slot="img" class="empty-view">
					<!-- 请根据您的项目要求制作并更换为空图片 -->
					<image class="empty-img" mode="widthFix" src="https://staticimgs.oss-cn-beijing.aliyuncs.com/empty.png"></image>
				</view>
				<text slot="text" class="grace-text-small grace-gray">抱歉，暂无通讯录数据</text>
			</graceEmpty>
		</view>
		<!-- 系统消息 -->
		<view v-if="current === 2" class="grace-list grace-body">
			<view class="grace-list-items" v-for="(item,index) in systemMessageList" :key="index">
				<view class="grace-list-image">
					<image class="grace-list-image" src="/static/img/message_keFu.png" mode="widthFix"></image>
				</view>
				<view class="grace-list-body grace-border-b">
					<view class="grace-list-title">
						<text class="grace-list-title-text">{{item.title}}</text>
						<text class="grace-list-title-desc">{{item.created_at}}</text>
					</view>
					<view class="grace-list-body-desc">提醒内容：{{ item.content}}</view>
				</view>
			</view>
			<graceEmpty v-if="systemMessageList.length === 0">
				<view slot="img" class="empty-view">
					<!-- 请根据您的项目要求制作并更换为空图片 -->
					<image class="empty-img" mode="widthFix" src="https://staticimgs.oss-cn-beijing.aliyuncs.com/empty.png"></image>
				</view>
				<text slot="text" class="grace-text-small grace-gray">抱歉，暂无系统消息数据</text>
			</graceEmpty>
		</view>
	</view>
</template>
<script>
	import { mapGetters } from 'vuex'
	import { getUserGroup } from "@/http/jiGuangIM";
	import gracePage from "../../graceUI/components/gracePage.vue";
	import graceSegmentedControl from '../../graceUI/components/graceSegmentedControl.vue';
	import graceEmpty from "../../graceUI/components/graceEmptyNew.vue";

	var graceJS = require("../../Grace.JS/grace.js");
export default {
    data() {
    	return {
			cates : ["聊天","通讯录", "系统消息"],
			current : 0,
			scrollHeight : 500,
			defaultHeader: 'https://graceui.oss-cn-beijing.aliyuncs.com/faces/1.png',
			systemImGroup: [
			],
			systemMessageList: []
		}
    },
	computed:{
		...mapGetters(['role', 'userInfo']),
		hasJMLogin(){
			return this.$store.getters.hasJMLogin;
		},
		syncConversation(){
			return this.$store.getters.syncConversation;
		},
		conversation(){ // 会话列表
			return this.$store.getters.conversation.reverse();
		}
	},
	onReady:function(){
		setTimeout(()=>{
			uni.createSelectorQuery().select('#gBody').fields(
				{size: true}, (res) => {
					this.scrollHeight = res.height - uni.upx2px(180);
				}
			).exec();
		},1000);
		
	},
	beforeMount: function() {
		this.getImGroupList()
		this.getSystemMessage()
    },
	methods:{
		getImGroupList() {
			getUserGroup({
				user_id: this.userInfo.id, 
				user_type: this.role.indexOf('seller') > -1 ? 'user' : this.role, 
			}).then((res) => {
				console.log('res=', res)
				this.systemImGroup = res.data.items
			})
		},
		getSystemMessage() {
			this.$store.dispatch('systemMessage', {
				page: 1,
				limit: 99
			}).then((res) => {
				console.log('ststem messge', res)
				if (res.data.items && res.data.items.length > 0){
					this.systemMessageList = res.data.items.map(item => {
						item.created_at = graceJS.toDate(item.created_at, 'str')
						return item
					})
				}
			})
		},
		change : function(e){
			this.current = e;
		},
		navChat(s){
			if (s.type === 3) {
				uni.navigateTo({
					url: '/pages/message/chat?username=' + s.username
				})
			}else{
				uni.navigateTo({
					url: '/pages/message/chatGroup?gid=' + s.gid
				})
			}

		},
		onShowMethod() {
			console.log('自定义方法 messge normal on show')
			this.getImGroupList()
			this.getSystemMessage()
		}
	},
	onShow() {
		console.log('不执行 messge normal on show')
	},
	components:{gracePage,graceSegmentedControl,graceEmpty}
}
</script>
<style>
.SegmentedControlIn{width:500rpx; padding:0 125rpx; margin-top:38rpx;}
.empty-view{width:280rpx; height:280rpx; border-radius:280rpx; background-color:#F6F7F8; margin-top:300rpx;}
.empty-img{width:220rpx; height:200rpx; margin:40rpx; border-radius:200rpx;}
.grace-text-small{margin-top:10px;}
</style>