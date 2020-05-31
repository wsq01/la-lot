import {
  login,
  getMenus
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import Cookies from 'js-cookie'
// import config from '@/config'

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    organizationId: Cookies.get('organizationId'),
    token: getToken(),
    roleIds: [],
    btnList: [],
    userMenu: [],
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
    setBtnList (state, btnList) { // 设置ID
      state.btnList = btnList
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
      state.organizationId = organizationId
    },
    setRoleIds (state, roleIds) {
      state.roleIds = roleIds
    },
    setHasGetInfo (state, status) { // 设置是否获取了用户信息
      state.hasGetInfo = status
    },
    setUserMenu (state, list) { // 设置场景列表
      state.userMenu = list
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
            // commit('setHasGetInfo', true)
            Cookies.set('organizationId', data.organizationId)
            Cookies.set('userId', data.userId)
            Cookies.set('roleIds', data.roleIds)
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
        Cookies.remove('roleIds')
        Cookies.remove('userId')
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
    getMenus ({ state, commit }) {
      const roleIds = JSON.parse(Cookies.get('roleIds') || '[]')
      return new Promise((resolve, reject) => {
        try {
          const promises = roleIds.map(id => {
            return getMenus({ roleId: id })
          })
          Promise.all(promises).then(res => {
            console.log(res)
            commit('setHasGetInfo', true)
            commit('setUserMenu', res[0].data.data.list)
            resolve(res)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    getBtns ({ state, commit }) {
      // const roleIds = JSON.parse(Cookies.get('roleIds') || '[]')
      // return new Promise((resolve, reject) => {
      //   try {
      //     getBtnList(roleIds).then(res => {
      //       console.log(res)
      //       // commit('setBtnList', res.data.)
      //       resolve(res)
      //     })
      //   } catch (error) {
      //     reject(error)
      //   }
      // })
    }
  }
}
