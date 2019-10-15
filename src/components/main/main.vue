<template>
  <Layout style="height: 100%" class="main">
    <!-- 左侧菜单 -->
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden', background: sdierBgColor }">
      <side-menu v-if="isMenu" :theme="menuTheme" accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <p class="logo">智冷云</p>
        <!-- <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div> -->
      </side-menu>
      <side-menu v-else accordion ref="sideMenu2" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="userMenuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <p class="logo">智冷云</p>
        <!-- <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div> -->
      </side-menu>
    </Sider>

    <Layout>
      <Header class="header-con" :style="{ background: topBgColor }">
        <header-bar :theme="topTheme" :collapsed="collapsed" @on-coll-change="handleCollapsedChange" :active-name="topMenuActiveName" @on-select-top="handleSelectTopMenu">
          <Button type="text" style="height: 64px;font-size:24px" icon="md-more" @click="handleClickMore"></Button>
          <user :user-avatar="userAvatar" @on-control="handleClickControl"/>
          <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Drawer v-model="isShowMore">
        <Divider orientation="center">更多设置</Divider>
        <!-- 菜单颜色:  
        <ColorPicker v-model="color1" /> -->
        <div>
          侧边栏主题: 
          <RadioGroup v-model="menuTheme" @on-change="handleChangeMenuTheme">
            <Radio label="light"></Radio>
            <Radio label="dark"></Radio>
          </RadioGroup>
        </div>
        <div>
          顶栏主题:
          <RadioGroup v-model="topTheme" @on-change="handleChangeTopTheme">
            <Radio label="light"></Radio>
            <Radio label="dark"></Radio>
            <Radio label="primary"></Radio>
          </RadioGroup>
        </div>
      </Drawer>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import SideMenu from './components/side-menu/side-menu'
import HeaderBar from './components/header-bar/header-bar'
import TagsNav from './components/tags-nav/tags-nav'
import User from './components/user/user'
import ABackTop from './components/a-back-top/a-back-top'
import Fullscreen from './components/fullscreen/fullscreen'
import Language from './components/language/language'
import routers from '@/router/router'

import { getNewTagList, routeEqual } from '@/libs/util'
import { mapMutations, mapActions } from 'vuex'
import { localSave } from '@/libs/util'

export default {
  name: 'Main',
  data () {
    return {
      collapsed: false,
      isFullscreen: false,
      isMenu: true,
      topMenuActiveName: '1',
      isShowMore: false,
      sdierBgColor: '#001529',
      topBgColor: '#fff'
    }
  },
  components: {
    SideMenu,
    HeaderBar,
    TagsNav,
    User,
    ABackTop,
    Fullscreen,
    Language
  },
  computed: {
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    menuTheme: {
      get () {
        this.$store.state.app.menuTheme === 'light' ? this.sdierBgColor = '#fff' : this.sdierBgColor = '#001529'
        return this.$store.state.app.menuTheme
      },
      set () {}
    },
    topTheme: {
      get () {
        this.$store.state.app.topTheme === 'light' ? this.topBgColor = '#fff' : this.$store.state.app.topTheme === 'dark' ? this.topBgColor = '#001529' : this.topBgColor = 'linear-gradient(90deg,#1d42ab,#2173dc,#1e93ff)'
        return this.$store.state.app.topTheme
      },
      set (newVal) {}
    },
    menuList () { // 通过路由列表得到菜单列表
      return this.$store.getters.menuList
    },
    userMenuList () {
      return this.$store.getters.userMenuList
    },
    local () { // 设置当前语言
      return this.$store.state.app.local
    },
    cacheList () { // 缓存列表
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag',
      'setMenuTheme',
      'setTopTheme'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    handleSelectTopMenu (name) {
      if(name === '1') {
        this.isMenu = true
        this.$router.push({
        name: 'home'
      })
      } else {
        this.isMenu = false
        this.$router.push({
        name: 'user'
      })
      }
    },
    handleClickControl () {
      this.isMenu = false
      this.topMenuActiveName = '2'
      this.$router.push({
        name: 'user'
      })
    },
    handleClickMore () {
      this.isShowMore = true
    },
    handleChangeMenuTheme (e) {
      this.setMenuTheme(e)
      e === 'light' ? this.sdierBgColor = '#fff' : this.sdierBgColor = '#001529'
    },
    handleChangeTopTheme (e) {
      this.setTopTheme(e)
      e === 'light' ? this.topBgColor = '#fff' : e === 'dark' ? this.topBgColor = '#001529' : this.topBgColor = 'linear-gradient(90deg,#1d42ab,#2173dc,#1e93ff)'
    },
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleClick (item) { // tags点击事件
      this.turnToPage(item)
    },
    handleCloseTag (res, type, route) { // tags关闭按钮点击事件
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleCollapsedChange (state) { // 折叠图标点击事件
      this.collapsed = state
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  .logo {
    width: 100%;
    height: 64px;
    font-size: 30px;
    line-height: 64px;
    color: #fff;
    text-align: center;
    background: #155EFB;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  // .logo-con{
  //   height: 64px;
  //   padding: 10px;
  //   img{
  //     height: 44px;
  //     width: auto;
  //     display: block;
  //     margin: 0 auto;
  //   }
  // }
  .header-con{
    background: #fff;
    padding: 0 20px;
    width: 100%;
  }
  .main-layout-con{
    height: 100%;
    overflow: hidden;
  }
  .main-content-con{
    height: ~"calc(100% - 60px)";
    overflow: hidden;
  }
  .tag-nav-wrapper{
    padding: 0;
    height:40px;
    background:#F0F0F0;
  }
  .content-wrapper{
    padding: 18px;
    height: ~"calc(100% - 80px)";
    overflow: auto;
  }
  .left-sider{
    .ivu-layout-sider-children{
      overflow-y: scroll;
      margin-right: -18px;
    }
  }
}
.ivu-menu-item > i{
  margin-right: 12px !important;
}
.ivu-menu-submenu > .ivu-menu > .ivu-menu-item > i {
  margin-right: 8px !important;
}
.collased-menu-dropdown{
  width: 100%;
  margin: 0;
  line-height: normal;
  padding: 7px 0 6px 16px;
  clear: both;
  font-size: 12px !important;
  white-space: nowrap;
  list-style: none;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  &:hover{
    background: rgba(100, 100, 100, 0.1);
  }
  & * {
    color: #515a6e;
  }
  .ivu-menu-item > i{
    margin-right: 12px !important;
  }
  .ivu-menu-submenu > .ivu-menu > .ivu-menu-item > i {
    margin-right: 8px !important;
  }
}

.ivu-select-dropdown.ivu-dropdown-transfer{
  max-height: 400px;
}
.info-menu .ivu-btn-text:focus {
  box-shadow: none;
}
</style>
