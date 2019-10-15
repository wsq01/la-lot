<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <span>{{userName}}</span>
      <Avatar :src="userAvatar" style="background-color: #155efb" icon="ios-person" />
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="control">用户中心</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { mapActions,mapMutations } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    }
  },
  computed: {
    userName () {
      return this.$store.state.user.userName
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    control () {
      this.$emit('on-control')
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'control': this.control()
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user{
  &-avatar-dropdown{
    cursor: pointer;
    display: inline-block;
    // height: 64px;
    vertical-align: middle;
    // line-height: 64px;
    .ivu-badge-dot{
      top: 16px;
    }
  }
}
</style>
