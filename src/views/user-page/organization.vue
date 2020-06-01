<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key" class="search-item">
              <template v-for="item in columns">
                <Option v-if="item.key && (item.key === 'id' || item.key === 'name' || item.key === 'code')" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
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
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row, index)">编辑</Button>
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
import { getOrganization, deleteOrganization } from '@/api/user'
import minxin from '@/assets/js/mixin'

export default {
  name: 'Organization',
  mixins: [ minxin ],
  data () {
    return {
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
      ]
    }
  },
  methods: {
    async getItems (params) {
      const res = await getOrganization(params)
      this.getSuccess(res)
    },
    async deleteItem (row, index) {
      const res = await deleteOrganization(row.id)
      this.deleteSuccess(res)
    },
    addItem () {
      this.$router.push({
        name: 'add-organization'
      })
    },
    edit (row, index) {
      this.$router.push({
        name: 'edit-organization',
        params: row
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-item {
  display: inline-block;
  width: 200px;
}
</style>
