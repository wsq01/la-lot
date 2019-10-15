import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = config.httpUrl.first
var axios = new HttpRequest(baseUrl)
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
// const deleteList = (url, params) => {
//   const data = {
//     uid: UID,
//     version: config.version,
//     data: {
//       list: params
//     }
//   }
//   return axios.request({
//     url,
//     method: 'delete',
//     data
//   })
// }
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
export const login = (params) => getItems('/api/user/login', params)

export const getUser = (params) => getItems('/api/user/user', params)

export const deleteUser = (id) => deleteItem('/api/user/user', id)

export const addUser = (params) => addItem('/api/user/user', params)

export const getOrganization = (params) => getItems('/api/user/organization', params)

export const getOrganizationList = () => getItems('/api/user/organization/list')

export const addOrganization = (params) => addItem('/api/user/organization', params)

export const deleteOrganization = (id) => deleteItem('api/user/organization', id)

export const getRole = (params) => getItems('/api/user/role', params)

export const addRole = (params) => addItem('/api/user/role', params)

export const editRole = (params) => editItem('/api/user/role', params)

export const deleteRole = (id) => deleteItem('/api/user/role', id)

export const getMenus = (params) => getItems('/api/user/menu', params)

export const deleteMenus = (id) => deleteItem('/api/user/menu', id)

export const addMenus = (params) => addItem('/api/user/menu', params)

export const editMenus = (params) => editItem('/api/user/menu', params)
