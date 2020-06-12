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

export const editUser = (params) => editItem('/api/user/user', params)

export const deleteUser = (id) => deleteItem('/api/user/user', id)

export const addUser = (params) => addItem('/api/user/user', params)

export const getOrganization = (params) => getItems('/api/user/organization', params)

export const getOrganizationList = () => getItems('/api/user/organization/list')

export const addOrganization = (params) => addItem('/api/user/organization', params)

export const editOrganization = (params) => editItem('/api/user/organization', params)

export const deleteOrganization = (id) => deleteItem('api/user/organization', id)

export const getRole = (params) => getItems('/api/user/role', params)

export const addRole = (params) => addItem('/api/user/role', params)

export const editRole = (params) => editItem('/api/user/role', params)

export const deleteRole = (id) => deleteItem('/api/user/role', id)

export const getMenus = (params) => getItems('/api/user/menu', params)

export const deleteMenus = (id) => deleteItem('/api/user/menu', id)

export const addMenus = (params) => addItem('/api/user/menu', params)

export const editMenus = (params) => editItem('/api/user/menu', params)

export const getRelmenu = (params) => getItems('/api/user/roleRelMenu', params)

export const addRelmenu = (params) => addItem('/api/user/roleRelMenu', params)

export const editRelmenu = (params) => editItem('/api/user/roleRelMenu', params)

export const deleteRelmenu = (id) => deleteItem('/api/user/roleRelMenu', id)

export const getReluser = (params) => getItems('/api/user/userRelRole', params)

export const addReluser = (params) => addItem('/api/user/userRelRole', params)

export const editReluser = (params) => editItem('/api/user/userRelRole', params)

export const deleteReluser = (id) => deleteItem('/api/user/userRelRole', id)

export const getRelresource = (params) => getItems('/api/user/roleRelResource', params)

export const addRelresource = (params) => addItem('/api/user/roleRelResource', params)

export const editRelresource = (params) => editItem('/api/user/roleRelResource', params)

export const deleteRelresource = (id) => deleteItem('/api/user/roleRelResource', id)

export const getBtn = (params) => getItems('/api/user/button', params)

export const addBtn = (params) => addItem('/api/user/button', params)

export const editBtn = (params) => editItem('/api/user/button', params)

export const deleteBtn = (id) => deleteItem('/api/user/button', id)
