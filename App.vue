<script>
	import jpushIM from '@/utils/jim.js'
	import { compareVersion } from '@/utils/methods.js'
/* 如果您不使用 nvue ，请打开 App-不使用nvue.vue 文件复制全部内容覆盖本页代码 */
export default {
	watch: {
		isJimInit(n){ // 判断自动登陆 ，逻辑可能需要补充修改
			console.log('JM init change')
			if(n){
				console.log('JM init change success')
				let userInfo = this.$store.getters.userInfo
				console.log('userinfo=', userInfo, this.isLogin)
				if(this.isLogin) {
					let params = {
						username: userInfo.im_username,
						password: 'mayi123456',
						is_md5: false
					}
		    		this.$store.dispatch('jimLogin', params);
				} else {
					
				}
			} else {
				console.log('JM init change', n)
			}
		},
		isLogin(val){
			if(val){
				let userInfo = this.$store.getters.userInfo
				console.log('userinfo=', userInfo, this.isLogin)
				let params = {
						username: userInfo.im_username,
						password: 'mayi123456',
						is_md5: false
					}
		    	this.$store.dispatch('jimLogin', params);
			}
		}
	},
	computed:{
		jimLoginInfo(){ // IM登陆信息
			return this.$getStorage('jimLoginInfo')
		},
		isJimInit(){
			return this.$store.getters.isJimInit
		},
		isLogin(){ // 应用是否登陆
			return this.$store.getters.hasLogin
		},
		userInfo() {
			return this.$store.getters.userInfo
		}
		
	},
	onLaunch: function(option) {
		console.log('on launch', option, option.query.code)
		if(option && option.query && option.query.code) {
	    	this.$store.commit('saveH5InviteCode', {code: option.query.code});
		}
		// 判断是否已经登陆
		if(this.userInfo.id && this.userInfo.access_token){
			uni.switchTab({url: '/pages/index/index'})
		}


		//初始化 极光IM
		this.buildJiGuang()

		// #ifdef APP-PLUS
		plus.screen.lockOrientation('portrait-primary'); //锁定屏幕
		const dom = weex.requireModule('dom');
		dom.addRule('fontFace', {
			'fontFamily': "graceIconfont",
			'src': "url('https://at.alicdn.com/t/font_823462_j9mcrej0wrk.ttf')"
		});
		// #endif
		
		// 推送
		// #ifdef APP-PLUS  
			const _self = this;  
			const _handlePush = function(message) {  
				// TODO  
				console.log('接到通知=',message)
			};  
			plus.push.addEventListener('click', _handlePush);  
			plus.push.addEventListener('receive', _handlePush);  
		// #endif  
	},
	onShow: function() {
		console.log('on show')		
		// 获得手机平台信息
		uni.getSystemInfo({
			success:(res) => {
				//检测当前平台，如果是安卓则启动安卓更新  
				console.log('平台信息',res)
				if(res.platform=="android"){  
					// 检查版本更新
					this.AndroidCheckUpdate();  
				}  
				// 推送信息管理
				this.pushCliendIdManage(res.platform)
			}  
		})
	},
	onHide: function() {},
	methods: {
		buildJiGuang() { // 极光IM相关
			//初始化 极光IM
			this.$store.dispatch('jimInit')

			// 断线监听
			// let self = this
			jpushIM.onDisconnect((res) => {
				console.log('断线了', res)
				// 重新登陆初始化IM， init之后 会被监听到如果为true然后自动登陆
				this.$store.commit('jimInit', false)
				this.$store.dispatch('jimInit')
			})
			uni.$on('disconnect', () => {
				console.log('uni.$on disconnect 手动监听断线')
				// 重新登陆初始化IM， init之后 会被监听到如果为true然后自动登陆
				this.$store.commit('jimInit', false)
				this.$store.dispatch('jimInit')
			})
		},
		AndroidCheckUpdate() { // 安卓版本更新
			// 设置 app 当前版本
			plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
				console.log(JSON.stringify(wgtinfo));
				console.log('应用版本号', wgtinfo.version);//应用版本号
				let currentVersion = wgtinfo.version
				
				// 版本检查
				this.$store.dispatch('update').then(res => {
					console.log(res);
					console.log('比较版本',res.data.version, currentVersion, compareVersion(res.data.version, currentVersion));
					if(compareVersion(res.data.version, currentVersion) === 1){
			
						if(res.data.force_update) {
							uni.reLaunch({
								url:'../update/update'
							})	
						} else {
							uni.navigateTo({
								url:'../update/update'
							})
						}
				
					}
				})
			})
			
		},
		pushCliendIdManage(platform) {
			// #ifdef APP-PLUS
			var info = plus.push.getClientInfo();
			console.log("设备info = ", info);
			// 测试数据
			// if(!info) {
			// 	info = {
			// 		id: "unipush",
			// 		token: "ab2b167680346c2fb526da118edee157",
			// 		clientid: "ab2b167680346c2fb526da118edee157",
			// 		appid: "bY4tCbbB0i8kE9nJHx2ke3",
			// 		appkey: "0Rb1gBztsv7xCET9LyeJW4"
			// 	}
			// }
			if( info && info.clientid && this.userInfo.id) {
				this.$store.dispatch('saveUserToken',{
					device_token: info.clientid,
					device_type: platform
				}).then(res=>{
					console.log('push Token bind =', res)
				}).catch(error=>{
					console.log('push Token bind  error =', error)
				})
			}
			// #endif
		}
	}
		
}
</script>
<style>
/* 如果您是新项目基于 GraceUI 3.0 请删除 20行的旧项目向下兼容样式引入代码 */
/* @import "./graceUI/graceUI2.2.css"; */

/* #ifndef APP-PLUS-NVUE */
@import "./graceUI/graceUI.css";
@import "./graceUI/graceIcons.css";
/* #endif */

/* #ifdef APP-PLUS-NVUE */
@import "./graceUI/graceWeex.css";
.grace-icons{font-family:graceIconfont;}
/* #endif */

/* 如下修改和补充能够保证不修改 GraceUI 框架的核心源码，当 GraceUI 升级时可以直接使用框架核心文件包覆盖旧文件
请根据业务原型或者设计稿规划出自己的 公共样式, 如: */
.color-black{color:#333333;}
.color-red{color:#FF0036;}
/*
修改 graceUI 或者其他 UI 框架，如, 修改 grace-title:
*/
.grace-title{color:#333333;}
/* 可以利用条件编译编写不同平台的样式 如 : 修改导航组件 */
/* #ifndef APP-PLUS-NVUE */
navigator{opacity:1; background:none;}
.navigator-hover{background-color:none; opacity:0.8;}
/* #endif */

page{background-color:#F6F7F8;}
</style>