<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key" class="search-item">
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
        <Table :loading="loading" stripe border :columns="columns" :data="tableData" @on-select="handleSelectTableItem">
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
  </Card>
</template>

<script>
import { getRole, deleteRole } from '@/api/user'
export default {
  name: 'Role',
  data () {
    return {
      loading: true,
      total: 0,
      size: 10,
      columns: [
        {
          title: '角色ID',
          key: 'id'
        },
        {
          title: '角色名称',
          key: 'name'
        },
        {
          title: '机构ID',
          key: 'organizationId'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          slot: 'action',
          width: 130,
          align: 'center'
        }
      ],
      tableData: [],
      searchForm: {},
      selection: []
    }
  },
  methods: {
    // 获取列表
    getItems (params) {
      getRole(params).then(res => {
        this.loading = false
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    // 删除
    deleteItem (row, index) {
      deleteRole(row.id).then(res => {
        if (res.data.code === 0) {
          this.tableData.splice(index, 1)
        }
      })
    },
    addItem () {
      this.$router.push({
        name: 'add-user'
      })
    },
    editItem (row, index) {
      this.$router.push({
        name: 'edit-user',
        params: row
      })
    },
    // 分页
    handleChangePage (e) {
      this.getRole({ size: this.size, index: e })
    },
    // 多选
    handleSelectTableItem (selection, row) {
      this.selection = selection
    },
    // 搜索清除
    handleClear (e) {
      if (e.target.value === '') this.getRole({ size: this.size })
    },
    // 分页改变事件
    handlePageSizeChange (e) {
      this.size = e
      const searchObj = { size: this.size }
      if (this.searchForm.value) {
        Object.assign(searchObj, this.searchForm)
      }
      this.getItems(searchObj)
    },
    // 搜索
    handleSearch () {
      const obj = {}
      obj[this.searchForm.key] = this.searchForm.value
      this.getRole(obj)
    },
    // 设置默认的搜索key
    setDefaultSearchKey () {
      this.$set(this.searchForm, 'key', this.columns[0].key ? this.columns[0].key : this.columns[1].key)
    }
  },
  mounted () {
    this.getRole({ size: this.size })
    this.setDefaultSearchKey()
  }
}
</script>

<style lang="less" scoped>
.search-item {
  display: inline-block;
  width: 200px;
}
</style>
