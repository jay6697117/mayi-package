<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body">
			<div class="card">
				<div class="card-prefix">
					<img :src="userInfo.avatar" alt="">
				</div>
				<div class="card-main">
          <div class="username">
            {{userInfo.username}}（事业合伙人）
          </div>
          <div class="rank-info">
            <div>当前销售额排名：NO.{{income_rank}}</div>
            <div>当前利润收益额排名：NO.{{sales_rank}}</div>
          </div>
        </div>
			</div>
      <RankCard title="销售额排名榜" :list="income" :current="income_rank"></RankCard>
      <RankCard title="利润收益排名榜" :list="profits" :current="sales_rank"></RankCard>
		</view>
	</gracePage>
</template>
<script>
import { mapGetters } from "vuex"
import RankCard from "./components/rank-card";
export default {
  components: { RankCard },
  data() {
    return {
      income: [],
      profits: [],
      income_rank: 0,
      sales_rank: 0
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    fetch () {
      this.$http.get(`apiv1/statistic/user_data?user_id=${this.userInfo.id}`).then(({ data }) => {
        this.income_rank = data.income_rank
        this.sales_rank = data.sales_rank
      })
      this.$http.get(`apiv1/statistic/user_rank_data?user_id=${this.userInfo.id}`).then(({ data: { income, profits } }) => {
        console.log(income, profits)
        this.income = income.sort((a, b) => a.rank - b.rank)
        this.profits = profits.sort((a, b) => a.rank - b.rank)
      })
    }
  },
  onLoad() {
    this.fetch()
  }
}
</script>

<style lang="scss">
.card {
	background-color: #fff;
	border-radius: 5rpx;
	margin: 40rpx 0;
	display: flex;
  padding: 90rpx 40rpx;
}
.card-prefix {
	img {
		display: inline-block;
		width: 140rpx;
		height: 140rpx;
		border-radius: 70rpx;
	}
}
.card-main {
	flex: 1;
  .username {
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 40rpx;
  }
  .rank-info {
    background-image: url("~@/static/rank_bg.png");
    background-size: contain;
    background-repeat: no-repeat;
    width: 360rpx;
    height: 90rpx;
    font-size: 20rpx;
    font-family: SourceHanSansSC;
    font-weight: 400;
    color: #2668B3;
    display: flex;
    padding-left: 50rpx;
    flex-direction: column;
    justify-content: center;
  }
}
</style>