import { queryProfitList } from '@/http/order'
export default {
  state: {
    profit: [],
    page: 1
  },
  mutations: {
    refreshProfit (state, { list }) {
      state.profit = list
    },
    fetchProfit (state, { list }) {
      state.profit = state.profit.concat(list)
    },
    setPage(state, data) {
      state.page = data
    }
  },
  actions: {
    refreshProfit({ rootState, commit }) {
      commit('setPage', 1)
      return queryProfitList({
        page: 1,
        user_type: rootState.user.userInfo.signin_user_type,
        user_id: rootState.user.userInfo.id,
      }).then(({ items }) => {
        if (!items) {
		    	commit('refreshProfit', { list: [] })
          return Promise.reject()
        }
		    commit('setPage', 2)
        commit('refreshProfit', { list: items })
      }).catch(err => {
        console.log(err)
      })
    },
    fetchProfit({ rootState, commit, state }) {
      return queryProfitList({
          page: state.page,
          user_type: rootState.user.userInfo.signin_user_type,
          user_id: rootState.user.userInfo.id,
      }).then(({ items }) => {
        if (!items) {
          return Promise.reject()
        }
        commit('setPage', state.page + 1)
        commit('fetchProfit', { list: items })
      })
    }
  }
}