<template>
    <Row type="flex" justify="center">
      <i-col span="6">
        <Form :model="formItem" :label-width="80">
          <FormItem :label="formItemLabel[0]">
            <Input v-model="formItem.name" />
          </FormItem>
          <FormItem :label="formItemLabel[1]">
            <Select v-model="formItem.parentId">
              <Option value="0">无</Option>
              <Option v-for="(item, index) in menuList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[2]">
            <Input v-model="formItem.method" />
          </FormItem>
          <FormItem :label="formItemLabel[3]">
            <Select v-model="formItem.isShow">
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[4]">
            <Input v-model="formItem.path" />
          </FormItem>
          <FormItem :label="formItemLabel[5]">
            <Select v-model="formItem.sort">
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[6]">
            <Select v-model="formItem.uri">
              <Option v-for="(item, index) in uriList" :key="index" :value="item.value">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[7]">
            <Input v-model="formItem.description" />
          </FormItem>
          <FormItem :label="formItemLabel[8]">
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
import { addMenus, editMenus } from '@/api/user'
export default {
  name: 'EditArea',
  data () {
    return {
      formItemLabel: ['菜单名称', '父级', '方法', '是否展示', '路径', '排序', 'URI', '描述', '备注'],
      formItem: {},
      uriList: [
        {
          name: '区域管理',
          value: '/area'
        },
        {
          name: '场景管理',
          value: '/scene'
        },
        {
          name: '接收器管理',
          value: 'receiver'
        },
        {
          name: '资产管理',
          value: 'device'
        },
        {
          name: '资产类型管理',
          value: 'devicetype'
        },
        {
          name: '流动资产调拨',
          value: '/allot'
        },
        {
          name: '盘点',
          value: '/check'
        },
        {
          name: '资产数据',
          value: '/devicedata'
        },
        {
          name: '用户管理',
          value: '/user'
        },
        {
          name: '角色管理',
          value: '/role'
        },
        {
          name: '菜单管理',
          value: '/menus'
        },
        {
          name: '机构管理',
          value: '/organization'
        },
        {
          name: '按钮管理',
          value: '/btn'
        },
        {
          name: '用户角色关联管理',
          value: '/reluser'
        },
        {
          name: '菜单角色关联管理',
          value: '/relmenu'
        },
        {
          name: '资源角色关联管理',
          value: '/relresource'
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
      if (this.$route.name === 'edit-menus') {
        this.closeTag({
          name: 'edit-menus',
          params: this.$route.params
        })
      } else {
        this.closeTag({
          name: 'add-menus',
          params: this.$route.params
        })
      }
    },
    submit () {
      if (this.$route.name === 'add-menus') {
        this.formItem.organizationId = this.$store.state.user.organizationId
        addMenus(this.formItem).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('添加成功！')
            this.getMenuList()
            this.cancel()
          } else {
            this.$Message.warning(res.data.message)
          }
        })
      } else {
        editMenus(this.formItem).then(res => {
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
    if (this.menuList.length === 0) {
      this.getMenuList()
    }
    this.formItem = this.$route.params
  }
}
</script>

<style lang="less" scoped>

</style>
