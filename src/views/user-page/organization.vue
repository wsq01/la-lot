<template>
  <Card>
    <Row>
      <i-col :span="24">
        <div class="search-con">
          <Select v-model="searchKey" class="search-col">
            <template v-for="item in columns">
              <Option v-if="item.key && (item.key === 'id' || item.key === 'name' || item.key === 'code')" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
            </template>
          </Select>
          <Input @on-change="handleClear" clearable placeholder="请输入关键字" v-model="searchValue" class="search-input" />
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
import { getOrganization, deleteOrganization } from '@/api/user'
export default {
  name: 'Organization',
  data () {
    return {
      loading: false,
      total: 0,
      size: 10,
      columns: [
        {
          title: '机构ID',
          key: 'id'
        },
        {
          title: '机构名称',
          key: 'name'
        },
        {
          title: '机构编码',
          key: 'badCount'
        },
        {
          title: '机构地址',
          key: 'address'
        },
        {
          title: '上级机构编码',
          key: 'code'
        },
        {
          title: '机构电话',
          key: 'telephone'
        },
        {
          title: '创建时间',
          key: 'createTime'
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
      searchKey: '',
      searchValue: '',
      selection: []
    }
  },
  methods: {
    // 获取列表
    getOrganization (params) {
      getOrganization(params).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    // 删除
    delOk (row, index) {
      deleteOrganization(row.id).then(res => {
        if (res.data.code === 0) {
          this.tableData.splice(index, 1)
        }
      })
    },
    handleAdd () {
      this.$router.push({
        name: 'add-organization'
      })
    },
    edit (row, index) {
      this.$router.push({
        name: 'edit-organization',
        params: row
      })
    },
    // 分页
    handleChangePage (e) {
      this.getOrganization({ size: this.size, index: e })
    },
    // 多选
    handleSelectTableItem (selection, row) {
      this.selection = selection
    },
    // 搜索清除
    handleClear (e) {
      if (e.target.value === '') this.getOrganization({ size: this.size })
    },
    // 搜索
    handleSearch () {
      const obj = {}
      obj[this.searchKey] = this.searchValue
      this.getOrganization(obj)
    },
    // 设置默认的搜索key
    setDefaultSearchKey () {
      this.searchKey = this.columns[0].key ? this.columns[0].key : this.columns[1].key
    }
  },
  mounted () {
    this.getOrganization({ size: this.size })
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
