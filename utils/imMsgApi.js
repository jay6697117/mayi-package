const jimMsg = {
	getSingleMsg(chatList = [], chatInfoList = [], userInfo){
		let object = {};
		let _chatList = chatList.map(e => e.username); // 消息列表
		let _chatInfoList = chatInfoList.map(e => e.from_username); // 离线消息列表
		let index = _chatList.indexOf(userInfo.username);
		if(index === -1){ // 消息列表没找到 ，消息列表chatlist赋值一个对象
			object.isfind = false;
			object._chatInfoList = null;
			object._chatList = {
				name: userInfo.username,
				username: userInfo.username,
				appkey: userInfo.appkey,
				type: 3,
				mtime: new Date().getTime(),
				avatar: userInfo.avatar,
				nickName: userInfo.nickName,
				extras: userInfo.extras,
				unread_msg_count: 0
			}
		}else{ // 消息列表找到了
			let _index = _chatInfoList.indexOf(userInfo.username);
			if(_index === -1){ // 未读列表没找到
				object.isfind = false;
				object._chatInfoList = null;
				object._chatList = {
					name: userInfo.username,
					username: userInfo.username,
					appkey: userInfo.appkey,
					type: 3,
					mtime: new Date().getTime(),
					avatar: userInfo.avatar,
					nickName: userInfo.nickName,
					extras: userInfo.extras,
					unread_msg_count: 0
				}
			}else{ // 消息列表和未读列表都找到了 才算找到 
				object.isfind = true;
				object._chatList = null;
				object._chatInfoList = chatInfoList[_index].msgs || [];
			}
		}
		return object;
	},
	getGroupMsg(chatList = [], chatInfoList = [], userInfo){
		console.log('chatList===',chatList,'chatInfoList===',chatInfoList)
		let object = {};
		let _chatList = chatList.map(e => parseInt(e.gid)); // 消息列表
		let _chatInfoList = chatInfoList.map(e =>parseInt(e.from_gid)); // 离线消息列表
		let index = _chatList.indexOf(userInfo.gid);
		console.log('查找聊天记录',index, userInfo.gid, _chatList)

		if(index === -1){ // 消息列表没找到 ，消息列表chatlist赋值一个对象
			object.isfind = false;
			object._chatInfoList = null;
			object._chatList = {
				gid: userInfo.gid,
				name: userInfo.name,
				appkey: userInfo.appkey,
				type: 4,
				mtime: new Date().getTime(),
				avatar: userInfo.avatar,
				nickName: userInfo.nickName,
				extras: userInfo.extras,
				unread_msg_count: 0
			}
		}else{ // 消息列表找到了
			let _index = _chatInfoList.indexOf(userInfo.gid);
			console.log('查找离线聊天记录',_index)
			if(_index === -1){ // 未读列表没找到
				object.isfind = false;
				object._chatInfoList = null;
				object._chatList = {
					name: userInfo.name,
					gid: userInfo.gid,
					appkey: userInfo.appkey,
					type: 4,
					mtime: new Date().getTime(),
					avatar: userInfo.avatar,
					nickName: userInfo.nickName,
					extras: userInfo.extras,
					unread_msg_count: 0
				}
			}else{ // 消息列表和未读列表都找到了 才算找到 
				object.isfind = true;
				object._chatList = null;
				object._chatInfoList = chatInfoList[_index].msgs || [];
			}
		}
		return object;
	},
	// 消息列表 和 离线消息列表 比较，如果消息列表中 有离线相同的用户，以离线的最后一条消息为准
	formatConversation(chatList = [], chatInfoList = []){
		chatList.forEach(e => {
			chatInfoList.forEach(el => {
				if ((e.type === 3 && e.username === el.from_username) || (e.type === 4 && e.gid === el.from_gid)){
					let msgs = el.msgs || [];
					let content = msgs[msgs.length - 1] && msgs[msgs.length - 1].content || null;
					if(content){
						let types = content.msg_type === 'text' ? '1' : content.msg_type === 'image' ? '2' : '3';
						let txt = ''
						if(types == 1){
							txt = content.msg_body.text || ''
						}else if(types == 2){
							txt = '[图片]'
						}else{
							if(content.msg_body.extras.isVoice){
								txt = '[录音]'
							}else{
								txt = '[文件]'
							}
						}
						e.content = txt
					}
				}
			})
		})
		return chatList;
	},
	formatMsgInfo(jimUserInfo = {}, params = {},res = {}, target_type){
		console.log('jimUserInfo=-==-=',jimUserInfo, params,res, target_type)
		let content = {
			from_type: "user",
			from_id: jimUserInfo.username,
			set_from_name: 0,
			target_appkey: params.appkey,
			target_name: params.target_username,
			create_time: new Date().getTime(),
			from_appkey: jimUserInfo.appkey,
			target_type: target_type,
			from_platform: "web",
			target_id: params.target_username,
			from_name: jimUserInfo.nickname,//jimUserInfo.username,
			version: 1,
			msg_body: {
				...params,
				text: params.content,
				extras: params.extras
			},
			msg_type: params.type || "text"
		}
		let msgInfo = {
			ctime_ms: res.ctime_ms,
			from_appkey: params.appkey,
			from_username: params.target_username,
			msg_type: target_type === 'single'? 3 : 4,
			need_receipt: false,
			custom_notification: {
				alert: '',
				at_prefix: '',
				title: '',
				enabled: ''
			},
			msg_id: res.msg_id,
			msg_level: res.msg_level || 0,
			content
		}
		return msgInfo
	},
	formatMsgInfoReceive(msg){
		// let content = msg.content;
		// let msgInfo = {
		// 	from_appkey: content.from_appkey,
		// 	from_username: content.from_id, // from_username 用 form_id代替
		// 	from_gid: msg.from_gid,
		// 	ctime_ms: msg.ctime_ms,
		// 	msg_type: msg.msg_type, // 消息类型 3单聊 4群聊
		// 	need_receipt: false,
		// 	custom_notification: {
		// 		alert: '',
		// 		at_prefix: '',
		// 		title: '',
		// 		enabled: ''
		// 	},
		// 	msg_id: msg.msg_id,
		// 	msg_level: msg.msg_level,
		// 	content
		// }
		// return msgInfo
		return msg
	}
}


export default jimMsg