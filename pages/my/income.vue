<template>
	<scroll-view class="grace-body" @scrolltolower="load">
		<order-item
			v-for="item in list"
			:key="item.sell_order_id"
			:id="item.sell_order_id"
			:no="item.sell_order_id"
			:order_no="item.order_info? item.order_info.order_no : ''"
			:totalPrice="item.amount"
			:time="item.created_at"
			:status="item.status"
			:customerName="item.order_info.customer.name"
			:percent="item.percent"
			class="grace-margin-top">
		</order-item>
	</scroll-view>
</template>

<script>
	import { mapGetters, mapActions, mapState } from "vuex"
	export default {
		data() {
			return {
				
			}
		},
		computed: {
			...mapState({
				list: state => state.profit.profit
			})
		},
		methods: {
			...mapActions(['refreshProfit', 'fetchProfit']),
			load () {
				this.fetchProfit()
			}
		},
		onShow () {
			this.refreshProfit()
		}
	}
</script>

<style>

</style>
