<template>
	<view class="qiun-columns">
		<view class="top_bg">
			
			<div class="num_show">
				<span v-if="userData && currentObjectType.priceOrPerson==='元'">
					¥ {{userData[currentObjectType.num_key]  | formatPrice}}
				</span>
				<span v-if="userData && currentObjectType.priceOrPerson!=='元'">
					{{userData[currentObjectType.num_key]}}	{{currentObjectType.priceOrPerson}}
				</span>
			</div>
			<div class="num_title">
                {{ currentObjectType.num_title }}
            </div>
		</view>
		<div class="select-view">
			<div class="select-btn-group">
				<div class="select-btn year" :class="{'select-active': form.unit==='month'}" @click="selcetTypeClick('month')">年</div>
				<div class="select-btn month" :class="{'select-active': form.unit==='day'}" @click="selcetTypeClick('day')">月</div>
			</div>
			<div>
				<graceDateTime v-if="form.unit==='month'" isYear @confirm="confirm1" :value="demo1Val">
					<text class="select-text grace-border-radius">{{demo1Val}}<text class="grace-icons icon-date icon-left-margin"></text></text>
				</graceDateTime>
				<graceDateTime  v-else @confirm="confirm2" :value="demo2Val" :isTime="false">
					<text class="select-text grace-border-radius">{{demo2Val}}<text class="grace-icons icon-date icon-left-margin"></text></text>
				</graceDateTime>
			</div>
		</div>
		<view class="qiun-charts" >
			<!--#ifdef MP-ALIPAY -->
			<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" disable-scroll=true @touchstart="touchColumn" @touchmove="moveColumn" @touchend="touchEndColumn"></canvas>
			<!--#endif-->
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" disable-scroll=true @touchstart="touchColumn" @touchmove="moveColumn" @touchend="touchEndColumn"></canvas>
			<!--#endif-->
		</view>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import  { isJSON } from '@/common/checker.js';
	import { mapGetters, mapActions, mapState } from "vuex"
	import graceDateTime from "../components/DateTimePickerView.vue";
	var _self;
	var canvaColumn=null;
   var graceJS = require('@/Grace.JS/grace.js');

	export default {
		data() {
			return {
				demo1Val:"请选择年",
				demo2Val:"请选择年月",
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				typeObjects: {
					order_count: {
						title: '成交订单数',
						priceOrPerson: '单',
						num_title:'累计成交订单数',
						num_key: 'total_deal_orders'
					},
					customer_count: {
						title: '成交客户数',
						priceOrPerson: '人',
						num_title:'累计成交客户总数',
						num_key: 'total_deal_customers'
					},
					sales_count: {
						title: '成交销售额度',
						priceOrPerson: '元',
						num_title:'累计成交销售额度',
						num_key: 'total_sales'
					},
					profit_count: {
						title: '收益总额度',
						priceOrPerson: '元',
						num_title:'累计收益总额',
						num_key: 'total_profit'
					}
				},
				userData: null,
				currentObjectType: null,
				form: {
					index_name: 'sales_count', // order_count(成交订单数) customer_count(成交客户数) sales_count(成交销售额度) profit_count(收益总额度)
					start_time: '1577808000', // 测试时间 2020-01-01 00:00:00
					end_time: Math.round(Date.now()/1000), //'1600955575',
					unit: 'month' // day or month
				}
			}
		},
		components:{graceDateTime},
		computed: {
			...mapGetters(['role','userInfo'])
		},
		onLoad(params) {
			if(params.type) {
				this.currentObjectType = this.typeObjects[params.type]
				uni.setNavigationBarTitle({
					title: this.currentObjectType.title
				});
				this.form.index_name = params.type
			}
			_self = this;
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function (res) {
					if(res.pixelRatio>1){
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio =2;
					}
				}
			});
			//#endif
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.getUserData()
			this.getData()
		},
		methods: {
			...mapActions(['user_single_index_data']),
			selcetTypeClick(type) {
				this.form.unit = type

				let now = new Date(); //当前日期 
				let nowMonth = now.getMonth(); //当前月 
				let nowYear = now.getFullYear(); //当前年 
				//本月的开始时间
				let monthStartDate = new Date(nowYear, nowMonth, 1); 
				let timeMonthStar=Date.parse(monthStartDate)/1000;//s

				//本月的结束时间
				// let monthEndDate = new Date(nowYear, nowMonth+1, 0);
				// var timeMonthEnd=Date.parse(monthEndDate)/1000;//s

				// 本年开始第一日
				let yearStartDate = new Date(nowYear, 1, 1)
				let timeYearStar=Date.parse(yearStartDate)/1000;//s


				if(type === 'day') { // 本月
					this.form.start_time = timeMonthStar
				} else { // 本年
					this.form.start_time = timeYearStar
				}
				this.getData()
			},
			getUserData() {
				 this.$http.get(`apiv1/statistic/user_data?user_id=${this.userInfo.id}`).then(({ data }) => {
					this.userData = data
				})
			},
			getData() {
				this.user_single_index_data({
					index_name: this.form.index_name,
					start_time: this.form.start_time,
					end_time: this.form.end_time,
					unit: this.form.unit // unit: day or month
				}).then(res => {
					let objects = res.data.data
					console.log(objects, '===1')
					if(!res.data.data) {
						res.data.data = {}
					}
					let keys = Object.keys(res.data.data)
					console.log(objects,keys,'===2')

					let values = keys.map(key => {
						return objects[key]
					})
					console.log(objects,keys,values,'====3')
					let Column={categories:[],series:[]};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					Column.categories= keys;
					if (this.currentObjectType.priceOrPerson === '元') { // 如果数据是金额， 则需要 格式化显示的金额
						values = values.map(item => {
							return (item / 100).toFixed(2)
						})
					}
					Column.series= [{name: "", data: values}];
					_self.showColumn("canvasColumn",Column);
				})
			},
			showColumn(canvasId,chartData){
				canvaColumn=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'column',
					fontSize:11,
					padding:[15,15,15,15],
					legend:{
						show:true,
						position:'top',
						float:'center',
						itemGap:30,
						padding:5,
						margin:5,
						//backgroundColor:'rgba(41,198,90,0.2)',
						//borderColor :'rgba(41,198,90,0.5)',
						borderWidth :1
					},
					dataLabel:true,
					dataPointShape:true,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					legend:{show:false}, // 不显示图例
					animation: true,
					enableScroll: true,
					xAxis: {
						disableGrid:false,
						type:'grid',
						gridType:'dash',
						itemCount:4,
						scrollShow:true,
						scrollAlign:'right',
					},
					yAxis: {
						//disabled:true
						gridType:'dash',
						splitNumber:4,
						min:10,
						max:180,
						format:(val)=>{return val.toFixed(0)+this.currentObjectType.priceOrPerson}//如不写此方法，Y轴刻度默认保留两位小数
					},
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						column: {
							type:'group',
							width: _self.cWidth*_self.pixelRatio*0.45/chartData.categories.length
						}
					},
				});
				
			},
			touchColumn(e){
				canvaColumn.scrollStart(e);
			},
			moveColumn(e) {
				canvaColumn.scroll(e);
			},
			touchEndColumn(e) {
				canvaColumn.scrollEnd(e);
				canvaColumn.touchLegend(e, {
					animation:true,
				});
				canvaColumn.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
					}
				});
			},
			confirm1:function (res) {
				this.demo1Val = res[0];
				// 选择当年 开始时间
				let yearStartDate = new Date(res[0], 1, 1)
				let timeYearStar = Date.parse(yearStartDate)/1000;//s
				this.form.start_time = timeYearStar
				
				if(res[0] === new Date().getFullYear()) {
					this.form.end_time = Math.round(Date.now()/1000)
				} else {
					let yearStartDate = new Date(res[0], 11, 31)
					console.log('year date',yearStartDate)
					// let string = this.demo1Val.toString() + '-12-31 00:00:00'
					// let timeEnd = graceJS.toTimeStamp(string);
					
					let timeYearStar = Date.parse(yearStartDate)/1000;//s
					this.form.end_time = timeYearStar
				}
				this.getData()
			},
			confirm2:function (res) {
				this.demo2Val = res[0]+'-'+res[1];
				
				// 选择当年 开始时间
				let yearStartDate = new Date(res[0], res[1]-1, 1)
				let timeYearStar = Date.parse(yearStartDate)/1000;//s
				this.form.start_time = timeYearStar
				
				let	currentTime = Math.round(Date.now()/1000)
				
				let endDate = new Date(res[0], res[1], 1)
				let timeEnd = Date.parse(endDate)/1000;//s
				this.form.end_time = timeEnd
				
				if (timeEnd > currentTime) {
					this.form.end_time = currentTime	
				}
				
				
				this.getData()
			},
		}
	}
</script>

<style lang="scss">
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
	.qiun-columns {
		.top_bg {
		  width: 750rpx;  
		//   height: 360rpx;
		  height: 300rpx;

		  background: rgba(54,105,174, 1);
		  color: #FFFFFF;
		  text-align: center;
		  width: 750rpx;
		  position: relative;
		  .num_show {
			padding-top: 107rpx;
			font-size: 48rpx;
			font-weight: bold;
		  }
		  .num_title {
			font-size: 24rpx;
		  } 
		}
		.select-view {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.select-btn-group {
				display: flex;
				margin: 40rpx 0;
				padding: 0 0 0 32rpx;
				.select-btn {
					margin-right: 10rpx;
					width: 120rpx;
					height: 60rpx;
					background: #F0F0F0;
					border: 2rpx solid #D8D8D8;
					border-radius: 20rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.select-active {
					background:  rgba(54,105,174, 1);
					color: #FFFFFF;
				}
			}
			.select-text{
				margin-right: 10rpx;
				display:block;
				width:358rpx;
				line-height:66rpx;
				background-color:rgba(54,105,174, 1);
				color:#FFFFFF;
				font-size:28rpx;
				text-align:center;
			}
		}
	}
</style>
