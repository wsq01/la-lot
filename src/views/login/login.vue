<template>
  <div class="login">
    <Layout style="background:transparent">
      <Header class="login-header">
        <Row type="flex" align="middle" justify="space-between">
          <i-col :span="4" style="line-height: 1">
            <img src="../../assets/images/logo.png" alt="">
          </i-col>
          <i-col :span="3">
            <div class='headerWrap'>
              <a href="home.html">返回首页</a>
            </div>
          </i-col>
        </Row>
      </Header>
      <Content class="login-content">
        <Card icon="log-in" :bordered="false" style="background: transparent">
          <Row>
            <i-col :md="12" :xs="0" :xxl="{span: 9, offset: 3}">
              <div>
                <img src="../../assets/images/login_left.png" style="height: 510px;width: 100%" alt="">
              </div>
            </i-col>
            <i-col :span="12" :xs="24" :md="12" :xxl="{span: 9}">
                <div class="form-con">
                  <login-form @on-success-valid="handleSubmit" :loading="loading"></login-form>
                </div>
            </i-col>
          </Row>
        </Card>
      </Content>
    </Layout>
  </div>
</template>

<script>
import LoginForm from '@/components/login-form/login-form'

import { mapActions } from 'vuex'
export default {
  data () {
    return {
      loading: false
    }
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(['handleLogin']),
    async handleSubmit ({ username, password }) {
      this.loading = true
      const res = await this.handleLogin({ username, password })
      this.loading = false
      if (res.data && res.data.code === 0) {
        this.$router.push({
          name: this.$config.homeName
        })
      } else {
        this.$Message.error({
          content: (res.data && res.data.message) || '登录失败',
          duration: 2
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/login.png");
  background-size: cover;
  background-position: center;
  position: relative;
  &-header {
    padding: 0;
    text-align: center;
  }
  &-content {
    width: 74%;
    position: absolute;
    top: 25%;
    left: 13%;
    border-radius: 10px;
    height: 60%;
  }
  .form-con {
    background: rgba(6,88,255,0.7);
    height: 510px;
    padding: 80px;
  }
  .headerWrap a{
    height: 100%;
    display: block;
    background: #0658FF;
    text-align: center;
    color: #fff;
    cursor: pointer;
  }
  .ivu-layout-header {
    background: rgba(0, 0, 0, 0.7)
  }
}
</style>
