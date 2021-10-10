<template>
	<view class="l-chat">
		
		<view class="l-chat-main">
			<view class="l-chat-body " @tap="onChatClick">
				<scroll-view 
				scroll-y="true" 
				class="l-char-scroll" 
				scroll-with-animation
				:class="{ 'l-char-scroll-height': isScrollHeight }"
				:scroll-top="chatScrollTop">
					<view class="l-char-scroll-content">
						<view class="l-char-empty">
							已经没有聊天记录了~
						</view>
						<view class="l-chat-item" 
						v-for="(s, i) in chatList" :key="i"
						:class="{ 'l-chat-mine': s.content.from_id !== thouUsername }">
							<!-- 时间 -->
							<view class="l-chat-item-time">
								{{ s.ctime_ms | formatTime }}
							</view>
							<!-- 聊天内容 -->
							<view class="l-chat-item-content">
								<!-- 头像 -->
								<view class="l-chat-avatar">
									<image class="l-chat-img-avatar" 
									v-if="s.content.from_id == thouUsername"
									@tap="$nav({ url: '/pages/info/info?type=single' })"
									:src="singleInfoAvatar" mode="aspectFill"></image>
									<image class="l-chat-img-avatar" 
									v-else
									:src="jimUserInfoAvatar" mode="aspectFill"></image>
								</view>
								<view class="l-chat-view">
									<!-- 用户名/昵称 -->
									<view class="l-chat-name">
										{{ s.content.from_id !== thouUsername ? (jimUserInfo.nickname || jimUserInfo.username) : (singleInfo.nickname || singleInfo.username)}}
									</view>
									<!-- 信息展示 text/img/ -->
									<template v-if="s.content.msg_type === 'text'">
										<view
										v-if="s.content.msg_body.extras && s.content.msg_body.extras.isEmoji" 
										class="l-chat-text">
											<image
											:src="'../../static/img/emoji/' + emojiAllJson[s.content.msg_body.text]" 
											mode="aspectFit" 
											class="l-icon-emoji-m"></image>
										</view>
										<view  class="l-chat-text" v-else>
											{{ s.content.msg_body.text || '' }}
										</view>
									</template>
									<template v-else-if="s.content.msg_type === 'image'">
										<view>
											<image
											@tap="previewImage(s.content.msg_body.image)"
											v-if="s.content.msg_body.type"
											:src="s.content.msg_body.image" 
											:style="{
												'max-width': '250rpx',
												width: s.content.msg_body.width,
												height: s.content.msg_body.height
											}"
											mode="aspectFit" 
											class="l-upload-img"></image>
											<image
											v-else
											@tap="previewImage(jimLocalhost + s.content.msg_body.media_id)"
											:src="jimLocalhost + s.content.msg_body.media_id" 
											:style="{
												'max-width': '250rpx',
												width: s.content.msg_body.width,
												height: s.content.msg_body.height
											}"
											mode="aspectFit" 
											class="l-upload-img"></image>
										</view>
									</template>
									<template v-else>
										<view>
										
										</view>
									</template>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- 输入框 -->
			<view class="l-chat-posi">
				<view class="l-chat-foot">
					<view class="l-chat-form">
						<textarea class="l-chat-textarea" 
						v-model="content" 
						fixed 
						@focus="onFocus"
						auto-height 
						placeholder="请输入" 
						:cursor-spacing="20" />
					</view>
					<view class="l-chat-handle">
						<image class="l-send-emoji" 
						@tap="isEmoji = !isEmoji"
						:src="'../../static/' + (isEmoji ? 'l-chat-jianpan.png' : 'l-chat-emoji.png')" 
						mode="aspectFill"></image>
						<view class="l-chat-send">
							<image class="l-send-upload" 
							@tap="isUpload = !isUpload"
							:class="{ 'l-send-upload-50': !content.length }"
							src="../../static/l-chat-send-upload.png" mode="aspectFill"></image>
							<button class="l-chat-send-btn "
							 :class="{ 'l-chat-send-btn-100': content.length }"
							 @tap="submit" type="default">发送</button>
						</view>
					</view>
				</view>
				
				<view
				:class="{ 'l-chat-emoji-height': isEmoji }"
				class="l-chat-emoji-item">
					<swiper :indicator-dots="true" >
						<swiper-item v-for="(s, i) in emojiList" :key="i">
							<view class="l-swiper-item">
								<image 
								@tap="sendEmojiItem(emoji)"
								v-for="(emoji, index) in s" :key="index"
								:src="'../../static/img/emoji/' + emoji.url" mode="aspectFit" 
								class="l-icon-emoji"></image>
							</view>
						</swiper-item>
					</swiper>
				</view>
				
				<view 
				:class="{ 'l-chat-emoji-height': isUpload }"
				class="l-chat-emoji-item l-chat-head-upload">
					<swiper :indicator-dots="false" >
						<swiper-item >
							<view class="l-swiper-item">
								<image class="l-upload-img" @tap="chooseImage" src="../../static/l-upload-img.png" mode="aspectFill"></image>
								<image class="l-upload-img" @tap="chooseMessageFile" src="../../static/l-upload-file.png" mode="aspectFill"></image>
							</view>
						</swiper-item>
					</swiper>
				</view>
				
			</view>
		</view>
		
		<!-- <pop-is-login></pop-is-login> -->
	</view>
</template>

