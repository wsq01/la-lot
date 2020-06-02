<template>
    <Row type="flex" justify="center">
      <i-col span="6">
        <Form ref="formValidate" :model="formItem" :label-width="80" :rules="rules">
          <FormItem :label="formItemLabel[0]" prop="buttonName">
            <Select v-model="formItem.buttonName">
              <Option v-for="(item, index) in btnNameList" :key="index" :value="item.value">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[1]" prop="menuId">
            <Select v-model="formItem.menuId">
              <Option v-for="(item, index) in menuList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" style="margin: 5px" @click="submit('formValidate')">提交</Button>
            <Button @click="cancel" style="margin: 5px">取消</Button>
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
      ],
      rules: {
        buttonName: [
          { required: true, message: '名称不能为空', trigger: 'change' }
        ],
        menuId: [
          { required: true, message: '菜单不能为空', trigger: 'change' }
        ]
      }
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
    submit (name) {
      this.$refs[name].validate((valid) => {
        console.log(valid)
        if (valid) {
          if (this.$route.name === 'add-btn') {
            this.formItem.name = this.formItem.buttonName
            this.formItem.organizationId = this.$store.state.user.organizationId
            addBtn(this.formItem).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('添加成功！')
                this.cancel()
              } else {
                this.$Message.error(res.data.message)
              }
            })
          } else {
            editBtn(this.formItem).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('修改成功！')
                this.cancel()
              } else {
                this.$Message.error(res.data.message)
              }
            })
          }
        }
      })
    }
  },
  mounted () {
    if (this.menuList.length === 0) {
      this.getMenuList()
    }
    this.formItem = this.$route.params
    console.log(this.formItem)
  }
}
</script>

<style lang="less" scoped>

</style>
