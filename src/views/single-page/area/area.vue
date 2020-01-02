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
              <FormItem v-if="bItem === 'DELETEBATCH'">
                <Poptip confirm title="确定要删除吗？" transfer @on-ok="handleDeleteBatch">
                  <Button type="primary" icon="md-trash">批量删除</Button>
                </Poptip>
              </FormItem>
              <FormItem v-if="bItem === 'ADD'">
                <Button @click="addItem" type="primary" icon="md-add">新增</Button>
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
import { getArea, deleteArea, deleteAreaList } from '@/api/data'
import { getBtn } from '@/api/user'
import minxin from '@/assets/js/mixin'

export default {
  name: 'Area',
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
      btnList: []
    }
  },
  methods: {
    // 获取
    getItems (params) {
      getArea(params).then(res => {
        this.getSuccess(res)
      })
    },
    // 删除
    deleteItem (row, index) {
      deleteArea(row.id).then(res => {
        this.deleteSuccess(res, index)
      })
    },
    // 添加
    addItem () {
      this.$router.push({
        name: 'add-area'
      })
    },
    // 删除
    editItem (row, index) {
      this.$router.push({
        name: 'edit-area',
        params: row
      })
    },
    // 批量删除
    handleDeleteBatch () {
      deleteAreaList(this.selection).then(res => {
        this.deleteBatchSuccess(res)
      })
    },
    initBtn () {
      const uri = '/' + this.$route.name
      const menuList = this.$store.state.user.userMenu
      let menuId = '0'
      menuList.forEach((item, index) => {
        if (item.uri === uri) {
          menuId = item.id
        }
      })
      getBtn({ menuId }).then(res => {
        if (res.data.code === 0) {
          const btnList = res.data.data.list
          btnList.forEach((item, index) => {
            this.btnList.push(item.buttonName)
          })
        }
      })
    }
  },
  mounted () {
    this.initBtn()
  }
}
</script>
