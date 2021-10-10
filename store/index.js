import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/utils/http'

const modules = {}
const files = require.context('./modules', false, /\w+.js$/)
files.keys().forEach(fileName => {
  // 获取模块
  const file = files(fileName)
  // 获取组件名称，去除文件名开头的 `./` 和结尾的扩展名
  const name = fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules[name] = file.default || file
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules,
  plugins: [
    store => {
      store.http = http
    }
  ]
})
