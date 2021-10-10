import { createHttp } from "@/utils/http";

// const http = createHttp('http://api.myxpack.com/apiv1/')
import { baseURL } from '@/utils/ipConfig.js'
const http = createHttp(baseURL + 'apiv1/')

const validate = ({ name, phone, license, mobile_code }) => {
	if (!name) {
		uni.showToast({
			icon: 'none',
			title: '主体信息不能为空'
		})
		return false
	}
	if (!phone) {
		uni.showToast({
			icon: 'none',
			title: '手机号码不能为空'
		})
		return false
	}
	if (!license.length) {
		uni.showToast({
			icon: 'none',
			title: '证件照片不能为空'
		})
		return false
	}
	if (!mobile_code.length) {
		uni.showToast({
			icon: 'none',
			title: '验证码不能为空'
		})
		return false
	}
	
	var myreg=/^[1][0-9]{10}$/;
	if (!myreg.test(phone)){
		uni.showToast({ title: '请正确填写手机号码', icon : "none"});
		return false;
	}
	return true
}
const validate_invite_code = ({ phone, invite_code }) => {
	if (!phone) {
		uni.showToast({
			icon: 'none',
			title: '手机号码不能为空'
		})
		return false
	}
	if (!invite_code.length) {
		uni.showToast({
			icon: 'none',
			title: '邀请码不能为空'
		})
		return false
	}
	
	var myreg=/^[1][0-9]{10}$/;
	if (!myreg.test(phone)){
		uni.showToast({ title: '请正确填写手机号码', icon : "none"});
		return false;
	}
	return true
}

export const applyCustomer = (params) => {
	if(!validate(params)) {
		return Promise.reject()
	}
	return http.post('user/apply', {
	  apply_type: 'customer',
	  certificate: params.license,
	  name: params.name,
	  mobile: params.phone,
	  mobile_code: params.mobile_code
	}).then(res => {
		console.log('res', res.data)
		return res.data
	})
}

export const applySupplier = (params) => {
	if(!validate(params)) {
		return Promise.reject()
	}
	return http.post('user/apply', {
	  apply_type: 'supplier',
	  certificate: params.license,
	  name: params.name,
	  mobile: params.phone,
	  mobile_code: params.mobile_code
	}).then(res => {
		console.log('res', res.data)
		return res.data
	})
}

export const applySeller = (params) => {
	// if(!validate(params)) {
	// 	return Promise.reject()
	// }
	return http.post('user/apply', {
	  apply_type: 'external_seller',
	  // certificate: params.license,
	  name: params.name,
	  mobile: params.phone,
	  invite_user_id: params.invite_user_id,
	  mobile_code: params.mobile_code
	}).then(res => {
		console.log('res', res.data)
		return res.data
	})
}
export const byInviteCode = (params) => {
	if(!validate_invite_code(params)) {
		return Promise.reject()
	}
	return http.get('user/info/by_invite_code', {
	  invite_code: params.invite_code,
	}).then(res => {
		console.log('res', res.data)
		return res.data
	})
}