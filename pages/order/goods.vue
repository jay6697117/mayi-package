<template>
	<view class="container">
		<!-- 顶部面板 -->
		<view class="top--panel">
			<!-- 顶部面板，可添加所需要放在页面顶部的内容代码。比如banner图 -->
			<graceSwiper :swiperItems="curSwiper" :width="700" :height="315"></graceSwiper>
		</view>
		<!-- 滚动区域 -->
		<view class="scroll-panel" id="scroll-panel">
			<view class="list-box">
				<view class="left">
					<scroll-view scroll-y="true" 
					:style="{ 'height':scrollHeight }"
					:scroll-into-view="leftIntoView"
					:scroll-with-animation="true"
					>
						<view class="item" 
							v-for="item in categoryList"
							:key="item.id" 
							:class="{ 'active':item.id==curCateId }" 
							:id="'left-'+item.id"
							:data-index="item.id"
							@tap="leftTap(item.id)"
						>{{item.name}}</view>
			        </scroll-view>
				</view>
				<view class="main">
					<swiper class="swiper" :style="{ 'height':scrollHeight }" 
						:current="curCateIndex" @change="swiperChange"
						 vertical="true" duration="300">
						<swiper-item v-for="(item, index) in categoryList" :key="item.id">
							<!-- {{item.id}} -->
							<scroll-view  scroll-y="true" :style="{ 'height':scrollHeight }">
								<view class="item">
									<view class="title">
										<view>{{item.name}}</view>
									</view>
									<view class="goods" v-for="(good, subIndex) in goodMap[item.id]" :key="good.id">
										<!-- {{good.id}} -->
										<image :src="good.avatar" mode=""></image>
										<view class="grace-flex-v1">
											<view class="grace-flex">
												<view class="grace-flex-v1">													
													<view>{{good.name}}</view>
													<view class="describe">{{good.desc}}</view>
												</view>
												<view class="grace-red grace-margin">
													￥{{good.sale_price | formatPrice}}
												</view>	
											</view>	
											<view class="grace-flex-end"><graceNumberBox :value="good.num" @change="onChange(goodMap[categoryList[index].id][subIndex], $event[0])"></graceNumberBox></view>
										</view>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
    <yzf-popup ref="popup" height="1000rpx">
      <scroll-view style="height: 800rpx;">
        <view style="padding: 24px;">
          <view class="item">
          	<view class="goods" v-for="(good, subIndex) in selectedGoods" :key="good.id">
          		<!-- {{good.id}} -->
          		<image :src="good.avatar" mode=""></image>
          		<view class="grace-flex-v1">
          			<view class="grace-flex">
          				<view class="grace-flex-v1">													
          					<view>{{good.name}}</view>
          					<view class="describe">{{good.desc}}</view>
          				</view>
          				<view class="grace-red grace-margin">
          					￥{{good.sale_price | formatPrice}}
          				</view>	
          			</view>	
          			<view class="grace-flex-end"><graceNumberBox :value="good.num" @change="onChange(good, $event[0])"></graceNumberBox></view>
          		</view>
          	</view>
          </view>
        </view>
      </scroll-view>
      <view class="bottom-panel" style="position: absolute;bottom: 0;width: 100%;background-color: #F6F7F8;">
      	<!-- 底部面板，可添加所需要放在页面底部的内容代码。比如购物车栏目 -->
      	<view class="grace-padding grace-padding-top grace-flex grace-flex-vcenter" style="padding-bottom: 30rpx;">
      		<view class="grace-flex-v1" style="display: block;">
      			<span class="grace-icons icon-shoppingcard grace-blue" style="position: relative;font-size: 48rpx;" @click="toggleCart(false)">
              <span class="sub">{{selectedGoodSum}}</span>
            </span>
            <span>
              ￥{{selectedGoodTotalPrice | formatPrice}}
            </span>
      		</view>
      		<view>
            <button type="warn" size="mini" class="grace-button" @click="clearSelectedGoods">
            	清空
            </button>
      			<!-- <button type="primary" size="mini" class="grace-button" @click="toCheckout">
      				去结算
      			</button> -->
      		</view>
      	</view>
      </view>
    </yzf-popup>
		<!-- 底部面板 -->
		<view class="bottom-panel">
			<!-- 底部面板，可添加所需要放在页面底部的内容代码。比如购物车栏目 -->
			<view class="grace-padding grace-padding-top grace-flex grace-flex-vcenter" style="padding-bottom: 30rpx;">
				<view class="grace-flex-v1" style="display: block;">
					<span class="grace-icons icon-shoppingcard grace-blue" style="position: relative;font-size: 48rpx;" @click="toggleCart(true)">
            <span class="sub">{{selectedGoodSum}}</span>
          </span>
          <span>
            ￥{{selectedGoodTotalPrice | formatPrice}}
          </span>
				</view>
				<view>
					<button type="primary" size="mini" class="grace-button" @click="toCheckout">
						去结算
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				scrollHeight:'400px'
			}
		},
		computed:{
			...mapState({
				curCateId: state => state.goods.curCateId,
        selectedGoods: state => state.goods.selectedGoods
			}),
			...mapGetters(['categoryList', 'goodMap', 'curCateIndex', 'curSwiper', 'selectedGoodSum', 'selectedGoodTotalPrice']),
			/* 计算左侧滚动位置定位 */
			leftIntoView(){
				return `left-${this.leftIndex > 5 ? (this.leftIndex-5):0}`;
			}
		},
		mounted(){
			/* 等待DOM挂载完成 */
			this.$nextTick(()=>{
				/* 在非H5平台，nextTick回调后有概率获取到错误的元素高度，则添加200ms的延迟来减少BUG的产生 */
				setTimeout(()=>{
					/* 等待滚动区域初始化完成 */
					this.initScrollView().then(()=>{
						/* 获取列表数据，你的代码从此处开始 */
						this.fetchCategoryList();
					})
				},200);
			})
			this.clearSelectedGoods()
		},
		onShow() {
		  // 清空一下选择的地址
		  this.$store.dispatch('setSelectAddress', null)
		},
		methods: {
			...mapMutations(['setSelectedGood', 'clearSelectedGoods']),
			...mapActions(['fetchCategoryList', 'fetchGoodsById', 'clearSelectedGoods']),
			toCheckout () {
				if(this.selectedGoodSum === 0) {
					uni.showToast({
						icon: 'none',
						title: '请先选择商品'
					})
				} else {
					uni.navigateTo({
						url: '/pages/order/checkout'
					})
				}
			},
      toggleCart (visible) {
        if (visible) {
          this.$refs.popup.open()
        } else {
          this.$refs.popup.close()
        }
      },
			/* 初始化滚动区域 */
			initScrollView(){
				return new Promise((resolve, reject)=>{
					let view = uni.createSelectorQuery().select('#scroll-panel');
					view.boundingClientRect(res => {
						this.scrollHeight = `${res.height}px`;
						this.$nextTick(()=>{
							resolve();
						})
					}).exec();
				});
			},
			/* 左侧导航点击 */
			leftTap(id){
				this.fetchGoodsById(id)
			},
			/* 轮播图切换 */
			swiperChange(e){
				let index=e.detail.current;
				this.fetchGoodsById(this.categoryList[index].id)
				// this.leftIndex=Number(index);
			},
			onChange(good, value) {
				console.log(good, value)
				this.setSelectedGood({ ...good, num: value })
			}
		}
	}
