const regExp = {
	// 是否是汉字 
	isHanzi(str){
		let reg = /\p{Unified_Ideograph}/ug;
		return reg.test(str);
	},
	// 是否是字母数字
	isStringAndNumber(str){
		let regNumber = new RegExp(/^[0-9A-Za-z]+$/);
		return regNumber.test(str)
	}
}

export default regExp;