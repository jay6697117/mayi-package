import date from '@/utils/date.js'

export const formatPrice = (value, fixed = 2) => {// 会四舍五入
  return (value / 100).toFixed(fixed)
}
export const formatPriceWithString = (value, fixed = 2) => { // 不四舍五入
  return Number((value/100).toString().match(/^\d+(?:\.\d{0,2})?/))
}

export const formatDate = (date, split = '-') => {
  if (typeof date === 'string') {
    // ios微信/Safari中new Date()格式化时间为NaN，把字符串格式转化为2018-05-31T00:00:00
    date = date.replace(' ', 'T')
  }
  const _date = new Date(date)
  let year = _date.getFullYear()
  let month = _date.getMonth() + 1
  let day = _date.getDate()

  return [year, month.toString().padStart(2, '0'), day.toString().padStart(2, '0')].join(split)
}
export const formatDateSecond = (date, split = '-') => {
  if (typeof date === 'string') {
    // ios微信/Safari中new Date()格式化时间为NaN，把字符串格式转化为2018-05-31T00:00:00
    date = date.replace(' ', 'T')
  }
  const _date = new Date(date * 1000)
  let year = _date.getFullYear()
  let month = _date.getMonth() + 1
  let day = _date.getDate()

  return [year, month.toString().padStart(2, '0'), day.toString().padStart(2, '0')].join(split)
}

export const formatTime = (time) => {
  const _date = new Date(time * 1000)
  let year = _date.getFullYear()
  let month = _date.getMonth() + 1
  let day = _date.getDate()
  let hour = _date.getHours()
  let minute = _date.getMinutes()

  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

export const formatOrderStatus = (status) => {
  switch (+status) {
    case 1:
      return '待审核' // '已创建'
    case 2:
      return '待接单' // '已生效'
    case 3:
      return '待接单'
    case 4:
      return '已接单' // '已接收'
    case 5:
      return '生产中'
    case 6:
      return '生产完成'
    case 7:
      return '待派送'
    case 8:
      return '派送中'
    case 9:
      return '已签收'
    case 10:
      return '已完成'
    case -1:
      return '无效'
    case -2:
      return '拒绝接单'
    case -3:
      return '拒绝签收'
  }
}
export const formatCustomerOrderStatus = (status) => {
  switch (+status) {
    case 1:
      return '待接单' // '已创建'
    case 2:
      return '待接单' // '已生效'
    case 3:
      return '已接单' // 待接单
    case 4:
      return '已接单' // '已接收'
    case 5:
      return '生产中'
    case 6:
      return '生产完成'
    case 7:
      return '待派送'
    case 8:
      return '派送中'
    case 9:
      return '已签收'
    case 10:
      return '已完成'
    case -1:
      return '无效'
    case -2:
      return '拒绝接单'
    case -3:
      return '拒绝签收'
  }
}
export const formatYearMoneyData = (value, year) => {
	var currentYear = formatYear(value, year)
	if( value && value[currentYear]) {
		return value[currentYear]/100
	} else 
		return 0
}
export const formatYearData = (value, year) => {
	var currentYear = formatYear(value, year)
	if( value && value[currentYear]) {
		return value[currentYear]
	} else 
		return 0
}
export const formatMonthMoneyData = (value, monthD) => {
	var currentYear = formatMonth(value, monthD)
	if( value && value[currentYear]) {
		return value[currentYear]/100
	} else 
		return 0
}
export const formatMonthData = (value, monthD) => {
	var currentYear = formatMonth(value, monthD)
	if( value && value[currentYear]) {
		return value[currentYear]
	} else 
		return 0
}
export const formatMonth = (value, monthD) => {
	var current = date.timeFormat(new Date(), 'yyyy-mm')
	if (monthD) {
		current = date.timeFormat(date.Month(monthD), 'yyyy-mm')
	}
	return current
}
export const formatYear = (value, year) => {
	var current = date.timeFormat(new Date(), 'yyyy')
	if (year) {
		current = date.timeFormat(date.Year(year), 'yyyy')
	}
	return current
}
export default (Vue) => {
  Vue.filter('formatPrice', formatPrice)
  Vue.filter('formatDate', formatDate)
  Vue.filter('formatDateSecond', formatDateSecond)
  Vue.filter('formatTime2', formatTime)
  Vue.filter('formatOrderStatus', formatOrderStatus)
  Vue.filter('formatCustomerOrderStatus', formatCustomerOrderStatus)
  Vue.filter('formatYearMoneyData', formatYearMoneyData)
  Vue.filter('formatMonthMoneyData', formatMonthMoneyData)
  Vue.filter('formatYearData', formatYearData)
  Vue.filter('formatMonthData', formatMonthData)
  Vue.filter('formatYear', formatYear)
  Vue.filter('formatMonth', formatMonth)
}
