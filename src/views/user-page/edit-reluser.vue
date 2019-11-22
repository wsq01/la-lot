<template>
    <Row type="flex" justify="center">
      <i-col span="6">
        <Form :model="formItem" :label-width="80">
          <FormItem :label="formItemLabel[0]">
            <Select v-model="formItem.roleId" label-in-value>
              <Option v-for="(item, index) in roleList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[1]">
            <Input v-model="formItem.userId" />
          </FormItem>
          <FormItem :label="formItemLabel[2]">
            <Input v-model="formItem.remark" type="textarea"/>
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
import { mapMutations } from 'vuex'
import { addReluser, editReluser, getRole } from '@/api/user'
export default {
  name: 'EditArea',
  data () {
    return {
      formItemLabel: ['角色ID', '用户ID', '备注'],
      formItem: {}
    }
  },
  computed: {
    // ...mapState({
    //   userList: state => state.app.userList
    // })
  },
  methods: {
    // ...mapActions(['getAreaList']),
    ...mapMutations([
      'closeTag'
    ]),
    cancel () {
      if (this.$route.name === 'edit-reluser') {
        this.closeTag({
          name: 'edit-reluser',
          params: this.$route.params
        })
      } else {
        this.closeTag({
          name: 'add-reluser',
          params: this.$route.params
        })
      }
    },
    submit () {
      if (this.$route.name === 'add-reluser') {
        this.formItem.organizationId = this.$store.state.user.organizationId
        addReluser(this.formItem).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('添加成功！')
            this.cancel()
          } else {
            this.$Message.warning(res.data.message)
          }
        })
      } else {
        editReluser(this.formItem).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('修改成功！')
            this.cancel()
          } else {
            this.$Message.warning(res.data.message)
          }
        })
      }
    }
  },
  mounted () {
    // if (this.areaList.length === 0) {
    //   this.getAreaList()
    // }
    getRole().then(res => {
      this.roleList = res.data.data.list
    })
    this.formItem = this.$route.params
  }
}
</script>

<style lang="less" scoped>

</style>
