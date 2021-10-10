var graceJS = require('@/Grace.JS/grace.js');

export const defaultUserInfo = () => {
	let storageData = {}
	if(graceJS.getStorage('userInfo_object') && typeof(graceJS.getStorage('userInfo_object')) === 'string') {
		storageData = JSON.parse(graceJS.getStorage('userInfo_object'))
	}
	return {
		'code': '',// 被邀请码
		'address': "",
		'address_receipt': "",
		'address_shipping': "",
		'avatar': '', // require('@/static/avatar@2x.png'),
		'category': [],
		'certificate': "",
		'contact': "",
		'culture': "",
		'id': null,
		'im_username': "",
		'introduction': "",
		'invite_code': "",
		'invite_user_id': 0,
		'invite_user_type': 0,
		'mobile': "",
		'name': "",
		'open_id': "",
		'sign_in_method': "",
		'signin_time': "",
		'signin_user_type': "",
		'status': 0,
		'tel': "",
		...storageData,
	}
}

export default {
	namespace: true,
	state: {
		userInfo: {
			...defaultUserInfo(),
			id: graceJS.getStorage('id'),
			signin_user_type: graceJS.getStorage('signin_user_type'),
			user_roles: graceJS.getStorage('user_roles')
			
		},
		hasLogin: null
	},
	mutations: {
		setUserInfo(state, userInfo) {
			state.userInfo = { ...this.userInfo,
				...userInfo
			}
		},
		clearUserInfo(state) {
			state.userInfo = defaultUserInfo()
		},
		login(state, data) {
			state.hasLogin = true
		},
		logout(state, data) {
			state.hasLogin = false;
			state.userInfo = defaultUserInfo()
			graceJS.removeStorage('access_token')
			graceJS.removeStorage('userInfo_object')
		},
		updateAvatar(state, data) {
			state.userInfo.avatar = data
			if(data) {
				// graceJS.setStorage( {avatar: data})
				graceJS.setStorage({userInfo_object: JSON.stringify(state.userInfo)})
			}
		},
		updateUserInfo(state, data) {
			if(data.avatar){
				state.userInfo.avatar = data.avatar
			}
			if(data.name) {
				state.userInfo.name = data.name // 客户端和 供应商是name； 用户user端是username
				state.userInfo.username = data.name
			}
			if(data.mobile) {
				state.userInfo.mobile = data.mobile
			}
			graceJS.setStorage({userInfo_object: JSON.stringify(state.userInfo)})
		},
			saveH5InviteCode(state, data) {
				state.userInfo.code = data.code
				graceJS.setStorage({userInfo_object: JSON.stringify(state.userInfo)})
		}
	},
	actions: {
		bindPhone({
			commit
		}, params) {
			return this.http.post(`member/user/bindPhone`, params)
				.then(data => {
					commit('setUserInfo', data)
				})
		},
		getUserInfo({
			commit
		}, params) {
			return this.http.get(
				'apiv1/user/info',
				params
			).then(res => {
				console.log('userInfo=', res);
				// commit('setUserInfo', res.data)
				return res
			});
		},
		login({
			commit
		}, params) {
			graceJS.removeStorage('access_token');
			return this.http.post(
				'apiv1/user/signin/mobile',
				params
			).then(res => {
				console.log('login=', res);
				commit('setUserInfo', res.data)
				commit('login')
				graceJS.setStorage(res.data)
				graceJS.setStorage({userInfo_object: JSON.stringify(res.data)})
				return res
			});
		},
		loginWithWeixin({
			commit
		}, params) {
			graceJS.removeStorage('access_token');
			return this.http.post(
				'apiv1/user/signin/thirdparty',
				params
			).then(res => {
				console.log('login=', res);
				commit('setUserInfo', res.data)
				commit('login')
				graceJS.setStorage(res.data)
				graceJS.setStorage({userInfo_object: JSON.stringify(res.data)})
				return res
			});
		},
		logout({ commit }) {
			commit('logout')
		},
		bindWeixin({ commit, state, getters }, params){
			let role = getters.role
			console.log('canshu=', params)
			if(role === 'customer') {
				return this.http.post('apiv1/customer/bind_wechat', {
					user_id: parseInt(state.userInfo.id),
					...params
				}).then(res => {
					return res
				})
			} else if(role === 'supplier') {
				return this.http.post('apiv1/supplier/bind_wechat', {
					user_id: parseInt(state.userInfo.id),
					...params
				}).then(res => {
					return res
				})
			} else {
				return this.http.post('apiv1/user/bind_wechat', {
					user_id: parseInt(state.userInfo.id),
					...params
				}).then(res => {
					return res
				})
			}
			
			
		},
		systemMessage({ commit, state, getters }, params) {
			return this.http.get('apiv1/system_record/list', {
				user_id: state.userInfo.id,
				user_type: getters.role.indexOf('seller') > -1 ? 'user' : getters.role, 
				...params
			}).then(res => {
				return res
			})
		},
		iosReview({ commit, state, getters }, params) {
			return this.http.get('apiv1/kv/item', {
				item_key: 'apple_review',
				app_type: 'iOS', 
				// version:  '1.0.2',
				...params
			}).then(res => {
				return res
			})
		},
		update({ commit }, params) {
			return this.http.get('apiv1/app/get_version', {
				app_type: 'android',
				...params
			}).then(res => {
				return res
			})
		},
		saveUserToken({ commit, state, getters }, params) {
			return this.http.post('apiv1/push/save_user_token', {
				user_id: parseInt(state.userInfo.id),
				user_type: state.userInfo.signin_user_type,
				...params
			}).then(res => {
				return res
			})
		},
		updateUserInfo({ commit, state, getters }, params) {
			return this.http.post('apiv1/user/update/info', {
				user_id: parseInt(state.userInfo.id),
				user_type: state.userInfo.signin_user_type,
				...params
			}).then(res => {
				if (res.code === 20000) {
					commit('updateUserInfo', params)
				}
				return res
			})
		},
		updateUserAvatar({ commit, state, getters }, params) {
			return this.http.post('apiv1/user/update/info', {
				user_id: parseInt(state.userInfo.id),
				user_type: state.userInfo.signin_user_type,
				...params
			}).then(res => {
				if (res.code === 20000) {
					commit('updateAvatar', params.avatar)
				}
				return res
			})
		},
		statisticsCustomerData({ commit, state}, params) {
			return this.http.get('apiv1/statistic/customer_data',{
				customer_id: parseInt(state.userInfo.id),
			}).then(res => {
				return res
			})
		},
		statisticsUserData({ commit, state}, params) {
			return this.http.get('apiv1/statistic/user_data',{
				user_id: parseInt(state.userInfo.id),
			}).then(res => {
				return res
			})
		},
		statisticsSupplierData({ commit, state}, params) {
			return this.http.get('apiv1/statistic/supplier_data',{
				supplier_id: parseInt(state.userInfo.id),
			}).then(res => {
				return res
			})
		},
		// 获取柱状图信息
		// GET /apiv1/statistic/user_single_index_data
		user_single_index_data({ commit, state}, params) {
			return this.http.get('apiv1/statistic/user_single_index_data',{
				user_id: parseInt(state.userInfo.id),
				user_type: state.userInfo.signin_user_type,
				index_name: params.index_name, // order_count(成交订单数) customer_count(成交客户数) sales_count(成交销售额度) profit_count(收益总额度)
				start_time: params.start_time,
				end_time: params.end_time,
				unit: params.unit // unit: day or month
			}).then(res => {
				return res
			})
		},
		feedBack({ commit, state}, params) {
			// POST /apiv1/feedback/insert
			return this.http.post('apiv1/feedback/insert',{
				// user_id: parseInt(state.userInfo.id),
				// user_type: state.userInfo.signin_user_type,
				// index_name: params.index_name, // order_count(成交订单数) customer_count(成交客户数) sales_count(成交销售额度) profit_count(收益总额度)
				// start_time: params.start_time,
				// end_time: params.end_time,
				// unit: params.unit // unit: day or month
				content: params.content,
				sizeCache: {},
				state: {},
				unknownFields: {},
				user_id: parseInt(state.userInfo.id),
				user_type: state.userInfo.signin_user_type,
			}).then(res => {
				return res
			})
		}
	},
	getters: {
		role(state) {
			const { signin_user_type, user_roles }  = state.userInfo
			if (signin_user_type === 'user') {
				if (user_roles && user_roles.length > 0) {
					return (user_roles.indexOf("external_seller") > -1) ? 'external_seller' : 'seller'
				} else {
					return 'seller'
				}
			}
			return signin_user_type
		},
		auth(state) {
			return state.userInfo.id !== ''
		},
		isSyncAccount(state) {
			return state.userInfo.phone
		},
		hasLogin(state) {
			return state.hasLogin
		},
		userInfo(state) {
			return state.userInfo
		}
	}
}
