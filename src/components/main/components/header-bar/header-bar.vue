<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollapsedChange"></sider-trigger>
    <Menu class="top-menu" mode="horizontal" :active-name="activeName" @on-select="handleSelect" :theme="theme">
        <MenuItem name="1">
            <Icon type="ios-paper" />
            LA-IOT
        </MenuItem>
        <MenuItem name="2" v-if="isShowUserController != 0">
            <Icon type="ios-people" />
            用户中心
        </MenuItem>
    </Menu>
    <!-- <custom-bread-crumb show-icon style="margin-left: 30px;display: none" :list="breadCrumbList"></custom-bread-crumb> -->
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import SiderTrigger from './sider-trigger'
// import CustomBreadCrumb from './custom-bread-crumb'

export default {
  name: 'HeaderBar',
  data () {
    return {}
  },
  props: {
    collapsed: Boolean,
    activeName: String,
    theme: String,
    isShowUserController: Number
  },
  components: {
    SiderTrigger
    // CustomBreadCrumb
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  methods: {
    handleSelect (name) { // 选择菜单（MenuItem）时触发
      this.$emit('on-select-top', name)
    },
    handleCollapsedChange (state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>

<style lang="less" scoped>
.header-bar{
  width: 100%;
  height: 100%;
  position: relative;
  .custom-content-con{
    float: right;
    height: auto;
    // padding-right: 20px;
    line-height: 64px;
    & > *{
      float: right;
    }
  }
}
.top-menu {
  display: inline-block;
  vertical-align: top;
  height: 100%;
}
</style>
