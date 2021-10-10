import Vue from 'vue'
import App from './App'
import http from '@/utils/http.js'
import store from './store/index.js'
import regExp from '@/utils/RegExp.js'
import utils from '@/utils/utils.js';
import config from '@/utils/config.js';
import jimMsg from '@/utils/imMsgApi.js';
import { emoji } from '@/utils/emoji.js'
import registerFilter from '@/utils/filters'
// var jweixin = require('jweixin-module')  

Vue.prototype.$http = http
Vue.prototype.$store = store
Vue.prototype.$appTypeNum = '2' // 1:supplier 供应商app, 2:注册包含用户和销售的app, 3:注册包含全部角色的app
Vue.prototype.$isH5Share = false // 是否是h5分享页面
Vue.prototype.$iosVersion = '1.0.4' // iOS审核版本号

registerFilter(Vue)

Vue.config.productionTip = false

App.mpType = 'app'

let emojiAllJson = {};
emoji.forEach(arr => {
	arr.forEach(e => {
		emojiAllJson[e.alt] = e.url;
	})
})
Vue.prototype.$emojiAllJson = emojiAllJson;
Vue.prototype.$jimMsg = jimMsg;
Vue.prototype.$regExp = regExp;
Vue.prototype.$config = config;
try{
	Object.keys(utils).forEach(e => {
		Vue.prototype[e] = utils[e];
	})
}catch(e){
	
}

Vue.filter('formatTime', utils.$formatting)


const app = new Vue({
	store,
    ...App
})
app.$mount()
