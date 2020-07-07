import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead
} from '@/libs/util'
import { getCityListByOid, getAreaList, getSceneList } from '@/api/data'
import { getOrganizationList, getMenus, getRole } from '@/api/user'
import router from '@/router'
import { defaultRoutes } from '@/router/router'
import config from '@/config'
const { homeName } = config
const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [], // 面包屑导航列表
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'), // 语言
    cityList: [],
    areaList: [],
    sceneList: [],
    organizationList: [],
    menuList: [], // 全部menu
    roleList: [],
    socketMsg: '{}',
    menuTheme: localRead('menuTheme') || 'dark',
    topTheme: localRead('topTheme') || 'light',
    computedMenuList: []
  },
  getters: {
    // 从路由获取菜单列表
    // rootState 根节点状态
    getMenuList: (state, getters, rootState) => state.computedMenuList
  },
  mutations: {
    resetAppData (state) {
      state.cityList = []
      state.areaList = []
      state.roleList = []
      state.menuList = []
      state.sceneList = []
      state.tagNavList = []
      state.computedMenuList = []
    },
    setBreadCrumb (state, route) { // 设置面包屑导航
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setSocketMsg (state, msg) {
      state.socketMsg = msg
    },
    setHomeRoute (state, defaultRoutes) { // 设置首页路由
      state.homeRoute = getHomeRoute(defaultRoutes, homeName)
    },
    setTagNavList (state, list) { // 设置标签导航列表
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    setCityList (state, list) { // 设置城市列表
      state.cityList = list
    },
    setAreaList (state, list) { // 设置区域列表
      state.areaList = list
    },
    setOrganizationList (state, list) { // 设置区域列表
      state.organizationList = list
    },
    setSceneList (state, list) { // 设置场景列表
      state.sceneList = list
    },
    setRoleList (state, list) { // 设置场景列表
      state.roleList = list
    },
    setMenuList (state, list) { // 设置场景列表
      state.menuList = list
    },
    setComputedMenuList (state, list) { // 设置场景列表
      state.computedMenuList = list
    },
    closeTag (state, route) { // 关闭标签导航页
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag (state, { route, type = 'unshift' }) { // 添加标签导航页
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) { // 设置语言
      localSave('local', lang) // 存localStoarage
      state.local = lang
    },
    setMenuTheme (state, lang) { // 设置语言
      localSave('menuTheme', lang) // 存localStoarage
      state.menuTheme = lang
    },
    setTopTheme (state, lang) { // 设置语言
      localSave('topTheme', lang) // 存localStoarage
      state.topTheme = lang
    }
  },
  actions: {
    reqSocketMsg ({ state, commit }, msg) {
      return new Promise((resolve, reject) => {
        try {
          setTimeout(() => {
            commit('setSocketMsg', msg)
            resolve(msg)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    getCityList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getCityListByOid().then(res => {
            const data = res.data.data.list
            commit('setCityList', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    setComputedMenuList ({ state, commit, rootState }) {
      commit('setComputedMenuList', getMenuByRouter(defaultRoutes, rootState.user.access))
    },
    getAreaList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getAreaList().then(res => {
            const data = res.data.data.list
            commit('setAreaList', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    getSceneList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getSceneList().then(res => {
            const data = res.data.data.list
            commit('setSceneList', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    getOrganizationList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getOrganizationList().then(res => {
            const data = res.data.data.list
            commit('setOrganizationList', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    getRoleList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getRole().then(res => {
            const data = res.data.data.list
            commit('setRoleList', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    getMenuList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getMenus().then(res => {
            const data = res.data.data.list
            commit('setMenuList', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
