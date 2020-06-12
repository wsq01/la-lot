<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key" class="search-item">
              <template v-for="item in columns">
                <Option v-if="item.key && (item.key === 'userId' || item.key === 'roleId' || item.key === 'organizationId')" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
              </template>
            </Select>
          </FormItem>
          <FormItem>
            <Input @on-change="handleClear" clearable placeholder="请输入关键字" v-model="searchForm.value" class="search-item" />
          </FormItem>
          <FormItem>
            <Button @click="handleSearch" type="primary" icon="md-search">搜索</Button>
          </FormItem>
          <FormItem>
            <Button @click="addItem" type="primary" icon="md-add">新增</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
    <Row>
      <i-col :span="24">
        <Table :loading="loading" stripe border :columns="columns" :data="tableData" @on-selection-change="handleSelectTableItem">
          <template slot-scope="{row, index}" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="editItem(row, index)">编辑</Button>
            <Poptip confirm title="确定要删除吗？" transfer @on-ok="deleteItem(row, index)">
              <Button type="error" size="small">删除</Button>
            </Poptip>
          </template>
        </Table>
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" @on-page-size-change="handlePageSizeChange" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>

    <Modal v-model="modalConfig.show" :width="400" :title="modalConfig.title">
      <Row type="flex" justify="center">
        <i-col span="24">
          <Form ref="formValidate" :model="formItem" :label-width="80" :rules="rules">
            <FormItem :label="formItemLabel[0]" prop="name">
              <Input v-model="formItem.name" />
            </FormItem>
            <FormItem :label="formItemLabel[1]" prop="nameEn">
              <Input v-model="formItem.nameEn" />
            </FormItem>
            <FormItem :label="formItemLabel[2]" prop="password">
              <Input v-model="formItem.password" />
            </FormItem>
            <FormItem :label="formItemLabel[3]">
              <Select v-model="formItem.organizationId">
                <Option v-for="(item, index) in organizationList" :key="index" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="formItemLabel[4]" prop="roleId">
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
          </Form>
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="modalSubmit('formValidate')">提交</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
import { getUser, deleteUser, addUser, getOrganization, getRole, editUser } from '@/api/user'
import minxin from '@/assets/js/mixin'

export default {
  name: 'UserManager',
  mixins: [ minxin ],
  data () {
    return {
      columns: [
        {
          title: '用户ID',
          key: 'userId',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'userName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '英文名',
          key: 'userNameEn',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '角色ID',
          key: 'roleId',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '角色名',
          key: 'roleName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '角色备注',
          key: 'roleRemark',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '用户机构ID',
          key: 'userOrganizationId',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '用户机构名',
          key: 'organizationName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '手机号',
          key: 'mobile',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '邮箱',
          key: 'mail',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '登录时间',
          key: 'loginTime',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '短信报警',
          key: 'messagePush',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '微信报警',
          key: 'wechatPush',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 130,
          align: 'center',
          fixed: 'right'
        }
      ],
      modalConfig: {
        show: false,
        title: '',
        type: ''
      },
      formItemLabel: ['用户名', '用户名(英文)', '密码', '所属机构', '角色', '手机号', '邮箱', '备注'],
      formItem: {},
      organizationList: [],
      roleList: [],
      rules: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        nameEn: [
          { required: true, message: '英文用户名不能为空', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '角色不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async getItems (params) {
      const res = await getUser(params)
      this.getSuccess(res)
    },
    async deleteItem (row, index) {
      const res = await deleteUser(row.userId)
      this.deleteSuccess(res, index)
    },
    handleSelectRole (e) {
      this.formItem.roleName = e.label
    },
    modalSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          if (this.modalConfig.type === 'add') {
            try {
              const res = await addUser(this.formItem)
              if (res.data.code === 0) {
                this.$set(this.modalConfig, 'show', false)
                this.getItems()
                this.$Message.success('添加成功！')
              } else {
                this.$Message.error(res.data.message)
              }
            } catch (err) {
              this.$Message.error('服务器错误！')
            }
          } else {
            try {
              const res = await editUser(this.formItem)
              if (res.data.code === 0) {
                this.$set(this.modalConfig, 'show', false)
                this.$Message.success('修改成功！')
              } else {
                this.$Message.error(res.data.message)
              }
            } catch (err) {
              this.$Message.error('服务器错误！')
            }
          }
        }
      })
    },
    cancel () {
      this.$set(this.modalConfig, 'show', false)
    },
    async getOrganization () {
      const res = await getOrganization()
      if (res.data.code === 0) {
        this.organizationList = res.data.data.list
      }
    },
    async getRole () {
      const res = await getRole()
      if (res.data.code === 0) {
        this.roleList = res.data.data.list
      }
    }
  },
  mounted () {
    this.getOrganization()
    this.getRole()
  }
}
</script>

<style lang="less" scoped>
.search-item {
  display: inline-block;
  width: 200px;
}
</style>
