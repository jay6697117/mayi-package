const $nav = (option, str) => {
	option = option ? option : {};
	try {
		str = str ? str : 'navigateTo'
		uni[str]({
			url: option.url,
			success() {
				option.success && option.success();
			},
			fail() {
				option.fail && option.fail();
			},
			complete() {
				option.complete && option.complete();
			}
		})
	} catch (e) {
		//TODO handle the exception
	}
}

const $back = (delta, option) => {
	option = option ? option : {};
	try {
		uni.navigateBack({
			delta: delta || 1,
			success() {
				option.success && option.success();
			},
			fail() {
				option.fail && option.fail();
			},
			complete() {
				option.complete && option.complete();
			}
		})
	} catch (e) {
		//TODO handle the exception
	}
}

const $setStorage = (key, value) => {
	if (!key) {
		throw new Error('请填写正确的key值');
	}
	try {
		uni.setStorageSync(key, value);
	} catch (e) {
		//TODO handle the exception
		throw e
	}
}

const $getStorage = (key) => {
	if (!key) {
		throw new Error('请填写正确的key值');
	}
	try {
		return uni.getStorageSync(key);
	} catch (e) {
		//TODO handle the exception
		throw e
	}
}

const $toast = (str, option) => {
	if (!str) {
		throw new Error('请填写正确的提示');
	}
	option = option ? option : {};
	uni.showToast({
		title: str,
		icon: 'none',
		duration: option.duration ? option.duration : 2000
	})
}

const $showModal = (str, option) => {
	if (!str) {
		throw new Error('请填写正确的提示');
	}
	option = option ? option : {};
	uni.showModal({
		title: option.title ? option.title : '提示',
		content: str,
		confirmText: option.confirmText || '确定',
		success(res) {
			if (res.confirm) {
				option.success && option.success()
			} else {
				option.error && option.error()
			}
		}
	})
}

const $formatting = (str) => {
	let date = new Date(str);
	let nowD = new Date();
	let now = [nowD.getFullYear(),nowD.getMonth()+1,nowD.getDate()].map(e => e > 9 ? e : '0' + e).join('/');
	let ymd = [date.getFullYear(),date.getMonth()+1,date.getDate()].map(e => e > 9 ? e : '0' + e).join('/');
	if(now === ymd){
		return [date.getHours(), date.getMinutes(), date.getSeconds()].map(e => e > 9 ? e : '0' + e).join(':');
	}
	return ymd + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].map(e => e > 9 ? e : '0' + e).join(':');
}



const $pageList = (num = 2) => {
	let pages = getCurrentPages();
	console.log(pages)
	let page = pages[pages.length - num];
	// #ifdef H5
	return page;
	// #endif
	// #ifndef H5
	return page.$vm;
	// #endif
}

const $json = (obj) => {
	return typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : obj;
}

export default {
	$nav,
	$back,
	$json,
	$toast,
	$pageList,
	$showModal,
	$setStorage,
	$getStorage,
	$formatting
}
