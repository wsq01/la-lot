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
          <span v-for="(bItem, bIndex) in btnList" :key="bIndex">
            <FormItem v-if="bItem === 'ADD'">
              <Button @click="addItem" type="primary" icon="md-add">新增</Button>
            </FormItem>
            <FormItem v-if="bItem === 'DELETEBATCH'">
              <Poptip confirm title="确定要删除吗？" transfer @on-ok="handleDeleteBatch">
                <Button type="primary" icon="md-trash">批量删除</Button>
              </Poptip>
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
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" @on-page-size-change="handlePageSizeChange" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>
  </Card>
</template>

<script>
import { getDevice, deleteDevice, deleteDeviceList } from '@/api/data'
import { getBtn } from '@/api/user'
import minxin from '@/assets/js/mixin'

export default {
  name: 'Device',
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
      btnList: []
    }
  },
  methods: {
    // 获取列表
    async getItems (params) {
      const res = await getDevice(params)
      this.getSuccess(res)
    },
    // 删除
    async deleteItem (row, index) {
      const res = await deleteDevice(row.id)
      this.deleteSuccess(res, index)
    },
    addItem () {
      this.$router.push({
        name: 'add-device'
      })
    },
    editItem (row, index) {
      this.$router.push({
        name: 'edit-device',
        params: row
      })
    },
    // 批量删除
    async handleDeleteBatch () {
      const res = await deleteDeviceList(this.selection)
      this.deleteBatchSuccess(res)
    },
    async initBtn () {
      const uri = this.$route.name
      const menuList = this.$store.state.user.userMenu
      let menuId = ''
      menuList.forEach((item, index) => {
        if (item.uri === uri) {
          menuId = item.id
        }
      })
      const res = await getBtn({ menuId })
      if (res.data.code === 0) {
        this.btnList = res.data.data.list.map((item, index) => item.buttonName)
      }
    },
    handleChangePage (e) {
      const obj = {}
      if (this.searchForm.key === 'id') {
        obj['deviceId'] = this.searchForm.value
      } else {
        obj[this.searchForm.key] = this.searchForm.value
      }
      Object.assign(obj, { size: this.size, index: e })
      this.getItems(obj)
    },
    // 搜索
    handleSearch () {
      const obj = {}
      if (this.searchForm.key === 'id') {
        obj['deviceId'] = this.searchForm.value
      } else {
        obj[this.searchForm.key] = this.searchForm.value
      }
      this.getItems(obj)
    }
  },
  mounted () {
    this.initBtn()
  }
}
</script>
