<template>
  <Card>
    <Tabs @on-click="handleClickTab" :value="tabOption[0].name">
      <TabPane v-for="item in tabOption" :label="item.label" :key="item.name" :name="item.name">
        <Row v-if="item.name === 'realdata'">
          <i-col :span="24">
            <Form :model="realTimeSearchForm" inline :label-width="0">
              <FormItem>
                <Select v-model="realTimeSearchForm.key" class="search-item" @on-change="handleChangeSearchKey">
                  <template v-for="item in searchKeyList">
                    <Option :value="item.key" :key="`search-${item.key}`">{{item.name}}</Option>
                  </template>
                </Select>
              </FormItem>
              <FormItem>
                <Select v-model="realTimeSearchForm.value" class="search-item" v-if="isShowScene">
                  <template v-for="item in sceneList">
                    <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
                  </template>
                </Select>
                <Input v-else @on-change="handleClear" clearable placeholder="请输入关键字" v-model="realTimeSearchForm.value" class="search-item" />
              </FormItem>
              <Button @click="handleSearch" type="primary" icon="md-search">搜索</Button>
            </Form>
            <Table :loading="loading" stripe border :columns="columns" :data="tableData"></Table>
            <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" @on-page-size-change="handlePageSizeChange" style="margin: 10px 0 0"></Page>
          </i-col>
        </Row>
        <Row v-else>
          <i-col :span="24">
            <Form ref="traceForm" :model="historySearchForm" inline :label-width="70">
              <FormItem label="设备编码:">
                <Input clearable placeholder="请输入关键字" v-model="historySearchForm.deviceNum" class="search-item" />
              </FormItem>
              <FormItem label="场景:">
                <Select v-model="historySearchForm.sceneId" class="search-item">
                  <template v-for="item in sceneList">
                    <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
                  </template>
                </Select>
              </FormItem>
              <FormItem label="时间范围:">
                <DatePicker v-model="historySearchForm.time" type="datetimerange" placeholder="请选择范围" class="search-item" transfer></DatePicker>
              </FormItem>
              <Button @click="handleSearchHistory" type="primary" icon="md-search">搜索</Button>
            </Form>
            <Table :loading="loading" stripe border :columns="columns" :data="historyTableData"></Table>
            <Page :total="historyTotal" show-sizer show-total show-elevator @on-change="handleChangeHistoryPage" @on-page-size-change="handlePageSizeChangeHistory" style="margin: 10px 0 0"></Page>
          </i-col>
        </Row>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import { getDeviceRealTime } from '@/api/data'
import { getDeviceHistory } from '@/api/history'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'DeviceData',
  data () {
    return {
      tabOption: [
        {
          label: '实时数据',
          name: 'realdata'
        },
        {
          label: '历史数据',
          name: 'historydata'
        }
      ],
      loading: false,
      total: 0,
      size: 10,
      historyTotal: 0,
      historySize: 10,
      realTimeSearchForm: {},
      historySearchForm: {},
      searchKeyList: [
        { key: 'sceneId', name: '场景' },
        { key: 'receiverNum', name: '接收器编号' },
        { key: 'deviceNum', name: '设备编号' }
      ],
      columns: [
        {
          title: '设备编号',
          key: 'device_num'
        },
        {
          title: '接收器编号',
          key: 'receiver_num'
        },
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '场景名称',
          key: 'scene_name'
        }
      ],
      tableData: [],
      historyTableData: [],
      isShowScene: true
    }
  },
  computed: {
    ...mapState({
      sceneList: state => state.app.sceneList
    })
  },
  methods: {
    ...mapActions(['getSceneList']),
    //  获取实时数据
    getDeviceRealTime (params) {
      getDeviceRealTime(params).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    // 获取历史数据
    getDeviceHistory (params) {
      getDeviceHistory(params).then(res => {
        if (res.data.code === 0) {
          this.historyTableData = res.data.data.list
          this.historyTotal = res.data.data.total
        }
      })
    },
    // 设置搜索默认值
    setDefaultSearchKey () {
      this.$set(this.realTimeSearchForm, 'key', this.searchKeyList[0].key)
    },
    // 切换搜索项
    handleChangeSearchKey (e) {
      if (e === 'sceneId') this.isShowScene = true
      else this.isShowScene = false
    },
    handleClickTab (name) {
      // if (name === 'historydata' && this.historyTableData.length === 0) {
      //   this.getDeviceHistory({ size: this.size })
      // }
    },
    // 实时数据分页数改变事件
    handlePageSizeChange (e) {
      this.size = e
      var searchObj = { size: this.size }
      if (this.realTimeSearchForm.value) {
        Object.assign(searchObj, this.realTimeSearchForm)
      }
      this.getDeviceRealTime(searchObj)
    },
    handlePageSizeChangeHistory (e) {
      this.size = e
      var searchObj = { size: this.size }
      searchObj.deviceNum = this.historySearchForm.deviceNum
      searchObj.sceneId = this.historySearchForm.sceneId
      searchObj.startTime = this.historySearchForm.time[0]
      searchObj.stopTime = this.historySearchForm.time[1]
      this.getDeviceHistory(searchObj)
    },
    // 实时数据页码改变事件
    handleChangePage (e) {
      var searchObj = { size: this.size, index: e }
      if (this.realTimeSearchForm.value) {
        Object.assign(searchObj, this.realTimeSearchForm)
      }
      this.getDeviceRealTime(searchObj)
    },
    // 历史数据页码改变事件
    handleChangeHistoryPage (e) {
      var searchObj = { size: this.historySize, index: e }
      searchObj.deviceNum = this.historySearchForm.deviceNum
      searchObj.sceneId = this.historySearchForm.sceneId
      searchObj.startTime = this.historySearchForm.time[0]
      searchObj.stopTime = this.historySearchForm.time[1]
      this.getDeviceHistory(searchObj)
    },
    handleClear () {
      this.getDeviceRealTime({ size: this.size })
    },
    // 实时数据搜索
    handleSearch () {
      getDeviceRealTime(this.realTimeSearchForm).then(res => {
        this.tableData = res.data.data.list
        this.total = res.data.data.total
      })
    },
    // 历史数据搜索
    handleSearchHistory () {
      const reqData = {}
      reqData.deviceNum = this.historySearchForm.deviceNum
      reqData.sceneId = this.historySearchForm.sceneId
      if (this.historySearchForm.time[0]) {
        this.historySearchForm.time = this.historySearchForm.time.map((item, index) => new Date(item).getTime())
        reqData.startTime = this.historySearchForm.time[0]
        reqData.stopTime = this.historySearchForm.time[1]
      }
      getDeviceHistory(reqData).then(res => {
        this.historyTableData = res.data.data.list
        this.historyTotal = res.data.data.total
      })
    }
  },
  mounted () {
    if (this.sceneList.length === 0) {
      this.getSceneList()
    }
    this.getDeviceRealTime({ size: this.size })
    this.setDefaultSearchKey()
  }
}
</script>

<style lang="less" scoped>
.search-item {
  display: inline-block;
  width: 200px;
}
</style>
