<template>
	<gracePage :customHeader="false">
		<!-- 页面主体 -->
		<view slot="gBody" class="grace-columns grace-flex-v1">
			<ExternalSellerMessage v-if="role === 'external_seller'" ref='externalSellerMessage'></ExternalSellerMessage>
			<NormalMessage v-else ref='normalMessage'></NormalMessage>
		</view>
	</gracePage>
</template>
<script>
	import { mapGetters } from 'vuex'
	import NormalMessage from './normal_message.vue'
	import ExternalSellerMessage from './externalSeller_message.vue'
export default {
	components:{NormalMessage,ExternalSellerMessage},
    data() {
    	return {
		}
    },
	computed:{
		...mapGetters(['role']),
	},
	onReady:function(){
	},
	methods:{
	},
	onShow() {
		console.log('messge on show', this.$refs['normalMessage'])
		if (this.$refs['externalSellerMessage']) {
			this.$refs['externalSellerMessage'].onShowMethod()
		}
		if (this.$refs['normalMessage']) {
			this.$refs['normalMessage'].onShowMethod()
		}
	}
}
</script>
<style>
.SegmentedControlIn{width:500rpx; padding:0 125rpx; margin-top:38rpx;}
</style>