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
              <Button v-if="bItem === 'EDIT'" type="primary" size="small" style="" @click="editItem(row, index)">编辑</Button>
            </div>
          </template>
        </Table>
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" @on-page-size-change="handlePageSizeChange" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>
  </Card>
</template>

<script>
import { getScene, deleteScene, deleteSceneList } from '@/api/data'
import { getBtn } from '@/api/user'
import minxin from '@/assets/js/mixin'
export default {
  name: 'Scene',
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
          title: '场景ID',
          key: 'id'
        },
        {
          title: '场景名称',
          key: 'name'
        },
        {
          title: '区域ID',
          key: 'areaId'
        },
        {
          title: '场景类型',
          key: 'type'
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
      btnList: [],
      pageName: 'scene'
    }
  },
  methods: {
    async getItems (params) {
      const res = await getScene(params)
      this.getSuccess(res)
    },
    async deleteItem (row, index) {
      const res = await deleteScene(row.id)
      this.deleteSuccess(res)
    },
    // 批量删除
    async handleDeleteBatch () {
      const res = await deleteSceneList(this.selection)
      this.deleteBatchSuccess(res)
    },
    async initBtn () {
      const uri = this.$route.name
      const menuList = this.$store.state.user.userMenu
      const menu = menuList.find(item => item.uri === uri || item.uri === '/' + uri)
      const res = await getBtn({ menuId: menu.id })
      if (res.data.code === 0) {
        this.btnList = res.data.data.list.map(item => item.buttonName)
      }
    }
  },
  mounted () {
    this.initBtn()
    this.getItems()
  }
}
</script>
