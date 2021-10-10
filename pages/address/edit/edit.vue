<template>
	<view>
		<gracePage :customHeader="false">
			<view slot="gBody">
				<view  class="content">
					<view class="row">
						<view class="nominal">
							收件人
						</view>
						<view class="input">
							<input placeholder="请输入收件人姓名" type="text" v-model="name" />
						</view>
					</view>
					<view class="row">
						<view class="nominal">
							电话号码
						</view>
						<view class="input">
							<input placeholder="请输入收件人电话号码" type="text" v-model="tel" />
						</view>
					</view>
					<view class="row">
						<view class="nominal">
							所在地区
						</view>
						<view class="input" @tap="chooseCity">
							{{area ? area : '请点击选择地址'}}
						</view>
						
					</view>
					<view class="row">
						<view class="nominal">
							详细地址
						</view>
						<view class="input">
							<textarea v-model="detailed" auto-height="true" placeholder="输入详细地址"></textarea>
						</view>
					</view>
					<view class="row">
						<view class="nominal">
							设置默认地址
						</view>
						<view class="input switch">
							<switch color="#3688FF" :checked="isDefault" @change=isDefaultChange />
						</view>
					</view>
					<view class="row" v-if="editType=='edit'" @tap="del">
						<view class="del">
							删除收货地址
						</view>
					</view>
				</view>
				<graceAddressPicker :show="graceAddressPickerShow" @confirm="pickerConfirm" @close="closePicker" cancelTColor="关闭"></graceAddressPicker>
			</view>
		<view slot="gFooter" class="footer grace-padding grace-flex grace-space-between" style="padding: 20rpx;">
			<view class="save" @tap="save">
				<view class="btn">
					保存地址
				</view>
			</view>
		</view>
		</gracePage>
		<!-- <mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValue" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker> -->
		
	</view>
</template>

<script>
	import graceAddressPicker from '../../../graceUI/components/graceAddressPicker.vue';
	import gracePage from "../../../graceUI/components/gracePage.vue";
	
	export default {
		components:{
			gracePage
		},
		data() {
			return {
				graceAddressPickerShow: false,
				editType:'edit',
				id:'',
				name:'', // 收货人
				tel:'', // 电话
				detailed:'', // 详细地址
				isDefault:false, // 是否默认
				themeColor: '#007AFF',
				region:{label:"请点击选择地址",value:[],cityCode:""},
				area: '' // 省市区
			};
		},
		methods: {
			onCancel(e) {
				console.log(e)
			},
			chooseCity() {
				this.graceAddressPickerShow = true
			},
			pickerConfirm : function(e){
				this.area = e.names[0]+' '+e.names[1]+' '+e.names[2];
				this.closePicker();
			},
			closePicker : function () {
				this.graceAddressPickerShow = false;
			},
			isDefaultChange(e){ // 是否默认
				this.isDefault = e.detail.value;
			},
			del(){
				uni.showModal({
					title: '删除提示',
					content: '你将删除这个收货地址',
					success: (res)=>{
						if (res.confirm) {
							this.$store.dispatch('saveAddress',{
								id: this.id || 0,
								user_id: parseInt(this.$store.getters.userInfo.id),
								receiver: this.name,
								address: this.detailed,
								city: this.area,
								default: this.isDefault,
								mobile: this.tel,
								user_type: 'customer',
								status: -1 // 删除 -1
							}).then(data => {
								uni.hideLoading();
								uni.navigateBack();
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
			},
			save(){
				let data={"name":this.name,"head":this.name.substr(0,1),"tel":this.tel,"address":{"region":this.region,"detailed":this.detailed},"isDefault":this.isDefault}
				if(this.editType=='edit'){
					data.id = this.id
				}
				if(!data.name){
					uni.showToast({title:'请输入收件人姓名',icon:'none'});
					return ;
				}
				if(!data.tel){
					uni.showToast({title:'请输入收件人电话号码',icon:'none'});
					return ;
				} else {
					var myreg=/^[1][0-9]{10}$/;
					if (!myreg.test(data.tel)){
						uni.showToast({ title: '请正确填写手机号码', icon : "none"});
						return ;
					}
				}
				
				if(!data.address.detailed){
					uni.showToast({title:'请输入收件人详细地址',icon:'none'});
					return ;
				}
				if(this.area.length === 0){
					uni.showToast({title:'请选择收件地址',icon:'none'});
					return ;
				}
				uni.showLoading({
					title:'正在提交'
				})
				
				this.$store.dispatch('saveAddress',{
					id: this.id || 0,
					user_id: parseInt(this.$store.getters.userInfo.id),
					receiver: this.name,
					address: this.detailed,
					city: this.area,
					default: this.isDefault,
					mobile: this.tel,
					user_type: 'customer',
					status: 0 // ???
				}).then(data => {
					uni.hideLoading();
					uni.navigateBack();
				})
				
			}
		},
		onLoad(e) {
			//获取传递过来的参数
			this.editType = e.type;
			if(e.type=='edit'){
				uni.getStorage({
					key:'address',
					success: (e) => {
						this.id = e.data.id;
						this.name = e.data.receiver;
						this.tel = e.data.mobile;
						this.detailed = e.data.address;
						this.isDefault = e.data.default;
						this.area = e.data.city;
					}
				})
			}
			
		},
		onBackPress() {
			
		},
		onUnload() {
			
		}
	};
</script>
<style lang="scss">

.save{
		view{
			display: flex;
		}
		// position: fixed;
		// bottom: 0;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.btn{
			box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: #3688FF;
			color: #fff;
			justify-content: center;
			align-items: center;
			.icon{
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}
			font-size: 30upx;
		}
	}
	.content{
		display: flex;
		flex-wrap: wrap;
		view{
			display: flex;
		}
		.row{
			width: 94%;
			
			margin: 0 3%;
			border-top: solid 1upx #eee;
			.nominal{
				width: 30%;
				height: 120upx;
				font-weight: 200;
				font-size: 30upx;
				align-items: center;
			}
			.input{
				width: 70%;
				padding: 20upx 0;
				align-items: center;
				font-size: 30upx;
				&.switch{
					justify-content: flex-end;
				}
				.textarea{
					margin: 20upx 0;
					min-height: 120upx;
				}
			}
			.del{
				width: 100%;
				height: 100upx;
				justify-content: center;
				align-items: center;
				font-size: 36upx;
				color: #f06c7a;
				background-color: rgba(255,0,0,0.05);
				border-bottom: solid 1upx #eee;
			}
		}
	}
	/deep/.gap-item {
		font-size: 18px !important;
	}
</style>
