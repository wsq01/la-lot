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
            <Button @click="handleAdd" type="primary" icon="md-add">新增</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
    <Row>
      <i-col :span="24">
        <Table :loading="loading" stripe border :columns="columns" :data="tableData" @on-select-change="handleSelectTableItem">
          <template slot-scope="{row, index}" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row, index)">编辑</Button>
            <Poptip confirm title="确定要删除吗？" transfer @on-ok="delOk(row, index)">
              <Button type="error" size="small">删除</Button>
            </Poptip>
          </template>
        </Table>
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>
  </Card>
</template>

<script>
import { getMenus, deleteMenus, getRole } from '@/api/user'
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
          width: '230'
        },
        {
          title: '父级ID',
          key: 'parentId',
          width: '80'
        },
        {
          title: '菜单名称',
          key: 'name',
          width: '140'
        },
        {
          title: '是否展示',
          key: 'isShow',
          width: '100'
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
          width: '1606',
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
          width: 130,
          align: 'center',
          fixed: 'right'
        }
      ],
      searchKeyList: [
        { key: 'roleId', title: '角色' }
      ],
      roleList: []
    }
  },
  methods: {
    // 获取列表
    getItems (params) {
      getMenus(params).then(res => {
        this.getSuccess(res)
      })
    },
    // 删除
    delOk (row, index) {
      deleteMenus(row.id).then(res => {
        if (res.data.code === 0) {
          this.tableData.splice(index, 1)
          this.$Message.success('删除成功！')
        } else {
          this.$Message.warning(res.data.message)
        }
      })
    },
    handleAdd () {
      this.$router.push({
        name: 'add-menus'
      })
    },
    edit (row, index) {
      this.$router.push({
        name: 'edit-menus',
        params: row
      })
    }
  },
  mounted () {
    getRole().then(res => {
      this.roleList = res.data.data.list
    })
  }
}
</script>
