<template>
	<div class="order-item grace-border grace-margin-top">	
		<view class="order-card">
			<div class="grace-flex-v1">		
				<view v-for="(info, index) in infos" :key="index">
					<text class="grace-bold">{{info.label}}</text>：<text>{{info.value}}</text>
				</view>
			</div>
			<div class="status">
				<slot></slot>
			</div>
		</view>
		<view class="order-handle" v-if="$slots.handle">
			<slot name="handle"></slot>
		</view>
	</div>
</template>

<script>
	export default {
		props: {
			infos: {
				type: Array,
				default () {
					return [{
						label: '订单名称', value: '重要订单'
					}, {
						label: '订单号', value: 'N001',
					}, {
						label: '订单金额', value: '￥1000'
					}, {
						label: '订单完成时间', value: '2020-02-09'
					}]
				}
			}
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
