<template>
    <Row type="flex" justify="center">
      <i-col span="6">
        <Form :model="formItem" :label-width="80">
          <FormItem :label="formItemLabel[0]">
            <Input v-model="formItem.name" />
          </FormItem>
          <FormItem :label="formItemLabel[1]">
            <Input v-model="formItem.nameEn" />
          </FormItem>
          <FormItem :label="formItemLabel[2]">
            <Input v-model="formItem.password" />
          </FormItem>
          <FormItem :label="formItemLabel[3]">
            <Select v-model="formItem.organizationId">
              <Option v-for="(item, index) in organizationList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[4]">
            <Select v-model="formItem.roleId" label-in-value @on-change="handleSelectRole">
              <Option v-for="(item, index) in roleList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[5]">
            <Input v-model="formItem.mobile" />
          </FormItem>
          <FormItem :label="formItemLabel[6]">
            <Input v-model="formItem.mail" />
          </FormItem>
          <FormItem :label="formItemLabel[7]">
            <Input v-model="formItem.remark" type="textarea"/>
          </FormItem>
          <FormItem :label="'报警推送'">
            <Checkbox v-model="formItem.wechatPush" :true-value="1" :false-value="0">
              <span>微信</span>
            </Checkbox>
            <Checkbox v-model="formItem.messagePush" :true-value="1" :false-value="0">
                <span>短信</span>
            </Checkbox>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submit">提交</Button>
            <Button @click="cancel" style="margin-left: 5px">取消</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { addUser, getOrganization, getRole } from '@/api/user'
export default {
  name: 'EditArea',
  data () {
    return {
      formItemLabel: ['用户名', '用户名(英文)', '密码','所属机构','角色','手机号','邮箱', '备注'],
      formItem: {},
      organizationList: [],
      roleList: []
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    cancel () {
      if (this.$route.name === 'edit-user') {
        this.closeTag({
          name: 'edit-user',
          params: this.$route.params
        })
      } else {
        this.closeTag({
          name: 'add-user',
          params: this.$route.params
        })
      }
    },
    handleSelectRole (e) {
      this.formItem.roleName = e.label
    },
    submit () {
      if (this.$route.name === 'edit-user') {
        this.formItem.organizationId = this.$route.params.userOrganizationId
      }
      addUser(this.formItem).then(res => {
        if (res.data.code === 0) {
          this.cancel()
        }
      })
    }
  },
  mounted () {
    getOrganization().then(res => {
      this.organizationList = res.data.data.list
    }).then(() => {
      return getRole()
    }).then(res => {
      this.roleList = res.data.data.list
    }).then(() => {
      this.formItem = this.$route.params  
      if (this.$route.name === 'edit-user') {
        this.formItem.organizationId = this.$route.params.userOrganizationId
      }
    })
  }
}
</script>

<style lang="less" scoped>

</style>
