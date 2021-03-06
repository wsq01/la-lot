import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'

import { setToken, getToken, canTurnTo, setTitle, initDynamicRouter } from '@/libs/util'
import config from '@/config'
import store from '@/store'
import { defaultRoutes, dynamicRoutes } from './router.js'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: defaultRoutes
})
const LOGIN_PAGE_NAME = 'login'
const { homeName } = config
const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, defaultRoutes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    next({
      name: LOGIN_PAGE_NAME
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    next()
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    next({
      name: homeName
    })
  } else {
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {
      store.dispatch('getMenus').then(res => {
        if (!res) {
          setToken('')
          next({
            name: LOGIN_PAGE_NAME
          })
        }
        if (res[0]) {
          if (res[0].data && (res[0].data.code === 1200 || res[0].data.code === 1201)) {
            alert(res[0].data.message)
            return false
          }
          const dynamicRouters = initDynamicRouter(res[0].data.data.list, dynamicRoutes)
          dynamicRouters.forEach(item => router.options.routes.push(item))
          router.addRoutes(dynamicRouters)
          store.dispatch('setComputedMenuList').then(res => {
            turnTo(to, store.state.user.access, next)
          })
          // next()
        }
      }).catch((res) => {
        setToken('')
        next({
          name: LOGIN_PAGE_NAME
        })
      })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
