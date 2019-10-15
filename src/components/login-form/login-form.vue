<template>
  <div style="height: 100%;">
    <p class="title">智冷云平台</p>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
      <FormItem prop="userName">
        <Input v-model="form.userName" size="large" placeholder="请输入用户名">
          <span slot="prepend">
            <Icon :size="20" type="ios-person"></Icon>
          </span>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="form.password" size="large" placeholder="请输入密码">
          <span slot="prepend">
            <Icon :size="20" type="md-lock"></Icon>
          </span>
        </Input>
      </FormItem>
      <FormItem>
        <Button @click="handleSubmit" size="large" :loading="loading" type="default" long>登录</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  props: {
    userNameRules: { // 用户名验证规则
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: { // 密码验证规则
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        userName: 'admin',
        password: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            username: this.form.userName,
            password: this.form.password
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: 30px;
  text-align: center;
  color: #fff;
  margin: 30px auto;
}
</style>
