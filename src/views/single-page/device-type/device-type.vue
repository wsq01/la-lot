<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key" class="search-col">
              <template v-for="item in columns">
                <Option v-if="item.key && item.key === 'id'" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
              </template>
            </Select>
          </FormItem>
          <FormItem>
            <Input @on-change="handleClear" clearable placeholder="请输入关键字" v-model="searchForm.value" class="search-input" />
          </FormItem>
          <FormItem>
            <Button @click="handleSearch" type="primary" class="search-btn"><Icon type="md-search" />&nbsp;&nbsp;搜索</Button>
          </FormItem>
          <FormItem>
            <Button @click="addItem" type="primary" class="search-btn"><Icon type="md-trash" />&nbsp;&nbsp;新增</Button>
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
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>
  </Card>
</template>

<script>
import { getDeviceTypeList, deleteDeviceType, getDeviceTypeById } from '@/api/data'
export default {
  name: 'DeviceType',
  data () {
    return {
      loading: false,
      total: 0,
      size: 10,
      columns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '设备类型ID',
          key: 'id'
        },
        {
          title: '设备类型名称',
          key: 'name'
        },
        {
          title: '设备类型编号',
          key: 'code'
        },
        {
          title: '设备类型级别',
          key: 'level'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          slot: 'action',
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
    getDeviceTypeList (params) {
      getDeviceTypeList(params).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    // 删除
    deleteItem (row, index) {
      deleteDeviceType(row.id).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.tableData.splice(index, 1)
        }
      })
    },
    addItem () {
      this.$router.push({
        name: 'add-type'
      })
    },
    editItem (row, index) {
      this.$router.push({
        name: 'edit-type',
        params: row
      })
    },
    // 分页
    handleChangePage (e) {
      this.getDeviceTypeList({ size: this.size, index: e })
    },
    // 多选
    handleSelectTableItem (selection, row) {
      this.selection = selection
    },
    // 搜索清除
    handleClear (e) {
      if (e.target.value === '') this.getDeviceTypeList({ size: this.size })
    },
    // 搜索
    handleSearch () {
      const obj = {}
      obj[this.searchForm.key] = this.searchForm.value
      getDeviceTypeById(this.searchForm.value).then(res => {
        if (res.data.code === 0) {
          this.tableData = []
          this.tableData.push(res.data.data)
          this.total = res.data.seqnum
        }
      })
    },
    // 设置默认的搜索key
    setDefaultSearchKey () {
      this.$set(this.searchForm, 'key', this.columns[0].key ? this.columns[0].key : this.columns[1].key)
    }
  },
  mounted () {
    this.getDeviceTypeList({ size: this.size })
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
