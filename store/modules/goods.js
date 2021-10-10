export default {
  namespace: true,
  state: {
    categories: [],
    curCateId: null,
    goods: {},
    selectedGoods: []
  },
  mutations: {
    setCategoryList (state, data) {
      state.categories = data
    },
    setCurCateId (state, data) {
      state.curCateId = data
    },
    setGoods (state, data) {
      state.goods = { ...state.goods, [state.curCateId]: data}
    },
    setSelectedGood (state, data) {
      const index = state.selectedGoods.findIndex(({ id }) => +data.id === +id)
      if (data.num > 0 && index > -1) {
        state.selectedGoods.splice(index, 1, data)
      } else if (data.num > 0 && !(index > -1)) {
        state.selectedGoods.push(data)
      } else if (!(data.num > 0) && index > -1) {
        state.selectedGoods.splice(index, 1)
      }
    },
    clearSelectedGoods (state, data) {
      state.selectedGoods = []
    }
  },
  actions: {
    fetchCategoryList ({ commit, dispatch, rootGetters }, payload) {
      this.http.get('apiv1/goods/category_list', 
      {
        customer_id: rootGetters.userInfo.id,
        status: 0,
        ...payload
      }).then(res => {
        const items = res.data.items || []
        if (items.length > 0) {
          commit('setCategoryList', items)
          dispatch('fetchGoodsById', items[0].id)
        }
      })
    },
    fetchGoodsById ({ commit }, id) {
      commit('setCurCateId', id)
      this.http.get(`apiv1/goods/category_goods/${id}`, { is_admin: false, tatus: 0,}).then(res => {
        commit('setGoods', res.data.items || [])
      })
    },
    clearSelectedGoods ({ commit },) {
      commit('clearSelectedGoods')
    }
  },
  getters: {
	selectedGoodTotalPrice (state) {
		return state.selectedGoods.reduce((r, { num, sale_price }) => {
		  return r + num * sale_price
		}, 0)
	},
    selectedGoodSum (state) {
      return state.selectedGoods.reduce((r, { num }) => {
        return r + num
      }, 0)
    },
    curSwiper (state, getters) {
      if (state.categories && getters.curCateIndex > -1 && state.categories[getters.curCateIndex] && state.categories[getters.curCateIndex].image_uris) {
        return state.categories[getters.curCateIndex].image_uris.map(img => ({ img }))
      }
      return []
    },
    curCateIndex (state) {
      return state.categories.findIndex(({ id }) => id == state.curCateId )
    },
    categoryList(state) {
      return state.categories.map(({id, name}) => {
        return { id, name }
      })
    },
    goodMap (state) {
      let ret = {}
      for (const key in state.goods) {
        if (state.goods.hasOwnProperty(key)) {
          ret[key] = state.goods[key].map((_good) => {
            let num = 0
            const good = state.selectedGoods.find(item => +item.id === +_good.id)
            if (good) {
              num = good.num
            }
            return { ..._good, avatar: _good.image_uris[0], desc: _good.memo, num }
          })
        }
      }
      return ret
    }
  }
}