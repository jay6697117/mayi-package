import { createHttp } from "@/utils/http";

import { baseURL } from '@/utils/ipConfig.js'
const http = createHttp(baseURL)

export const getQiniuToken = () => {
  return http.get('apiv1/qiniu/token').then(res => {
    return res.data
  })
}