<script>
	import { emoji } from '@/utils/emoji.js'
	export default{
		data(){
			return {
				isEmoji: false,
				isUpload:false,
				emojiList: emoji,
				isVoice:true,
				isPop: true,
				ifHaveMore:false,
				hideEmoji:false,
				voiceTis:'按住 说话',
				content: '',
				chatScrollTop: 9999999,
				thouUsernameAppkey: '',
				thouUsername: '', // 对方的username
				thouNickName: '',
				
				scrollViewStyle: '',
				value:'“世界很复杂，百度更懂你”，百度翻译拥有网页版和手机APP等多种产品形态，此外还针对开发者提供开放云接口服务，日均响应上亿次翻译请求。除文本翻译外，结合用户多样性的翻译需求，推出网页翻译、网络释义、海量例句、权威词典、离线翻译、语音翻译、对话翻译、实用口语、拍照翻译、AR翻译、趣味配音等功能，同时还针对对译文质量要求较高的用户，提供人工翻译服务，让用户畅享每一次翻译体验。'
			}
		},
		computed:{
			isScrollHeight(){
				return this.isUpload || this.isEmoji
			},
			isEmpty(){
				return !this.content.length
			},
			hasJMLogin(){
				return this.$store.getters.hasJMLogin;
			},
			syncConversation(){
				return this.$store.getters.syncConversation;
			},
			conversation(){
				return this.$store.getters.conversation;
			},
			chatList(){
				return this.$store.getters.chatList;
			},
			singleInfo(){
				return this.$store.getters.singleInfo;
			},
			jimUserInfo(){
				return this.$store.getters.jimUserInfo;
			},
			jimLocalhost(){
				return this.$config.jimLocalhost
			},
			singleInfoAvatar(){
				return this.singleInfo.avatar 
				? this.$config.jimLocalhost + this.singleInfo.avatar 
				: this.$config.$defaultAvatar;
			},
			jimUserInfoAvatar(){
				return this.jimUserInfo.avatar
				? this.$config.jimLocalhost + this.jimUserInfo.avatar 
				: this.$config.$defaultAvatar;
			},
			emojiAllJson(){
				return this.$emojiAllJson
			}
		},
		onLoad(e) {
			this.thouUsername = e.username || '';
			if(this.hasJMLogin){
				this.$store.dispatch('jimGetSingleInfo', this.thouUsername);
			}
		},
		watch:{
			hasJMLogin(n){
				if(n){
					this.$store.dispatch('jimGetSingleInfo', this.thouUsername)
				}
			},
			chatList(n){
				console.log(n)
				this.setChatScrollTop()
			},
			singleInfo(n){
				if(n.nickname || n.username){
					uni.setNavigationBarTitle({
						title: n.nickname || n.username
					})
				}
			},
			isUpload(n){
				if(n){
					if(this.isEmoji){
						this.isEmoji = !this.isEmoji
					}
				}
			},
			isEmoji(n){
				if(n){
					if(this.isUpload){
						this.isUpload = !this.isUpload
					}
				}
			}
		},
		onReady() {
		},
		onUnload() {
			this.$store.dispatch('jimGetConversation')
		},
		methods:{
			chooseImage(){
				let _this = this;
				uni.chooseImage({
					count: 1,
					success(res) {
						let tempFilePaths = res.tempFilePaths[0];
						uni.getImageInfo({
							src: tempFilePaths,
							success(info){
								console.log(info)
								_this.sendImageItem(tempFilePaths,info)
							}
						})
						
					}
				})
			},
			chooseMessageFile(){
				this.$toast('正在努力开发中,敬请期待!')
				return
				uni.chooseMessageFile({
					count:1,
					success(res){
						console.log(res)
					}
				})
			},
			submit(){
				if(this.isEmpty){
					this.$toast('请先输入内容')
					return
				}
				let params = {
					content: this.content,
					appkey: this.singleInfo.appkey,
					target_username: this.singleInfo.username,
					target_nickname: this.singleInfo.nickname
				}
				this.$store.dispatch('jimSendSingleMsg', params);
				this.content = '';
			},
			previewImage(urls){
				uni.previewImage({
					urls: [urls],
					success() {
						
					}
				})
			},
			sendImageItem(tempFilePaths, info){
				let params = {
					type: 'image',
					width: info.width,
					height: info.height,
					image: tempFilePaths,
					appkey: this.singleInfo.appkey,
					target_username: this.singleInfo.username,
					target_nickname: this.singleInfo.nickname
				}
				this.$store.dispatch('sendSinglePic', params);
				this.content = '';
				if(this.isUpload){
					this.isUpload = !this.isUpload
				}
			},
			onFocus(e){
				this.setChatScrollTop()
			},
			onChatClick(){
				if(this.isEmoji){
					this.isEmoji = !this.isEmoji
				}
				if(this.isUpload){
					this.isUpload = !this.isUpload
				}
			},
			sendEmojiItem(item){
				let params = {
					content: item.alt || '',
					extras: {
						isEmoji:true
					},
					appkey: this.singleInfo.appkey,
					target_username: this.singleInfo.username,
					target_nickname: this.singleInfo.nickname
				}
				this.$store.dispatch('jimSendSingleMsg', params);
				this.content = '';
				if(this.isEmoji){
					this.isEmoji = !this.isEmoji
				}
			},
			setChatScrollTop(){
				setTimeout(() => {
					this.chatScrollTop += 1;
				},200)
			},
			onSyncConversation() {
			  
			},
			getConversation() {
			    
			},
		}
	}
</script>

<style scoped>
	@import url("./style.css");
</style>
