import { createHttp } from "@/utils/http";

// const http = createHttp('http://api.myxpack.com/apiv1/')
import { baseURL } from '@/utils/ipConfig.js'
const http = createHttp(baseURL)

// 获取某用户的群组列表
export const getUserGroup = (params) => {
  params = {
	 ...params
  }
  return http.get('apiv1/im/get_user_groups', params).then(res => {
    console.log('res', res.data)
    return res
  })
}
//获取用户好友列表
export const getFriends = (params) => {
  params = {
	 ...params
  }
  return http.get('apiv1/im/get_friends', params).then(res => {
    console.log('res', res.data)
    return res
  })
}
