<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key" class="search-item">
              <template v-for="item in searchKeyList">
                <Option :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
              </template>
            </Select>
          </FormItem>
          <FormItem>
            <Input @on-change="handleClear" clearable placeholder="请输入关键字" v-model="searchForm.value" class="search-item" />
          </FormItem>
          <FormItem>
            <Button @click="handleSearch" type="primary" icon="md-search">搜索</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
    <Row>
      <i-col :span="24">
        <Table :loading="loading" stripe border :columns="columns" :data="tableData"></Table>
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" @on-page-size-change="handlePageSizeChange" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>
  </Card>
</template>

<script>
import { getDeviceMissed } from '@/api/data'
import minxin from '@/assets/js/mixin'

export default {
  name: 'Missed',
  mixins: [ minxin ],
  data () {
    return {
      columns: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '区域名称',
          key: 'area_name'
        },
        {
          title: '场景名称',
          key: 'scene_name'
        },
        {
          title: '设备编号',
          key: 'device_num'
        },
        {
          title: '接收器编号',
          key: 'receiver_num'
        },
        {
          title: '丢失时间',
          key: 'time'
        }
      ],
      searchKeyList: [
        { key: 'sceneId', title: '场景' },
        { key: 'deviceNum', title: '设备编号' }
      ]
    }
  },
  methods: {
    // 获取列表
    getItems (params) {
      getDeviceMissed(params).then(res => {
        this.getSuccess(res)
      })
    },
    // 搜索
    handleSearch () {
      this.getItems(this.searchForm)
    }
  },
  mounted () {
  }
}
</script>
