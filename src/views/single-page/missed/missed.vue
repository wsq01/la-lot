<template>
  <Card>
    <Row>
      <i-col :span="24">
        <div class="search-con">
          <Form :model="searchForm" inline :label-width="0">
            <FormItem>
              <Select v-model="searchForm.key" class="search-col">
                <template v-for="item in searchKeyList">
                  <Option :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
                </template>
              </Select>
            </FormItem>
            <FormItem>
              <Input @on-change="handleClear" clearable placeholder="请输入关键字" v-model="searchForm.value" class="search-input" />
            </FormItem>
            <Button @click="handleSearch" type="primary" class="search-btn" icon="md-search">搜索</Button>
          </Form>
        </div>
      </i-col>
    </Row>
    <Row>
      <i-col :span="24">
        <Table :loading="loading" stripe border :columns="columns" :data="tableData"></Table>
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>
  </Card>
</template>

<script>
import { getDeviceMissed } from '@/api/data'
export default {
  name: 'Missed',
  data () {
    return {
      loading: true,
      total: 0,
      size: 10,
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
      tableData: [],
      selection: [],
      searchForm: {},
      searchKeyList: [
        { key: 'sceneId', title: '场景' },
        { key: 'deviceNum', title: '设备编号' }
      ]
    }
  },
  methods: {
    // 获取列表
    getDeviceMissed (params) {
      getDeviceMissed(params).then(res => {
        this.loading = false
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    // 分页
    handleChangePage (e) {
      this.getDeviceMissed({ size: this.size, index: e })
    },
    // 搜索清除
    handleClear (e) {
      if (e.target.value === '') this.getDeviceMissed({ size: this.size })
    },
    // 搜索
    handleSearch () {
      this.getDeviceMissed(this.searchForm)
    },
    // 设置默认的搜索key
    setDefaultSearchKey () {
      this.$set(this.searchForm, 'key', this.columns[0].key ? this.columns[0].key : this.columns[1].key)
    }
  },
  mounted () {
    this.getDeviceMissed({ size: this.size })
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
