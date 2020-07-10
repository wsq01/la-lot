<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key">
              <template v-for="item in columns">
                <Option v-if="item.key" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
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
        <Table :loading="loading" stripe border :columns="columns" :data="tableData" @on-select-change="handleSelectTableItem">
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
            <FormItem :label="formItemLabel[0]" prop="roleId">
              <Select v-model="formItem.roleId" label-in-value>
                <Option v-for="(item, index) in roleList" :key="index" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="formItemLabel[1]" prop="userId">
              <Select v-model="formItem.userId" label-in-value>
                <Option v-for="(item, index) in roleList" :key="index" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="formItemLabel[2]">
              <Input v-model="formItem.remark" type="textarea"/>
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
import { getReluser, deleteReluser, addReluser, editReluser, getRole, getUser } from '@/api/user'
import minxin from '@/assets/js/mixin'

export default {
  name: 'Role',
  mixins: [ minxin ],
  data () {
    return {
      columns: [
        {
          title: '角色ID',
          key: 'id',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '角色名称',
          key: 'name',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '机构ID',
          key: 'organizationId',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 120,
          align: 'center'
        }
      ],
      roleList: [],
      userList: [],
      formItemLabel: ['角色ID', '用户ID', '备注'],
      formItem: {},
      modalConfig: {
        show: false,
        title: '',
        type: ''
      },
      rules: {
        roleId: [
          { required: true, message: '角色不能为空', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '用户不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async getItems (params) {
      const res = await getReluser(params)
      this.getSuccess(res)
    },
    async deleteItem (row, index) {
      const res = await deleteReluser(row.id)
      this.deleteSuccess(res, index)
    },
    async getRole () {
      const res = await getRole()
      if (res.data.code === 0) {
        this.roleList = res.data.data.list
      }
    },
    async getUser () {
      const res = await getUser()
      if (res.data.code === 0) {
        this.userList = res.data.data.list
      }
    },
    modalSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          if (this.modalConfig.type === 'add') {
            try {
              const res = await addReluser(this.formItem)
              this.addSuccess(res)
            } catch (err) {
              this.$Message.error('服务器错误！')
            }
          } else {
            try {
              const res = await editReluser(this.formItem)
              this.editSuccess(res)
            } catch (err) {
              this.$Message.error('服务器错误！')
            }
          }
        }
      })
    },
    cancel () {
      this.$set(this.modalConfig, 'show', false)
    }
  },
  mounted () {
    this.getRole()
    this.getUser()
  }
}
</script>

<style lang="less" scoped>
.search-item {
  display: inline-block;
  width: 200px;
}
</style>
