// import axios from 'uni-axios'
// import store from  '../store/index.js';

const graceJS = require('@/Grace.JS/grace.js');
// const isDev = process.env.NODE_ENV === 'development'
// const baseURL = isDev ? DEV : PRO
import { baseURL } from '@/utils/ipConfig.js'



export const createHttp = baseURL => ({
	
	get : function(url, data, success, fail){
		if(!fail){fail = () => {graceJS.msg("网络请求失败");}}
		const headers = {
			"x-client-type": 'mobile'
		}
		let token = graceJS.getStorage('access_token')
		if (token) {
			headers['x-token'] = token
		}
		
		if (!success) {
			return new Promise((resolve, reject) => {
				graceJS.get(
					baseURL + url,
					data,
					headers,
					function (res) {
						if(res.code !== 20000) {
							if(res.code === 50008) { // 非法token 重新登录
								// store.dispatch('logout')
								// store.dispatch('jimLoginOut')
								uni.reLaunch({
								    url: '/pages/user/login'
								});
								return
							} else {
								// if(res.code !== 60001) {
									uni.showToast({
										title: res.message,
										icon: 'none',
										duration: 2000
									})
									return
								// }
								
							}
						}
						resolve(res)
					},
					function (err) {
						fail()
						reject(err)
					}
				);
			})
		}
		graceJS.get(
			baseURL + url,
			data,
			headers,
			success,
			fail
		);
	},
	// post
	post : function(url, data, success, fail){
		const contentType = "json"
		const headers = {
			"x-client-type": 'mobile'
		}
		if(!fail){fail = () => {graceJS.msg("网络请求失败");}}
		let token = graceJS.getStorage('access_token')
		if (token) {
			headers['x-token'] = token
		}
		if (!success) {
			return new Promise((resolve, reject) => {
				graceJS.post(
							baseURL + url,
							data,
							contentType,
							headers,
							function (res) {
								if(res.code !== 20000) {
									if(res.code === 50008) { // 非法token 重新登录
										// store.dispatch('logout')
										// store.dispatch('jimLoginOut')
										uni.reLaunch({
										    url: '/pages/user/login'
										});
										return
									} else {
										uni.showToast({
											title: res.message,
											icon: 'none',
											duration: 2000
										})
										return
									}
								}
								resolve(res)
							},
							function (err) {
								fail()
								reject(err)
							}
				);
			})
		}
		graceJS.post(
					baseURL + url,
					data,
					contentType,
					headers,
					success,
					fail
				);
	},
})

export default createHttp(baseURL)


// const http = {axios.create({
//   baseURL: isDev ? DEV : PRO,
//   timeout: 3000
// }})
// http.interceptors.request.use(
//   config => {
//     const token = uni.getStorageSync('token')
//     if (token) {
//       // fixed: config.headers为undefined，只能直接设置headers
//       config.headers = { 'Authorization': `Bearer ${token}` }
//     }
//     config.url = config.baseURL + config.url
//     console.log(`${config.url}请求数据`, config)
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )
// /**
//  * 错误处理的几种情况：
//  * 1. http状态码错误
//  * 2. 返回值状态码错误
//  * 2.1 身份错误
//  * 2.2 其他错误
//  */
// http.interceptors.response.use(
//   response => {
//     if (response.status !== 200) {
//       return Promise.reject(response)
//     }
//     if (response.data['access_token']) {
//       uni.setStorageSync('token', response.data['access_token'])
//     }
//     return response.data
//   },
//   error => {
//     console.log('error =', error, 'status =', error.response, 'errorMsg=',error.message)
//     const { status } = error.response
//     if (status !== 401) {
//       uni.showToast({ title: error.response.data.message, icon: 'none' })
//     }
//     return Promise.reject(error.response.data)
//   }
// )
// export default http