</script>

<style lang="scss">
page,.container{
	height: 100%;
}
.sub {
  position: absolute;
  font-size: 12rpx;
  right: -6rpx;
  top: -6rpx;
  background-color: red;
  display: inline-block;
  width: 24rpx;
  height: 24rpx;
  border-radius: 12rpx;
  line-height: 24rpx;
  text-align: center;
  color: #fff;
  font-weight: bold;
}
/* 容器 */
.container{
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: flex-start;
	align-content: flex-start;
	
	&>view{
		width: 100%;
	}
	
	.scroll-panel{
		flex-grow: 1;
		height: 0;
		overflow: hidden;
	}
	
	.bottom-panel{
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);		
	}
}
	
.list-box{
	display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
	font-size: 28rpx;
	
	.left{
		width: 200rpx;
		background-color: #f6f6f6;
		line-height: 80rpx;
		box-sizing: border-box;
		font-size: 32rpx;
		
		.item{
			padding-left: 20rpx;
			position: relative;
			&:not(:first-child) {
				margin-top: 1px;
			
				&::after {
					content: '';
					display: block;
					height: 0;
					border-top: #d6d6d6 solid 1px;
					width: 620upx;
					position: absolute;
					top: -1px;
					right: 0;
					transform:scaleY(0.5);	/* 1px像素 */
				}
			}
			
			&.active,&:active{
				color: #42b983;
				background-color: #fff;
			}
		}
	}
	.main{
		background-color: #fff;
		padding-left: 20rpx;
		width: 0;
		flex-grow: 1;
		box-sizing: border-box;
		
		.swiper{
			height: 500px;
		}

		.title{
			line-height: 64rpx;
			font-size: 24rpx;
			font-weight: bold;
			color: #666;
			background-color: #fff;
			position: sticky;
			top: 0;
			z-index: 999;
		}
		
		.item{
			padding-bottom: 10rpx;
		}
	}
}
.goods{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  margin-bottom: 10rpx;
  
  &>image{
    width: 120rpx;
    height: 120rpx;
    margin-right: 16rpx;
    margin-left: 2px;
  }
  
  .describe{
    font-size: 24rpx;
    color: #999;
  }
  
  .money{
    font-size: 24rpx;
    color: #efba21;
  }
}
</style>
