<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key" class="search-item">
              <template v-for="item in searchKeyList">
                <Option v-if="item.key" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
              </template>
            </Select>
          </FormItem>
          <FormItem>
            <Select v-model="searchForm.value" class="search-item">
              <Option :value="0" >全部</Option>
              <template v-for="item in roleList">
                <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
              </template>
            </Select>
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
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>
    <Modal v-model="modalConfig.show" :width="400" :title="modalConfig.title">
      <Row type="flex" justify="center">
        <i-col span="24">
          <Form ref="formValidate" :model="formItem" :label-width="80" :rules="rules">
            <FormItem :label="formItemLabel[0]" prop="name">
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
              <Input v-model="formItem.uri" />
            </FormItem>
            <FormItem :label="formItemLabel[7]">
              <Input v-model="formItem.description" />
            </FormItem>
            <FormItem :label="formItemLabel[8]">
              <Input v-model="formItem.remark" type="textarea"/>
            </FormItem>
          </Form>
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="cancel" style="margin-righ: 8px">取消</Button>
        <Button type="primary" @click="modalSubmit('formValidate')">提交</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
import { getMenus, deleteMenus, getRole, addMenus, editMenus } from '@/api/user'
import minxin from '@/assets/js/mixin'

export default {
  name: 'Role',
  mixins: [ minxin ],
  data () {
    return {
      columns: [
        {
          title: '菜单ID',
          key: 'id',
          width: 230
        },
        {
          title: '父级ID',
          key: 'parentId',
          width: 80
        },
        {
          title: '菜单名称',
          key: 'name',
          width: 140
        },
        {
          title: '是否展示',
          key: 'isShow',
          width: 100
        },
        {
          title: '排序',
          key: 'short',
          width: 80
        },
        {
          title: '方法',
          key: 'method',
          width: 80
        },
        {
          title: 'URI',
          key: 'uri',
          width: 80
        },
        {
          title: '路径',
          key: 'path',
          width: 80
        },
        {
          title: '描述',
          key: 'description',
          width: 80
        },
        {
          title: '备注',
          key: 'remark',
          width: 80
        },
        {
          title: '子菜单',
          align: 'center',
          minWidth: 1606,
          className: 'no-padding no_border',
          render: (h, params) => {
            if (!params.row.childList) return
            return h('div', [
              h('Table', {
                props: {
                  columns: [
                    {
                      title: '菜单ID',
                      key: 'id',
                      width: '80'
                    },
                    {
                      title: '父级ID',
                      key: 'parentId',
                      width: '80'
                    },
                    {
                      title: '菜单名称',
                      key: 'name',
                      width: '80'
                    },
                    {
                      title: '是否展示',
                      key: 'isShow',
                      width: '80'
                    },
                    {
                      title: '排序',
                      key: 'short',
                      width: '80'
                    },
                    {
                      title: '方法',
                      key: 'method',
                      width: '80'
                    },
                    {
                      title: 'URI',
                      key: 'uri',
                      width: '80'
                    },
                    {
                      title: '路径',
                      key: 'path',
                      width: '80'
                    },
                    {
                      title: '描述',
                      key: 'description',
                      width: '80'
                    },
                    {
                      title: '备注',
                      key: 'remark',
                      width: '80'
                    },
                    {
                      title: '子菜单',
                      align: 'center',
                      width: '804',
                      className: 'no-padding no_border',
                      render: (h, sParams) => {
                        if (!sParams.row.childList) return
                        return h('div', [
                          h('Table', {
                            props: {
                              columns: [
                                {
                                  title: '菜单ID',
                                  key: 'id',
                                  width: '80'
                                },
                                {
                                  title: '父级ID',
                                  key: 'parentId',
                                  width: '80'
                                },
                                {
                                  title: '菜单名称',
                                  key: 'name',
                                  width: '80'
                                },
                                {
                                  title: '是否展示',
                                  key: 'isShow',
                                  width: '80'
                                },
                                {
                                  title: '排序',
                                  key: 'short',
                                  width: '80'
                                },
                                {
                                  title: '方法',
                                  key: 'method',
                                  width: '80'
                                },
                                {
                                  title: 'URI',
                                  key: 'uri',
                                  width: '80'
                                },
                                {
                                  title: '路径',
                                  key: 'path',
                                  width: '80'
                                },
                                {
                                  title: '描述',
                                  key: 'description',
                                  width: '80'
                                },
                                {
                                  title: '备注',
                                  key: 'remark',
                                  width: '80'
                                }
                              ],
                              data: sParams.row.childList
                            }
                          })
                        ])
                      }
                    }
                  ],
                  data: params.row.childList
                }
              })
            ])
          }
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 120,
          align: 'center',
          fixed: 'right'
        }
      ],
      searchKeyList: [
        { key: 'roleId', title: '角色' }
      ],
      modalConfig: {
        show: false,
        title: '',
        type: ''
      },
      roleList: [],
      rules: {
        name: [
          { required: true, message: '区域名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '区域类型不能为空', trigger: 'blur' }
        ],
        cityId: [
          { required: true, message: '城市不能为空', trigger: 'change' }
        ]
      },
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
  methods: {
    async getItems (params) {
      const res = await getMenus(params)
      this.getSuccess(res)
    },
    async deleteItem (row, index) {
      const res = await deleteMenus(row.id)
      this.deleteSuccess(res, index)
    },
    async getRole () {
      const res = await getRole()
      if (res.data.code === 0) {
        this.roleList = res.data.data.list
      }
    },
    modalSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          if (this.modalConfig.type === 'add') {
            try {
              const res = await addMenus(this.formItem)
              this.addSuccess(res)
            } catch (err) {
              this.$Message.error('服务器错误！')
            }
          } else {
            try {
              const res = await editMenus(this.formItem)
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
  }
}
</script>
