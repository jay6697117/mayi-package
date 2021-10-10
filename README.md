#### 发版本注意事项

Gitlab仓库地址: http://gitlab.zhunongba.com/sunqizhi/mayi-package.git

```
1、iOS配置修改
   Vue.prototype.$iosVersion = '1.0.3' // iOS审核版本号
   每次发版本需要和后端配合修改
2、main.js 其他配置修改
   Vue.prototype.$appTypeNum = '2' // 1:supplier 供应商app, 2:注册包含用户和销售的app, 3:注册包含全部角色的app
   Vue.prototype.$isH5Share = false // 是否是h5分享页面

```