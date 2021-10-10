// 使用方法
// uni.request({
//      url: 'http://43.247.90.62:8090/apiv1/qiniu/token', //仅为示例，并非真实接口地址。
//      data: {
//      },
//      header: {//自定义请求头信息
//      },
//      success: (res) => {
//       console.log('7niu地址=', res.data.data)
//       upload7niu(res.data.data).then(url=> {
// 		console.log('url =',url) // 返回的图片地址
//       })
//      }
//     });

export default ({ key, qiniu_uri, token }) => {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
    // uni.chooseVideo({
    // uni.chooseMedia({
      success: (res) => {
        console.log('qiniu =', res)
        let filePath = null
		filePath = res.tempFilePaths[0]
        // if (res.errMsg === 'chooseImage:ok') {
        //   filePath = res.tempFilePaths[0]
        // }
        // if (res.errMsg === 'chooseVideo:ok') {
        //   filePath = res.tempFilePath
        // }
        // if (res.errMsg === 'chooseMedia:ok') {
        //   filePath = res.tempFiles[0].tempFilePath
        // }

        // const ext = filePath.replace(/([\S\s]+)\.(\S+)$/, '$2')
        // const key = `${dir}/${md5(Math.random())}.${ext}`
        console.log('qiniu =', key, qiniu_uri, token)
        uni.uploadFile({
          url: 'https://upload.qbox.me/', //qiniu_uri,
          filePath,
          name: 'file',
          formData: {
            key,
            token
          },
          success: (res) => {
            console.log('上传成功1 =', res)
            resolve(`${qiniu_uri}`)
          },
          fail (err) {
            reject(err)
          }
        })
      },
      fail (err) {
        reject(err)
      }
    })
  })
}
