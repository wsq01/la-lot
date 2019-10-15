<template>
  <Card>
    <Row>
      <i-col :span="24">
        <div class="search-con">
          <Select v-model="searchKey" class="search-col">
            <template v-for="item in columns">
              <Option v-if="item.key && item.key !== 'remark'" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
            </template>
          </Select>
          <Input @on-change="handleClear" clearable placeholder="请输入关键字" v-model="searchValue" class="search-input" />
          <Button @click="handleSearch" type="primary" class="search-btn"><Icon type="md-search" />&nbsp;&nbsp;搜索</Button>
          <Button @click="handleAdd" type="primary" class="search-btn"><Icon type="md-trash" />&nbsp;&nbsp;新增</Button>
          <Poptip confirm title="确定要删除吗？" transfer @on-ok="handleDeleteBatch">
            <Button type="primary" class="search-btn"><Icon type="md-trash" />&nbsp;&nbsp;批量删除</Button>
          </Poptip>
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
import { getDevice, deleteDevice, deleteDeviceList } from '@/api/data'
export default {
  name: 'Device',
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
          title: '设备ID',
          key: 'id'
        },
        {
          title: '设备名称',
          key: 'name'
        },
        {
          title: '设备编号',
          key: 'deviceNum'
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '设备类型',
          key: 'deviceType'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      tableData: [],
      searchKey: '',
      searchValue: '',
      selection: []
    }
  },
  methods: {
    // 获取列表
    getDevice (params) {
      getDevice(params).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    // 删除
    delOk (row, index) {
      deleteDevice(row.id).then(res => {
        if (res.data.code === 0) {
          this.tableData.splice(index, 1)
        }
      })
    },
    handleAdd () {
      this.$router.push({
        name: 'add-device'
      })
    },
    edit (row, index) {
      this.$router.push({
        name: 'edit-device',
        params: row
      })
    },
    // 分页
    handleChangePage (e) {
      this.getDevice({ size: this.size, index: e })
    },
    // 多选
    handleSelectTableItem (selection, row) {
      this.selection = selection
    },
    // 搜索清除
    handleClear (e) {
      if (e.target.value === '') this.getDevice({ size: this.size })
    },
    // 搜索
    handleSearch () {
      const obj = {}
      obj[this.searchKey] = this.searchValue
      this.getDevice(obj)
    },
    // 批量删除
    handleDeleteBatch () {
      const tableData = this.tableData
      deleteDeviceList(this.selection).then(res => {
        console.log(res)
        if(res.data.code === 0) {
          this.selection.forEach((item, index) => {
            this.tableData.forEach((sItem, sIndex) => {
              if(sItem.id === item.id) {
                this.tableData.splice(sIndex, 1)
              }
            })
          })
        }
      })
    },
    // 设置默认的搜索key
    setDefaultSearchKey () {
      this.searchKey = this.columns[0].key ? this.columns[0].key : this.columns[1].key
    }
  },
  mounted () {
    this.getDevice({ size: this.size })
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
