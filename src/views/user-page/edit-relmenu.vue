<template>
    <Row type="flex" justify="center">
      <i-col span="6">
        <Form :model="formItem" :label-width="80">
          <FormItem :label="formItemLabel[0]">
            <Select v-model="formItem.menuId">
              <Option value="">无</Option>
              <Option v-for="(item, index) in menuList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[1]">
            <Select v-model="formItem.roleId" label-in-value>
              <Option v-for="(item, index) in roleList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
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
import { mapState, mapMutations, mapActions } from 'vuex'
import { addRelmenu, editRelmenu, getRole } from '@/api/user'
export default {
  name: 'EditArea',
  data () {
    return {
      formItemLabel: ['菜单ID', '角色ID', '备注'],
      formItem: {},
      roleList: []
    }
  },
  computed: {
    ...mapState({
      menuList: state => state.app.menuList
    })
  },
  methods: {
    ...mapActions(['getMenuList']),
    ...mapMutations([
      'closeTag'
    ]),
    cancel () {
      if (this.$route.name === 'edit-relmenu') {
        this.closeTag({
          name: 'edit-relmenu',
          params: this.$route.params
        })
      } else {
        this.closeTag({
          name: 'add-relmenu',
          params: this.$route.params
        })
      }
    },
    submit () {
      if (this.$route.name === 'add-relmenu') {
        this.formItem.organizationId = this.$store.state.user.organizationId
        addRelmenu(this.formItem).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('添加成功！')
            this.cancel()
          }
        })
      } else {
        editRelmenu(this.formItem).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('修改成功！')
            this.cancel()
          }
        })
      }
    }
  },
  mounted () {
    if (this.menuList.length === 0) {
      this.getMenuList()
    }
    getRole().then(res => {
      this.roleList = res.data.data.list
    })
    this.formItem = this.$route.params
  }
}
</script>

<style lang="less" scoped>

</style>
