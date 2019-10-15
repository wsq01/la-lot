<template>
  <Card>
    <Row>
      <i-col :span="24">
        <div class="search-con">
          <Select v-model="searchKey" class="search-col">
            <template v-for="item in searchKeyList">
              <Option v-if="item.key" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
            </template>
          </Select>
          <Select v-model="searchValue" class="search-col">
            <Option :value="0" >全部</Option>
            <template v-for="item in roleList">
              <Option :value="item.id" :key="`search-${item.key}`">{{item.name}}</Option>
            </template>
          </Select>
          <!-- <Input @on-change="handleClear" clearable placeholder="请输入关键字" v-model="searchValue" class="search-input" /> -->
          <Button @click="handleSearch" type="primary" class="search-btn"><Icon type="md-search" />&nbsp;&nbsp;搜索</Button>
          <Button @click="handleAdd" type="primary" class="search-btn"><Icon type="md-trash" />&nbsp;&nbsp;新增</Button>
        </div>
      </i-col>
    </Row>
    <Row>
      <i-col :span="24">
        <Table :loading="loading" stripe border :columns="columns" :data="tableData" @on-select="handleSelectTableItem">
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
export default {
  name: 'Role',
  data () {
    return {
      loading: false,
      total: 0,
      size: 10,
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
      tableData: [],
      searchKey: '',
      searchValue: '',
      selection: [],
      searchKeyList: [
        { key: 'roleId', title: '角色' }
      ],
      roleList: []
    }
  },
  methods: {
    // 获取列表
    getMenus (params) {
      getMenus(params).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    // 删除
    delOk (row, index) {
      deleteMenus(row.id).then(res => {
        if (res.data.code === 0) {
          this.tableData.splice(index, 1)
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
    },
    // 分页
    handleChangePage (e) {
      this.getMenus({ size: this.size, index: e })
    },
    // 多选
    handleSelectTableItem (selection, row) {
      this.selection = selection
    },
    // 搜索清除
    handleClear (e) {
      if (e.target.value === '') this.getMenus({ size: this.size })
    },
    // 搜索
    handleSearch () {
      if (this.searchValue === 0) {
        this.getMenus({ size: this.size })
      } else {
        const obj = {}
        obj[this.searchKey] = this.searchValue
        this.getMenus(obj)
      }
    },
    // 设置默认的搜索key
    setDefaultSearchKey () {
      this.searchKey = this.searchKeyList[0].key
    }
  },
  mounted () {
    this.getMenus({ size: this.size })
    getRole().then(res => {
      this.roleList = res.data.data.list
    })
    this.setDefaultSearchKey()
  }
}
</script>

<style lang="less" scoped>
.search {
  &-con {
    padding: 10px 0;
  }
  &-col {
    display: inline-block;
    width: 200px;
  }
  &-input {
    display: inline-block;
    width: 200px;
    margin-left: 2px;
  }
  &-btn {
    margin-left: 2px;
  }
}
</style>
