<template>
	<view class="order-card grace-margin-top grace-border">
		<div class="grace-flex-v1">		
			<view>
				<text class="grace-bold">订单号</text>：<text>No.10001</text>
			</view>
			<view>
				<text class="grace-bold">订单名称</text>：<text>重要订单</text>
			</view>
			<view>
				<text class="grace-bold">订单金额</text>：<text>￥1000.00</text>
			</view>
			<view>
				<text class="grace-bold">订单接单时间</text>：<text>2020-02-09</text>
			</view>
		</div>
		<div class="status">
			状态值
		</div>
	</view>
</template>

<script>
	export default {
		props: {
			
		}
	}
</script>

<style>
	.order-card {
		background-color: #fff;
		padding: 24rpx;
		border-radius: 12rpx;
		text-align: left;
		display: flex;
		align-items: center;
	}
	.status {
		font-size: 40rpx;
		font-weight: bold;
	}
</style>
