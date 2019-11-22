import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = config.httpUrl.three
var axios = new HttpRequest(baseUrl)

const getItems = (url, params) => {
  return axios.request({
    url,
    method: 'get',
    params
  })
}
export const getDeviceHistory = (params) => getItems('/api/hd/device', params)

export const getCheck = (params) => getItems('/api/hd/device/check', params)

export const getTrend = (params) => getItems('/api/hd/device/trend', params)

export const getTrace = (params) => getItems('/api/hd/device/trace', params)

export const getDeviceCheckHistory = (params) => getItems('/api/hd/device/report', params)

// export const getHdDeviceImport = (params) => getItems('/api/hd/device/import', params)
