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
            <FormItem :label="formItemLabel[0]" prop="menuId">
              <Select v-model="formItem.menuId">
                <Option value="">无</Option>
                <Option v-for="(item, index) in menuList" :key="index" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="formItemLabel[1]" prop="roleId">
              <Select v-model="formItem.roleId" label-in-value>
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
import { getRelmenu, deleteRelmenu, addRelmenu, editRelmenu, getRole, getMenus } from '@/api/user'
import minxin from '@/assets/js/mixin'

export default {
  name: 'relmenu',
  mixins: [ minxin ],
  data () {
    return {
      columns: [
        {
          title: '角色ID',
          key: 'roleId',
          minWidth: 130,
          align: 'center'
        },
        {
          title: '菜单ID',
          key: 'menuId',
          minWidth: 130,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 120,
          align: 'center'
        }
      ],
      formItemLabel: ['菜单ID', '角色ID', '备注'],
      formItem: {},
      roleList: [],
      menuList: [],
      modalConfig: {
        show: false,
        title: '',
        type: ''
      },
      rules: {
        roleId: [
          { required: true, message: '角色不能为空', trigger: 'change' }
        ],
        menuId: [
          { required: true, message: '菜单不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async getItems (params) {
      const res = await getRelmenu(params)
      this.getSuccess(res)
    },
    async deleteItem (row, index) {
      const res = await deleteRelmenu(row.id)
      this.deleteSuccess(res, index)
    },
    modalSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          if (this.modalConfig.type === 'add') {
            try {
              const res = await addRelmenu(this.formItem)
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
              const res = await editRelmenu(this.formItem)
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
    async getRole () {
      const res = await getRole()
      if (res.data.code === 0) {
        this.roleList = res.data.data.list
      }
    },
    async getMenus () {
      const res = await getMenus()
      if (res.data.code === 0) {
        this.menuList = res.data.data.list
      }
    }
  },
  mounted () {
    this.getRole()
    this.getMenus()
  }
}
</script>

<style lang="less" scoped>
.search-item {
  display: inline-block;
  width: 200px;
}

</style>
