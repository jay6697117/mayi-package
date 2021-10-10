<template>
	<view>
		<gracePage :customHeader="false">
		<view slot="gBody" class="content">
			<view class="list">
				<view class="row" v-for="(row,index) in addressList" :key="index" @tap="select(row)">
					<view class="left">
						<view class="head">
							{{row.receiver.substr(0, 1)}}
						</view>
					</view>
					<view class="center">
						<view class="name-tel">
							<view class="name">{{row.receiver}}</view>
							<view class="tel">{{row.mobile}}</view>
							<view class="default" v-if="row.default">
								默认
							</view>
						</view>
						<view class="address">
							{{row.city}} {{row.address}}
						</view>
					</view>
					<view class="right">
						<view class="icon bianji" @tap.stop="edit(row)">
						<text class="grace-grids-icon grace-icons" :class="'icon-write'" style="font-size: 38rpx;"></text>

						</view>
					</view>
				</view>
			</view>
		</view>
		<view slot="gFooter" class="footer grace-padding grace-flex grace-space-between" style="padding: 20rpx;">
			<view class="save">
				<view class="grace-button btn" @tap="add">
					新增地址
				</view>
			</view>
		</view>
		</gracePage>
	</view>
</template>
<script>
	import gracePage from "../../graceUI/components/gracePage.vue";
	
	export default {
		components:{
			gracePage
		},
		data() {
			return {
				isSelect:false,
				addressList:[
					// {id:1,name:"大黑哥",head:"大",tel:"18816881688",address:{region:{"label":"广东省-深圳市-福田区","value":[18,2,1],"cityCode":"440304"},detailed:'深南大道1111号无名摩登大厦6楼A2'},isDefault:true},
					// {id:2,name:"大黑哥",head:"大",tel:"15812341234",address:{region:{"label":"广东省-深圳市-福田区","value":[18,2,1],"cityCode":"440304"},detailed:'深北小道2222号有名公寓502'},isDefault:false},
					// {id:3,name:"老大哥",head:"老",tel:"18155467897",address:{region:{"label":"广东省-深圳市-福田区","value":[18,2,1],"cityCode":"440304"},detailed:'深南大道1111号无名摩登大厦6楼A2'},isDefault:false},
					// {id:4,name:"王小妹",head:"王",tel:"13425654895",address:{region:{"label":"广东省-深圳市-福田区","value":[18,2,1],"cityCode":"440304"},detailed:'深南大道1111号无名摩登大厦6楼A2'},isDefault:false},
				]
			};
		},
		onShow() {
			this.getAddressList()
			// uni.getStorage({
			// 	key:'delAddress',
			// 	success: (e) => {
			// 		let len = this.addressList.length;
			// 		if(e.data.hasOwnProperty('id')){
			// 			for(let i=0;i<len;i++){
			// 				if(this.addressList[i].id==e.data.id){
			// 					this.addressList.splice(i,1);
			// 					break;
			// 				}
			// 			}
			// 		}
			// 		uni.removeStorage({
			// 			key:'delAddress'
			// 		})
			// 	}
			// })
			// uni.getStorage({
			// 	key:'saveAddress',
			// 	success: (e) => {
			// 		let len = this.addressList.length;
			// 		if(e.data.hasOwnProperty('id')){
			// 			for(let i=0;i<len;i++){
			// 				if(this.addressList[i].id==e.data.id){
			// 					this.addressList.splice(i,1,e.data);
			// 					break;
			// 				}
			// 			}
			// 		}else{
			// 			let lastid = this.addressList[len-1];
			// 			lastid++;
			// 			e.data.id = lastid;
			// 			this.addressList.push(e.data);
			// 		}
			// 		uni.removeStorage({
			// 			key:'saveAddress'
			// 		})
			// 	}
			// })
		},
		onLoad(e) {
			if(e.type=='select'){
				this.isSelect = true;
			}
		},
		methods:{
			getAddressList (){
				this.$store.dispatch('addressList',{
					user_id: this.$store.getters.userInfo.id,
					user_type: 'customer'
				}).then(res => {
					console.log('res=', res.data.items)
					this.addressList = res.data.items
				})
			},
			edit(row){
				uni.setStorage({
					key:'address',
					data:row,
					success() {
						uni.navigateTo({
							url:"edit/edit?type=edit"
						})
					}
				});
				
			},
			add(){
				uni.navigateTo({
					url:"edit/edit?type=add"
				})
			},
			select(row){
				//是否需要返回地址(从订单确认页跳过来选收货地址)
				if(!this.isSelect){
					return ;
				}
				// uni.setStorage({
				// 	key:'selectAddress',
				// 	data:row,
				// 	success() {
				// 		uni.navigateBack();
				// 	}
				// })
				this.$store.dispatch('setSelectAddress', row)
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
view{
	display: flex;
}
	.footer {
		width: 750upx;
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
	}
	.list{
		flex-wrap: wrap;
		width: 750upx;
		.row{
			width: 96%;
			padding: 20upx 2%;
			// display: flex;
			.left{
				width: 90upx;
				flex-shrink: 0;
				align-items: center;
				.head{
					width: 70upx;
					height: 70upx;
					background:linear-gradient(to right,#ccc,#aaa);
					color: #fff;
					justify-content: center;
					align-items: center;
					border-radius: 60upx;
					font-size: 35upx;
				}
			}
			.center{
				width: 100%;
				flex-shrink: 1;
				flex-wrap: wrap;
				.name-tel{
					width: 100%;
					align-items: baseline;
					.name{
						font-size: 34upx;
					}
					.tel{
						margin-left: 30upx;
						font-size: 24upx;
						color: #777;
					}
					.default{

						font-size: 22upx;
						
						background-color: #3688FF;
						color: #fff;
						padding: 0 18upx;
						border-radius: 24upx;
						margin-left: 20upx;
					}
				}
				.address{
					width: 100%;
					font-size: 24upx;
					align-items: baseline;
					color: #777;
				}
			}
			.right{
				flex-shrink: 0;
				align-items: center;
				margin-left: 20upx;
				.icon{
					justify-content: center;
					align-items: center;
					width: 80upx;
					height: 60upx;
					border-left: solid 1upx #aaa;
					font-size: 40upx;
					color: #777;
				}
			}
		}
	}
</style>
