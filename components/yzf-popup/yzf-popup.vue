<template>
  <uni-popup ref="popup" type="bottom" @change="onChange">
    <div class="yzf-popup-header" v-if="title">
      {{title}}
      <div class="btn-close" @click="close"></div>
    </div>
    <scroll-view scroll-y class="yzf-popup" :style="{ height }">
      <div class="yzf-popup-container">
        <slot></slot>
      </div>
    </scroll-view>
  </uni-popup>
</template>
<script>
export default {
  name: 'yzf-popup',
  props: {
    title: String,
    height: {
      type: String,
      default: 'auto'
    }
  },
  methods: {
    onChange ({ show }) {
      if (show) {
        this.$emit('open')
      } else {
        this.$emit('close')
      }
    },
    close () {
      this.$refs.popup.close()
    },
    open () {
      this.$refs.popup.open()
    }
  },
}
</script>
<style lang="scss" scoped>
.yzf-popup {
  position: relative;
  z-index: 9999;
  background-color: #fff;
  max-height: 1000upx;
  min-height: 800upx;
  overflow-y: auto;
}
.yzf-popup-header {
  background-color: #fff;
  line-height: 88upx;
  text-align: center;
  font-size: 28upx;
  color: #333;
  .btn-close {
    width: 30upx;
    height: 30upx;
    position: absolute;
    top: 28upx;
    right: 30upx;
    display: block;
    background: url('~@/static/close_popup@2x.png') no-repeat;
    background-size: 30upx;
    &:before {
      content: '';
      position: absolute;
      top: -10px; bottom: -10px; left: -10px; right: -10px;
    };
  }
}
.yzf-popup-container {
  background-color: #fff;
  overflow: hidden;
}
</style>
