<template>
  <Card>
    <Row>
      <i-col :span="24">
          <Form :model="searchForm" inline :label-width="0">
            <FormItem>
              <Select v-model="searchForm.key" class="search-item">
                <template v-for="item in columns">
                  <Option v-if="item.key && item.key !== 'remark'" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
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
              <Poptip confirm title="确定要删除吗？" transfer @on-ok="handleDeleteBatch">
                <Button type="primary" icon="md-trash">批量删除</Button>
              </Poptip>
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
import { getArea, deleteArea, deleteAreaList } from '@/api/data'
export default {
  name: 'Area',
  data () {
    return {
      loading: true,
      total: 0,
      size: 10,
      columns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '区域ID',
          key: 'id',
          align: 'center'
        },
        {
          title: '区域名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '机构ID',
          key: 'organizationId',
          align: 'center'
        },
        {
          title: '城市ID',
          key: 'cityId',
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      tableData: [],
      selection: [],
      searchForm: {}
    }
  },
  methods: {
    // 获取列表
    getItems (params) {
      getArea(params).then(res => {
        this.loading = false
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    // 删除
    deleteItem (row, index) {
      deleteArea(row.id).then(res => {
        if (res.data.code === 0) {
          this.tableData.splice(index, 1)
        }
      })
    },
    addItem () {
      this.$router.push({
        name: 'add-area'
      })
    },
    editItem (row, index) {
      this.$router.push({
        name: 'edit-area',
        params: row
      })
    },
    // 批量删除
    handleDeleteBatch () {
      deleteAreaList(this.selection).then(res => {
        if (res.data.code === 0) {
          this.selection.forEach((item, index) => {
            this.tableData.forEach((sItem, sIndex) => {
              if (sItem.id === item.id) {
                this.tableData.splice(sIndex, 1)
              }
            })
          })
        }
      })
    },
    // 搜索清除
    handleClear (e) {
      if (e.target.value === '') this.getItems({ size: this.size })
    },
    // 搜索
    handleSearch () {
      const obj = {}
      obj[this.searchForm.key] = this.searchForm.value
      this.getItems(obj)
    },
    // 分页
    handleChangePage (e) {
      this.getItems({ size: this.size, index: e })
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
    // 设置默认的搜索key
    setDefaultSearchKey () {
      this.$set(this.searchForm, 'key', this.columns[0].key ? this.columns[0].key : this.columns[1].key)
    },
    // 多选
    handleSelectTableItem (selection, row) {
      this.selection = selection
    }
  },
  mounted () {
    this.getItems({ size: this.size })
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
