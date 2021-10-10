<template>
	<gracePage :customHeader="false">
		<!-- 页面主体 -->
		<view class="grace-body" slot="gBody">
			<form class="grace-form grace-margin-top">
				<view class="order-card grace-padding">
					<view class="grace-form-item grace-border-b">
						<text class="grace-form-label">公司名称</text>
						<view class="grace-form-body">
							<input type="text" class="grace-form-input" name="name" v-model="form.name" placeholder="请输入内容" />
						</view>
						<text class="grace-icons icon-close grace-form-icon grace-text-center" v-if="form.name != ''" @tap="form.name = ''"></text>
					</view>
					<view class="grace-form-item grace-border-b">
						<text class="grace-form-label">公司税号</text>
						<view class="grace-form-body">
							<input type="text" class="grace-form-input" name="name" v-model="form.tax_code" placeholder="请输入内容" />
						</view>
						<text class="grace-icons icon-close grace-form-icon grace-text-center" v-if="form.tax_code != ''" @tap="form.tax_code = ''"></text>
					</view>
					<view class="grace-form-item grace-border-b">
						<text class="grace-form-label">公司地址</text>
						<view class="grace-form-body">
							<input type="text" class="grace-form-input" name="name" v-model="form.address" placeholder="请输入内容" />
						</view>
						<text class="grace-icons icon-close grace-form-icon grace-text-center" v-if="form.address != ''" @tap="form.address = ''"></text>
					</view>
					<view class="grace-form-item grace-border-b">
						<text class="grace-form-label">公司电话</text>
						<view class="grace-form-body">
							<input type="text" class="grace-form-input" name="name" v-model="form.tel" placeholder="请输入内容" />
						</view>
						<text class="grace-icons icon-close grace-form-icon grace-text-center" v-if="form.tel != ''" @tap="form.tel = ''"></text>
					</view>
					<view class="grace-form-item grace-border-b">
						<text class="grace-form-label">公司开户行</text>
						<view class="grace-form-body">
							<input type="text" class="grace-form-input" name="name" v-model="form.bank_name" placeholder="请输入内容" />
						</view>
						<text class="grace-icons icon-close grace-form-icon grace-text-center" v-if="form.bank_name != ''" @tap="form.bank_name = ''"></text>
					</view><view class="grace-form-item grace-border-b">
						<text class="grace-form-label">开户行账号</text>
						<view class="grace-form-body">
							<input type="text" class="grace-form-input" name="name" v-model="form.bank_account" placeholder="请输入内容" />
						</view>
						<text class="grace-icons icon-close grace-form-icon grace-text-center" v-if="form.bank_account != ''" @tap="form.bank_account = ''"></text>
					</view><view class="grace-form-item grace-border-b">
						<text class="grace-form-label">总金额</text>
						<view class="grace-form-body">
							<input type="text" class="grace-form-input" name="name" v-model="form.amount" placeholder="请输入内容" />
						</view>
						<text class="grace-icons icon-close grace-form-icon grace-text-center" v-if="form.amount != ''" @tap="form.amount = ''"></text>
					</view>
				</view>
				<view class="grace-title grace-margin-top">接受方式</view>
				<div class="order-card grace-padding grace-margin-top">
					<view class="grace-form-item grace-border-b">
						<text class="grace-form-label">电子邮件</text>
						<view class="grace-form-body">
							<input type="text" class="grace-form-input" name="name" v-model="form.email" placeholder="请输入内容" />
						</view>
						<text class="grace-icons icon-close grace-form-icon grace-text-center" v-if="form.email != ''" @tap="form.email = ''"></text>
					</view>
				</div>
				
				<view style="padding:22rpx 0;">
					<button class="grace-button" style="line-height:80rpx;" formType="submit" type="primary" @click="onSubmit">完成开票</button>
				</view>
			</form>
		</view>
	</gracePage>
</template>
<script>
	import { mapGetters } from 'vuex';
	import { createInvoice } from '@/http/invoice.js'

	export default {
		data() {
			return {
				params: {},
				form: {
					amount: '',
					email: '',
					address: '',
					bank_account: '',
					bank_name: '',
					name: '',
					tax_code: '',
					tel: ''
				}
			}
		},
		computed: {
			...mapGetters(['role'])
		},
		methods: {
			onSubmit () {
				createInvoice({ ...this.form, user_type: this.role, sell_order_id: +this.params.id, apply_user_id: this.$store.state.user.userInfo.id }).then(() => {
					uni.navigateBack()
				})
			}
		},
		onLoad(params) {
			this.params = params
		}
	};
</script>
<style>
	.order-card {
		background-color: #fff;
		box-sizing: border-box;
	}
</style>
