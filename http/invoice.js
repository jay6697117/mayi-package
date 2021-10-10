import { createHttp } from "@/utils/http";

// const http = createHttp('http://api.myxpack.com/apiv1/')
import { baseURL } from '@/utils/ipConfig.js'
const http = createHttp(baseURL)

export const createInvoice = ({ amount, email, address, bank_account, bank_name, name, tax_code, tel, user_type, sell_order_id, apply_user_id }) => {
  return http.post('apiv1/invoice/upsert', {
    amount: amount * 100, email, user_type, sell_order_id, status: 'submit', apply_user_id, tax_stub: {
      address, bank_account, bank_name, name, tax_code, tel, user_type
    }
  }).then(res => {
    return res.data
  })
}