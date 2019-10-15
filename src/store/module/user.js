import {
  login,
  getUserInfo
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import Cookies from 'js-cookie'
import config from '@/config'

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    organizationId: Cookies.get('organizationId'),
    token: getToken(),
    roleIds: [],
    access: ['super_admin', 'admin'], // 可访问页面的权限数组
    hasGetInfo: false // 是否获取了用户数据
  },
  mutations: {
    setAvatar (state, avatarPath) { // 设置头像
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) { // 设置ID
      state.userId = id
    },
    setUserName (state, name) { // 设置用户名
      state.userName = name
    },
    setAccess (state, access) { // 设置权限
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setOrganizationId (state, organizationId) {
      Cookies.set('organizationId', organizationId, { expires: config.cookieExpires || 1 })
      state.organizationId = organizationId
    },
    setRoleIds (state, roleIds) {
      state.roleIds = roleIds
    },
    setHasGetInfo (state, status) { // 设置是否获取了用户信息
      state.hasGetInfo = status
    }
  },
  getters: {},
  actions: {
    // 登录
    handleLogin ({ commit }, { username, password }) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          if (res.data && res.data.code === 0) {
            const data = res.data.data
            console.log(data)
            commit('setToken', data.jwt)
            commit('setOrganizationId', data.organizationId)
            commit('setRoleIds', data.roleIds)
            commit('setHasGetInfo', true)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        commit('setToken', '')
        Cookies.remove('organizationId')
        commit('setAccess', [])
        resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo().then(res => {
            const data = res.data
            commit('setAvatar', data.avatar)
            commit('setUserName', data.name)
            commit('setUserId', data.user_id)
            commit('setAccess', data.access)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
