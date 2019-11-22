<template>
    <Row type="flex" justify="center">
      <i-col span="6">
        <Form :model="formItem" :label-width="80">
          <FormItem :label="formItemLabel[0]">
            <Select v-model="formItem.name">
              <Option v-for="(item, index) in btnNameList" :key="index" :value="item.value">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[1]">
            <Select v-model="formItem.menuId">
              <Option v-for="(item, index) in menuList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
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
import { addBtn, editBtn } from '@/api/user'
export default {
  name: 'EditArea',
  data () {
    return {
      formItemLabel: ['名称', '菜单ID'],
      formItem: {},
      btnNameList: [
        {
          name: '新增',
          value: 'ADD'
        },
        {
          name: '删除',
          value: 'DELETE'
        },
        {
          name: '批量删除',
          value: 'DELETEBATCH'
        },
        {
          name: '编辑',
          value: 'EDIT'
        }
      ]
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
      if (this.$route.name === 'edit-btn') {
        this.closeTag({
          name: 'edit-btn',
          params: this.$route.params
        })
      } else {
        this.closeTag({
          name: 'add-btn',
          params: this.$route.params
        })
      }
    },
    submit () {
      if (this.$route.name === 'add-btn') {
        this.formItem.organizationId = this.$store.state.user.organizationId
        addBtn(this.formItem).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('添加成功！')
            this.cancel()
          }
        })
      } else {
        editBtn(this.formItem).then(res => {
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
    this.formItem = this.$route.params
  }
}
</script>

<style lang="less" scoped>

</style>
