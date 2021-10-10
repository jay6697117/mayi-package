
	export default {
		timeFormat: (timestamp = null, fmt = 'yyyy-mm-dd') => {
			// 其他更多是格式化有如下:
			// yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合
			timestamp = parseInt(timestamp);
			// 如果为null,则格式化当前时间
			if (!timestamp) timestamp = Number(new Date());
			// 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
			if (timestamp.toString().length == 10) timestamp *= 1000;
			let date = new Date(timestamp);
			let ret;
			let opt = {
				"y+": date.getFullYear().toString(), // 年
				"m+": (date.getMonth() + 1).toString(), // 月
				"d+": date.getDate().toString(), // 日
				"h+": date.getHours().toString(), // 时
				"M+": date.getMinutes().toString(), // 分
				"s+": date.getSeconds().toString() // 秒
				// 有其他格式化字符需求可以继续添加，必须转化成字符串
			};
			for (let k in opt) {
				ret = new RegExp("(" + k + ")").exec(fmt);
				if (ret) {
					console.log(k, ret, opt[k]);
					fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
				};
			};
			return fmt;
		},
		Year: (year) => {
		  var time = new Date();
		  time.setDate(time.getDate());//获取Day天后的日期 
		  var y = time.getFullYear() + year;
		  var m = time.getMonth();
		  var d = time.getDate();
		  // let str = y + "-" + m + "-" + d;
		  // return str
		  return Date.parse(new Date(y, m, d));
		},
		Month: (month) => {
		  var time = new Date();
		  time.setDate(time.getDate());//获取Day天后的日期 
		  var y = time.getFullYear();
		  var m;
		  if (time.getMonth() + month + 1>12){
		    y = y+1;
		    m = time.getMonth() + month - 11;//获取当前月份的日期 d
		  }else{
		    m = time.getMonth() + month + 1;//获取当前月份的日期 d
		  }
		  var d = time.getDate();
		  // let str = y + "-" + m + "-" + d;
		  // return str
		  return Date.parse(new Date(y, m-1, d));
		  
		 }
	}