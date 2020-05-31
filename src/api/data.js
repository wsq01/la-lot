import HttpRequest from '@/libs/axios'
import config from '@/config'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev.second : config.baseUrl.pro.second
const axios = new HttpRequest(baseUrl)

const UID = ''
const getItems = (url, params) => {
  return axios.request({
    url,
    method: 'get',
    params
  })
}
const deleteItem = (url, id) => {
  return axios.request({
    url: url + '/' + id,
    method: 'delete'
  })
}
const deleteList = (url, params) => {
  const data = {
    uid: UID,
    version: config.version,
    data: {
      list: params
    }
  }
  return axios.request({
    url,
    method: 'delete',
    data
  })
}
const addItem = (url, params) => {
  const data = {
    uid: UID,
    version: config.version,
    data: params
  }
  return axios.request({
    url,
    method: 'put',
    data
  })
}
const editItem = (url, params) => {
  const data = {
    uid: UID,
    version: config.version,
    data: params
  }
  return axios.request({
    url,
    method: 'post',
    data
  })
}
// 查询城市列表，区域列表和区域中各设备数
export const getCityListByOid = (oid) => {
  return axios.request({
    url: '/api/tb/city/list',
    method: 'get',
    params: {
      organizationId: oid
    }
  })
}

export const getCityInfo = (cid) => {
  return axios.request({
    url: '/api/tb/city/list/info/' + cid,
    method: 'get'
  })
}

export const getArea = (params) => getItems('/api/tb/area', params)

export const getAreaList = () => getItems('/api/tb/area/list')

export const deleteArea = (id) => deleteItem('api/tb/area', id)

export const deleteAreaList = (params) => deleteList('api/tb/area/list', params)

export const addArea = (params) => addItem('/api/tb/area', params)

export const editArea = (params) => editItem('/api/tb/area', params)

export const getScene = (params) => getItems('/api/tb/scene', params)

export const getSceneList = () => getItems('/api/tb/scene/list')

export const deleteScene = (id) => deleteItem('/api/tb/scene', id)

export const deleteSceneList = (params) => deleteList('/api/tb/scene/list', params)

export const addScene = (params) => addItem('/api/tb/scene', params)

export const editScene = (params) => editItem('/api/tb/scene', params)

export const addReceiver = (params) => addItem('/api/tb/receiver', params)

export const orderReceiver = (data) => {
  return axios.request({
    url: '/api/tb/receiver/order',
    method: 'post',
    data
  })
}

export const deleteReceiver = (id) => deleteItem('/api/tb/receiver', id)

export const editReceiver = (params) => editItem('/api/tb/receiver', params)

export const getReceiver = (params) => getItems('/api/tb/receiver', params)

export const getDeviceNumber = (params) => getItems('/api/tb/device/number', params)

export const getDevice = (params) => getItems('/api/tb/device', params)

export const deleteDevice = (id) => deleteItem('/api/tb/device', id)

export const deleteDeviceList = (params) => deleteList('/api/tb/device/list', params)

export const addDevice = (params) => addItem('/api/tb/device', params)

export const editDevice = (params) => editItem('/api/tb/device', params)

export const getDeviceTypeList = (params) => getItems('/api/tb/type/list', params)

export const getDeviceTypeById = (id) => {
  return axios.request({
    url: '/api/tb/type/' + id,
    method: 'get'
  })
}
export const getFirstLevel = () => getItems('/api/tb/type/firstLevel/all')

export const getSecondLevel = (params) => getItems('/api/tb/type/secondLevel/' + params)

export const getDeviceMissed = (params) => getItems('/api/tb/device/missed', params)

export const addDeviceType = (params) => addItem('/api/tb/type', params)

export const deleteDeviceType = (id) => deleteItem('/api/tb/type', id)

export const editDeviceType = (params) => editItem('/api/tb/type', params)

export const getDeviceRealTime = (params) => getItems('/api/tb/device/realtime', params)

export const getDeviceRealTimeReport = (params) => getItems('/api/tb/device/realtime/report', params)

export const getDeviceRealTimeCheck = (params) => getItems('/api/tb/device/check', params)
// export const getDeviceImport = (params) => getItems('/api/tb/device/import', params)
