<template>
	<gracePage :customHeader="false">
		<!-- 页面主体 -->
		<view class="grace-body" slot="gBody">
			<view v-if="appTypeNum === '1'">
				<view class="role-card grace-margin-top" @click="toApply('supplier')">
					<image src="/static/img/registerIcon_2.png" alt="" class="role-avatar">
					<view class="grace-h4">供应商</view>
				</view>
			</view>
			<view v-else-if="appTypeNum === '2'">
				<view class="role-card grace-margin-top" @click="toApply('customer')">
					<image src="/static/img/registerIcon_1.png" alt="" class="role-avatar">
					<view class="grace-h4">包装用户</view>
				</view>
				<view class="role-card grace-margin-top" @click="toApply('seller')">
					<image src="/static/img/registerIcon_3.png" alt="" class="role-avatar">
					<view class="grace-h4">事业合伙人</view>
				</view>
			</view>
			<view v-else-if="appTypeNum === '3'">
				<view class="role-card grace-margin-top" @click="toApply('customer')">
					<image src="/static/img/registerIcon_1.png" alt="" class="role-avatar">
					<view class="grace-h4">包装用户</view>
				</view>
				<view class="role-card grace-margin-top" @click="toApply('supplier')">
					<image src="/static/img/registerIcon_2.png" alt="" class="role-avatar">
					<view class="grace-h4">供应商</view>
				</view>
				<view class="role-card grace-margin-top" @click="toApply('seller')">
					<image src="/static/img/registerIcon_3.png" alt="" class="role-avatar">
					<view class="grace-h4">事业合伙人</view>
				</view>
			</view>
			<view v-if="!isH5Share" class="grace-text grace-margin-top">
				告知：事业合伙人注册账号，需要通过企业内部销售分享的邀请码进行账号申请
			</view>
		</view>
	</gracePage>
</template>
<script>
	export default {
		data() {
			return {
				appTypeNum: this.$appTypeNum,
				isH5Share: this.$isH5Share
			}
		},
		methods: {
			toApply (role) {
				switch (role) {
					case 'customer': 
						uni.navigateTo({
							url: '/pages/user/customer_apply'
						})
						break
					case 'supplier':
						uni.navigateTo({
							url: '/pages/user/supplier_apply'
						})
						break
					case 'seller':
						uni.navigateTo({
							url: '/pages/user/seller_apply'
						})
						break
				}
			}
		}
	}
</script>
<style>
	.role-card {
		border-radius: 24rpx;
		border: 4rpx solid #fff;
		background-color: #CCCCCC;
		display: flex;
		align-items: center;
		padding: 24rpx 48rpx;
	}
	.role-avatar {
		display: block;
		height: 160rpx;
		width: 160rpx;
		border-radius: 80rpx;
		background-color: #FFFFFF;
		margin-right: 48rpx;
	}
</style>