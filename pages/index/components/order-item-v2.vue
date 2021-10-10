<template>
	<div class="order-item grace-border">	
		<view class="order-card">
			<div class="grace-flex-v1">		
				<view>
					<text class="grace-bold">订单名称</text>：<text>重要订单</text>
				</view>
				<view>
					<text class="grace-bold">订单号</text>：<text>No.10001</text>
				</view>
				<view>
					<text class="grace-bold">订单完成时间</text>：<text>2020-02-09</text>
				</view>
			</div>
			<div class="status">
				已开票
			</div>
		</view>
		<view class="order-handle">
			<button type="default" class="grace-button" size="mini">联系售后</button>
		</view>
	</div>
</template>

<script>
	export default {
		props: {
			
		}
	}
</script>

<style>
	.order-item {
		display: flex;
		flex-direction: column;
		border-radius: 24rpx;
		overflow: hidden;
	}
	.order-handle {
		background-color: #ccc;
		text-align: right;
		padding: 12rpx 24rpx;
	}
	.order-card {
		background-color: #fff;
		padding: 24rpx;
		text-align: left;
		display: flex;
		align-items: center;
	}
	.status {
		font-size: 40rpx;
		font-weight: bold;
	}
</style>
