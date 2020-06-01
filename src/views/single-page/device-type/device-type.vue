<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key" class="search-item">
              <template v-for="item in columns">
                <Option v-if="item.key && item.key === 'id'" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
              </template>
            </Select>
          </FormItem>
          <FormItem>
            <Input @on-change="handleClear" clearable placeholder="请输入关键字" v-model="searchForm.value" class="search-item" />
          </FormItem>
          <FormItem>
            <Button @click="handleSearch" type="primary" icon="md-search">搜索</Button>
          </FormItem>
          <span v-for="(bItem, bIndex) in btnList" :key="bIndex">
            <FormItem v-if="bItem === 'ADD'">
              <Button @click="addItem" type="primary" icon="md-trash">新增</Button>
            </FormItem>
          </span>
        </Form>
      </i-col>
    </Row>
    <Row>
      <i-col :span="24">
        <Table :loading="loading" stripe border :columns="columns" :data="tableData" @on-select-change="handleSelectTableItem">
          <template slot-scope="{row, index}" slot="action">
            <div v-for="(bItem, bIndex) in btnList" :key="bIndex" style="display: inline-block;margin-right: 5px">
              <Poptip v-if="bItem === 'DELETE'" confirm title="确定要删除吗？" transfer @on-ok="deleteItem(row, index)">
                <Button type="error" size="small">删除</Button>
              </Poptip>
              <Button v-if="bItem === 'EDIT'" type="primary" size="small" @click="editItem(row, index)">编辑</Button>
            </div>
          </template>
        </Table>
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>
  </Card>
</template>

<script>
import { getDeviceTypeList, deleteDeviceType, getDeviceTypeById } from '@/api/data'
import { getBtn } from '@/api/user'
import minxin from '@/assets/js/mixin'

export default {
  name: 'DeviceType',
  mixins: [ minxin ],
  data () {
    return {
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
      btnList: []
    }
  },
  methods: {
    async getItems (params) {
      const res = await getDeviceTypeList(params)
      this.getSuccess(res)
    },
    async deleteItem (row, index) {
      const res = await deleteDeviceType(row.id)
      this.deleteSuccess(res)
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
    // 搜索
    async handleSearch () {
      const obj = {}
      obj[this.searchForm.key] = this.searchForm.value
      const res = await getDeviceTypeById(this.searchForm.value)
      if (res.data.code === 0) {
        this.tableData = []
        this.tableData.push(res.data.data)
        this.total = res.data.seqnum
      }
    },
    async initBtn () {
      const uri = this.$route.name
      const menuList = this.$store.state.user.userMenu
      let menuId = '0'
      menuList.forEach((item, index) => {
        if (item.uri === uri) {
          menuId = item.id
        }
      })
      const res = await getBtn({ menuId })
      if (res.data.code === 0) {
        this.btnList = res.data.data.list.map((item, index) => item.buttonName)
      }
    }
  },
  mounted () {
    this.initBtn()
  }
}
</script>
