<template>
	<gracePage :customHeader="true">
		<view slot="gHeader" class="grace-header-body">
			<view class="grace-header-content grace-flex-center grace-bg-white">
				{{title}}
			</view>
		</view>
		<!-- 页面主体 -->
		<view slot="gBody" class="grace-columns grace-flex-v1">
			<CustomerIndex v-if="role === 'customer'"></CustomerIndex>
			<SupplierIndex v-if="role === 'supplier'"></SupplierIndex>
			<SellerIndex v-if="role.indexOf('seller') > -1" :isExternal="role === 'external_seller'"></SellerIndex>
		</view>
	</gracePage>
</template>
<script>
	import { mapGetters, mapActions } from 'vuex'
	import CustomerIndex from './customer_index.vue'
	import SupplierIndex from './supplier_index.vue'
	import SellerIndex from './seller_index.vue'
export default {
	components: { CustomerIndex, SupplierIndex, SellerIndex },
    data() {
    	return {}
    },
	computed: {
		...mapGetters(['role']),
		title () {
			const map = { 'customer': '首页', 'supplier': '首页', 'seller': '客户提交的订单', 'external_seller': '我的收益' }
			return map[this.role]
		}
	},
	methods:{
		...mapActions(['refreshOrder'])
	},
	onShow () {
		const statusMap = { 'customer': 'proceed', 'supplier': 'ordering', 'seller': 'all', 'external_seller': 'all' }
		this.refreshOrder({ order_status: statusMap[this.role] })
	}
}
</script>
<style lang="scss">
	.order-btn {
		height: 320rpx;
		display: flex;
		align-items: center;
		margin-left: 80rpx;
	}
	.flex-box {
		flex: 1;
		padding: 20rpx;
		.grace-button {
			border-radius: 40rpx;
		}
	}
</style>