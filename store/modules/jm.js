import jpushIM from '@/utils/jim.js'
import utils from '@/utils/utils.js'
import config from '@/utils/config.js'
import jimMsg from '@/utils/imMsgApi.js'

export default {
	namespace: true,
	state: {
		jimLoginInfo: null,
		hasJMLogin: null,
		jimUserInfo: {},
		isJimInit: false,
		syncConversation: [],
		conversation: [],
		chatList: [],
		singleInfo: {}
	},
	mutations: {
		jimLogin(state, data){
			state.hasJMLogin = true;
		},
		jimInit(state, data){
			console.log('im初始化 state=', data)
			state.isJimInit = data;
		},
		jimLoginOut(state, data){
			state.hasJMLogin = false;
			state.jimUserInfo ={};
			state.isJimInit = false;
			state.syncConversation = [];
			state.conversation = [];
			state.chatList = [];
			state.singleInfo = {};
			utils.$setStorage('jimLoginInfo', '');
		},
		jimGetUserInfo(state, data){
			state.jimUserInfo = data;
		},
		setHasJMLogin(state, data){
			state.hasJMLogin = data;
		},
		jimOnSyncConversation(state, data){
			if(Object.prototype.toString.call(data) === "[object Array]"){
				state.syncConversation = data;
			}else{
				state.syncConversation = [];
			}
		},
		jimGetConversation(state, data){
			if(Object.prototype.toString.call(data) === "[object Array]"){
				data.forEach(e => { e.content = '' })
				state.conversation = data;
			}else{
				state.conversation = [];
			}
		},
		jimGetSingleMsg(state, data){
			if(data.isfind){
				state.chatList = data._chatInfoList; // 赋值到 要找的消息列表
			}else{
				state.conversation.unshift(data._chatList); // 没找到消息 给消息列表首位增加一个刚发送消息的对象
				state.chatList = [];
			}
		},
		jimGetGroupMsg(state, data){
			if(data.isfind){
				state.chatList = data._chatInfoList; // 赋值到 要找的消息列表
			}else{
				state.conversation.unshift(data._chatList); // 没找到消息 给消息列表首位增加一个刚发送消息的对象
				state.chatList = [];
			}
		},
		jimSetSingleInfo(state, data){
			state.singleInfo = data;
		},
		jimSendMsgAdd(state, data){
			let from_username = data.from_username;
			let from_gid = data.from_gid || data.content.msg_body.target_gid;
			let appkey = data.from_appkey;
			let list = state.syncConversation.map(e => e.from_username);
			let listGid = state.syncConversation.map(e => Number(e.from_gid));

			let index = list.indexOf(from_username)
			let indexGroup = listGid.indexOf(from_gid)
			console.log('data=',data, 'from_gid =', from_gid,'list =',list, 'listGid=',listGid)

			if(!!from_username && index != -1){
				console.log("AAAAAAAAAAAA",index, from_username)
				state.syncConversation[index].msgs.push(data);
			}else if(!!from_gid && indexGroup !== -1){
				console.log("BBBBBBBBBBBBBB")
				state.syncConversation[indexGroup].msgs.push(data);
			}else
			{
				let syncConversation = {
					from_username: from_username,
					from_appkey: appkey,
					from_gid: from_gid,
					msg_type: data.msg_type,
					receipt_msgs: [],
					unread_msg_count: 0,
					msgs: [data]
				};
				state.syncConversation.push(syncConversation);
			}
			console.log(`state.syncConversation`, state.syncConversation)
		},
		jimGetConversationFormat(state, data){
			state.conversation = data;
		}
	},
	actions: {
		jimInit(ctx) {
			console.log('action init')
			jpushIM.init()
				.then(res => {
					let inter = setInterval(() => {
						if (jpushIM.isInit() || number > 20) {
							clearInterval(inter);
							ctx.commit('jimInit', true);
						} else {
							number++;
						}
					}, 200)
				})
		},
		jimGetSingleInfo(ctx, data) { // 发送完消息后调用 
			ctx.state.chatList = []
			if (data) {
				let params = {
					username: data
				};
				jpushIM.getUserInfo(params)
					.then(res => {
						if (res.code == 0) {
							let user = res && res.user_info || {
								username: data
							}
							ctx.dispatch('jimGetSingleMsg', user)
						}
					})
			}
		},
		jimGetGroupInfo(ctx, data) { // 发送完消息后调用 
			ctx.state.chatList = []
			if (data) {
				let params = {
					gid: data
				};
				jpushIM.getGroupInfo(params)
					.then(res => {
						if (res.code == 0) {
							let user = res && res.group_info || {
								gid: data
							}
							ctx.dispatch('jimGetGroupMsg', user)
						}
					})
			}
		},
		jimResetUnreadCount(ctx, data) {
			let params = {
				username: data.username,
				appkey: data.appkey,
				gid: data.gid
			}
			jpushIM.resetUnreadCount(params)
			ctx.dispatch('jimUpdateConversation', data)
		},
		jimUpdateConversation(ctx, data) {
			let params = {
				username: data.username,
				appkey: data.appkey,
				gid: data.gid
			}

			jpushIM.updateConversation(params)
		},
		jimGetSingleMsg(ctx, user) {
			let chatList = jimMsg.getSingleMsg(ctx.state.conversation, ctx.state.syncConversation, user);
			ctx.commit('jimGetSingleMsg', chatList); 
			ctx.commit('jimSetSingleInfo', user); 
			ctx.dispatch('jimResetUnreadCount', user)
		},
		jimGetGroupMsg(ctx, group) {
			let chatList = jimMsg.getGroupMsg(ctx.state.conversation, ctx.state.syncConversation, group);
			ctx.commit('jimGetGroupMsg', chatList); 
			ctx.commit('jimSetSingleInfo', group); 
			ctx.dispatch('jimResetUnreadCount', group)
		},
		jimLoginOut(ctx) {
			jpushIM.loginOut();
			ctx.commit('jimLoginOut'); // 会清空IM登陆 相关标记状态
			// utils.$toast("IM退出成功");
			setTimeout(() => {
				console.log('IM init状态', jpushIM.isInit())
				if (!jpushIM.isInit()) {
					// jpushIM.init()
					ctx.dispatch('jimInit') // 可以标记 初始化状态
				}
			}, 500)
		},
		jimLogin(ctx, data) {
			utils.$setStorage('jimLoginInfo', data);
			jpushIM.login(data)
				.then(res => {
					ctx.commit('jimLogin');
					ctx.dispatch('jimGetUserInfo', data.username)
					ctx.dispatch('jimOnSyncConversation') // 离线消息列表同步监听
					ctx.dispatch('jimOnMsgReceive')  // 聊天消息实时监听
					ctx.dispatch('jimGetConversation')//获取会话列表
					// utils.$toast('登录成功')
					console.log('IM 登录成功')
				})

		},
		jimGetConversation(ctx) { // 获取会话列表
			jpushIM.getConversation()
				.then(res => {
					if (res.code == 0) {
						let conversations = res.conversations || [];
						conversations.forEach(e => {
							e.avatar = e.avatar ? config.jimLocalhost + e.avatar : config.$defaultAvatar
						})
						ctx.dispatch('jimGetConversationFormat', conversations)
					}
				})
		},
		jimOnMsgReceive(ctx) { // 聊天消息实时监听
			jpushIM.onMsgReceive(res => {
				let msgs = res.messages || [];
				if (msgs && msgs[0]) {
					let msg = jimMsg.formatMsgInfoReceive(msgs[0])
					ctx.commit('jimSendMsgAdd', msg)
					ctx.dispatch('jimGetConversation')
				}
			})
		},
		jimGetConversationFormat(ctx, data) {
			let conversation = jimMsg.formatConversation(data, ctx.state.syncConversation);
			ctx.commit('jimGetConversationFormat', conversation)// 更新会话列表
		},
		jimOnSyncConversation(ctx) {
			jpushIM.onSyncConversation()
				.then(res => {
					ctx.commit('jimOnSyncConversation', res)
				})

		},
		jimRegister(ctx, data) {
			jpushIM.register(data)
				.then(res => {
					console.log(res)
					utils.$toast('注册成功')
				})

		},
		jimGetUserInfo(ctx, data) {
			let params = {
				username: data
			}

			jpushIM.getUserInfo(params)
				.then(res => {
					if (res.code == 0) {
						let user = res && res.user_info || {
							username: data
						}
						ctx.commit('jimGetUserInfo', user);
					}
				})
		},
		jimUpdateSelfInfo(ctx, data) {
			let params = data;
		
			jpushIM.updateSelfInfo(params)
				.then(res => {
					console.log(res)
					if (res.code == 0) {
						ctx.dispatch('jimGetUserInfo', ctx.state.jimUserInfo.username)
					}
				})
		},
		jimUpdateSelfPwd(ctx, data) {
			let object = utils.$json(data);
			let params = data;
			jpushIM.updateSelfPwd(params)
				.then(res => {
					if(res.code == 0){
						let jimLoginInfo = utils.$getStorage('jimLoginInfo');
						if(jimLoginInfo.username){
							jimLoginInfo.password = object.new_pwd;
							utils.$setStorage('jimLoginInfo', jimLoginInfo);
						}
					}
				})
		},
		jimSendSingleMsg(ctx, data) {
			let params = data;
			jpushIM.sendSingleMsg(params)
				.then(res => {
					if (res.code == 0) {
						let jimUserInfo = ctx.state.jimUserInfo;
						let msgInfo = jimMsg.formatMsgInfo(jimUserInfo, params, res, 'single')
						ctx.commit('jimSendMsgAdd', msgInfo)
						if(!ctx.state.chatList.length){
							setTimeout(() => {
								ctx.dispatch('jimGetSingleInfo', data.target_username)
							}, 500)
						}
					}
				})
		},
		sendSinglePic(ctx, data) {
			let params = data;
			jpushIM.sendSinglePic(params)
				.then(res => {
					console.log(res)
					if (res.code == 0) {
						let jimUserInfo = ctx.state.jimUserInfo;
						let msgInfo = jimMsg.formatMsgInfo(jimUserInfo, params, res, 'single')
						ctx.commit('jimSendMsgAdd', msgInfo)
						if(!ctx.state.chatList.length){
							setTimeout(() => {
								ctx.dispatch('jimGetSingleInfo', data.target_username)
							}, 500)
						}
					}
				})
		},
		jimSendGroupMsg(ctx, data) {
			let params = data;
			jpushIM.sendGroupMsg(params)
				.then(res => {
					if (res.code == 0) {
						let jimUserInfo = ctx.state.jimUserInfo;
						let msgInfo = jimMsg.formatMsgInfo(jimUserInfo, params, res, 'group')
						ctx.commit('jimSendMsgAdd', msgInfo)
						if(!ctx.state.chatList.length){
							setTimeout(() => {
								ctx.dispatch('jimGetGroupInfo', data.target_gid)
							}, 500)
						}
					}
				})
		},
		sendGroupPic(ctx, data) {
			let params = data;
			jpushIM.sendGroupPic(params)
				.then(res => {
					console.log(res)
					if (res.code == 0) {
						let jimUserInfo = ctx.state.jimUserInfo;
						let msgInfo = jimMsg.formatMsgInfo(jimUserInfo, params, res, 'group')
						ctx.commit('jimSendMsgAdd', msgInfo)
						if(!ctx.state.chatList.length){
							setTimeout(() => {
								ctx.dispatch('jimGetGroupInfo', data.target_gid)
							}, 500)
						}
					}
				})
		},
		updateSelfAvatar(ctx, data) {
			
			let params = {
				avatar: data
			}
			jpushIM.updateSelfAvatar(params)
			.then(res => {
				if(res.code == 0){
					ctx.dispatch('jimGetUserInfo', ctx.state.jimUserInfo.username)
				}
			})
		}
	},
	getters: {
		hasJMLogin(state){
			return state.hasJMLogin
		},
		jimUserInfo(state){
			return state.jimUserInfo
		},
		isJimInit(state){
			return state.isJimInit
		},
		syncConversation(state){
			return state.syncConversation
		},
		conversation(state){
			return state.conversation
		},
		chatList(state){
			return state.chatList
		},
		singleInfo(state){
			return state.singleInfo
		},
	}

}