<template>
  <div class="card-rank">
    <div class="card-rank-header">{{title}}</div>
    <div class="card-rank-item" v-for="(item, index) in list" :key="index" :class="{ current: index + 1 == current }">
      {{index + 1}}.
      <img :src="item.avatar || defaultAvatar" alt="">
      <div class="card-rank-name">{{ item.username }}</div>
      <div class="card-rank-num">￥{{item.value | formatPrice}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'rank-card',
  props: {
    current: [String, Number],
    list: {
      type: Array, default () { return [] }
    },
    title: String
  },
  data () {
    return {
      defaultAvatar: '/static/img/Icon-76@3x.png'
    }
  }
}
</script>
<style lang="scss" scoped>
.card-rank {
  background-color: #fff;
	border-radius: 5rpx;
	margin: 40rpx 0;
	display: flex;
  flex-direction: column;
}
.card-rank-header {
  font-size: 30rpx;
  font-family: SourceHanSansSC;
  font-weight: 500;
  color: #333333;
  line-height: 36rpx;
  margin: 40rpx;
}
.card-rank-item {
  display: flex;
  margin: 40rpx 0;
  padding: 0 40rpx;
  font-size: 30rpx;
  font-family: SourceHanSansSC;
  font-weight: bold;
  color: #333333;
  align-items: center;
  &.current {
    background-color: #2668B3;
    color: #fff;
    .card-rank-num {
      color: #fff;
    }
  }
  img {
    width: 80rpx;
    height: 80rpx;
    border-radius: 80rpx;
    margin: 0 20rpx;
  }
}
.card-rank-name {
  font-size: 24rpx;
}
.card-rank-num {
  flex: 1;
  text-align: right;
  font-size: 36rpx;
  color: #2668B3;
}
</style>
