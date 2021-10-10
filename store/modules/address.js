export default {
	namespace: true,
	state: {
		addressList: [],
		selectAddress: null
	},
	mutations: {
		setAddressList(state, data) {
			state.addressList = data
		},
		setSelectAddress(state, data) {
			state.selectAddress = data
		}
	},
	actions: {
		saveAddress({
			commit
		}, params) {
			return this.http.post(
				'apiv1/shipping_info/upsert',
				params
			).then(res => {
				return res
			});
		},
		addressList({
			commit
		}, params) {
			return this.http.get(
			    'apiv1/shipping_info/list', 
				params
			).then(res => {
				commit('setAddressList', res.data.items)
				return res
			})
		},
		getAddressList(ctx) {
			ctx.dispatch('addressList', {
				user_id: ctx.rootGetters.userInfo.id,
				user_type: 'customer'
			})
		},
		setSelectAddress({ commit }, data) {
			commit('setSelectAddress',data)
		}
	},
	getters: {
		defaultAddress(state) {
			if (!state.addressList || (state.addressList && state.addressList.length === 0)) {
				return null
			} else {
				let defaultItem = state.addressList.find(item => item.default)
				return defaultItem
			}
		},
		selectAddress(state) {
			console.log('selectAdrress1 ', state.addressList, state.selectAddress)
			
			if(state.addressList && state.selectAddress) {
				let findIndex = state.addressList.findIndex(item => item.id === state.selectAddress.id)
				console.log('selectAdrress ', findIndex, state.selectAddress.id)
				if (findIndex !== -1) {
					return state.selectAddress
				} else {
					return null
				}
				
			} else {
				return null
			}
		}
	}
}
	
	