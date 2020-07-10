<template>
  <Card>
    <Tabs @on-click="handleClickTab" :value="tabOption[0].name">
      <TabPane v-for="item in tabOption" :label="item.label" :key="item.name" :name="item.name">
        <Row v-if="item.name === 'realdata'">
          <i-col :span="24">
            <Form :model="realTimeSearchForm" inline :label-width="0">
              <FormItem>
                <Select v-model="realTimeSearchForm.key" @on-change="handleChangeSearchKey">
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
                <Select filterable multiple remote :remote-method="remoteMethod" class="search-item-1" v-model="realTimeSearchForm.value" :loading="receiverNumSelectLoading" v-else-if="isShowReceiverNum">
                  <Option v-for="(item, index) in receiverNumList" :value="item" :key="index">{{item}}</Option>
                </Select>
                <Input v-else @on-clear="handleClear" clearable placeholder="请输入关键字" v-model="realTimeSearchForm.value" class="search-item" />
              </FormItem>
              <FormItem label="时间范围:" :label-width="70">
                <DatePicker v-model="realTimeSearchForm.time" type="datetimerange" placeholder="请选择范围" class="search-item" transfer></DatePicker>
              </FormItem>
              <Button @click="handleSearch" type="primary" icon="md-search" class="search-btn">搜索</Button>
              <Button @click="handleExportExcel" type="primary" class="search-btn"><Icon type="md-download" />&nbsp;&nbsp;导出Excel</Button>
            </Form>
            <Table :loading="loading" stripe border :columns="columns" :data="tableData"></Table>
            <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" @on-page-size-change="handlePageSizeChange" style="margin: 10px 0 0" :page-size-opts="[10, 20, 30, 40, 1000]"></Page>
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
import { getDeviceRealTime, getDeviceRealtimeExport, getReceiverList } from '@/api/data'
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
      loading: true,
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
          key: 'device_num',
          sortable: true,
          align: 'center'
        },
        {
          title: '接收器编号',
          key: 'receiver_num',
          sortable: true,
          align: 'center'
        },
        {
          title: '保温箱编号',
          key: 'business_id',
          sortable: true,
          align: 'center'
        },
        {
          title: '时间',
          key: 'time',
          sortable: true,
          align: 'center'
        },
        {
          title: '场景名称',
          key: 'scene_name',
          align: 'center'
        }
      ],
      tableData: [],
      historyTableData: [],
      isShowScene: true,
      isShowReceiverNum: false,
      receiverNumSelectLoading: false,
      receiverNumList: []
    }
  },
  computed: {
    ...mapState({
      sceneList: state => state.app.sceneList
    })
  },
  methods: {
    ...mapActions(['getSceneList']),
    async getDeviceRealTime (params) {
      const res = await getDeviceRealTime(params)
      this.loading = false
      if (res.data.code === 0) {
        this.tableData = res.data.data.list
        this.total = res.data.data.total
      }
    },
    async getReceiverList (receiverNum) {
      const params = {}
      if (receiverNum) Object.assign(params, { receiverNum })
      const res = await getReceiverList(params)
      if (res.data.code === 0) {
        this.receiverNumSelectLoading = false
        this.receiverNumList = res.data.data.list
      }
    },
    remoteMethod (query) {
      if (query !== '') {
        this.receiverNumSelectLoading = true
        this.getReceiverList(query)
      } else {
        this.receiverNumList = []
      }
    },
    // 报表导出
    async handleExportExcel () {
      const obj = {}
      if (this.realTimeSearchForm.time[0]) {
        obj.startTime = this.realTimeSearchForm.time[0]
        obj.endTime = this.realTimeSearchForm.time[1]
      }
      if (this.realTimeSearchForm.value.toString()) {
        obj.key = this.realTimeSearchForm.key
        obj.value = this.realTimeSearchForm.value.toString()
      }
      let params = {}
      let res
      let fileName = '导出.xls'
      for (let [key, val] of Object.entries(this.realTimeSearchForm)) {
        params[key] = val
      }
      res = await getDeviceRealtimeExport(obj)
      fileName = '报表导出.xls'
      const blob = new Blob([res.data], { type: 'application/octet-stream' })

      let link = document.createElement('a')
      link.style.display = 'none'
      link.download = fileName
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
    },
    async getDeviceHistory (params) {
      const res = await getDeviceHistory(params)
      if (res.data.code === 0) {
        this.historyTableData = res.data.data.list
        this.historyTotal = res.data.data.total
      }
    },
    setDefaultSearchKey () {
      this.$set(this.realTimeSearchForm, 'key', this.searchKeyList[0].key)
    },
    handleChangeSearchKey (e) {
      this.realTimeSearchForm.value = ''
      if (e === 'sceneId') {
        this.isShowScene = true
        this.isShowReceiverNum = false
      } else if (e === 'receiverNum') {
        this.getReceiverList()
        this.isShowReceiverNum = true
        this.isShowScene = false
      } else {
        this.isShowScene = false
        this.isShowReceiverNum = false
      }
    },
    handleClickTab (name) {
    },
    handlePageSizeChange (e) {
      this.loading = true
      this.size = e
      var searchObj = { size: this.size }
      if (this.realTimeSearchForm.value.toString()) {
        searchObj.key = this.realTimeSearchForm.key
        searchObj.value = this.realTimeSearchForm.value.toString()
      }
      if (this.realTimeSearchForm.time) {
        searchObj.startTime = this.realTimeSearchForm.time[0]
        searchObj.stopTime = this.realTimeSearchForm.time[1]
      }
      this.getDeviceRealTime(searchObj)
    },
    handlePageSizeChangeHistory (e) {
      this.size = e
      var searchObj = { size: this.size }
      searchObj.deviceNum = this.historySearchForm.deviceNum
      searchObj.sceneId = this.historySearchForm.sceneId
      if (this.historySearchForm.time) {
        searchObj.startTime = this.historySearchForm.time[0]
        searchObj.stopTime = this.historySearchForm.time[1]
      }
      this.getDeviceHistory(searchObj)
    },
    handleChangePage (e) {
      this.loading = true
      const searchObj = { size: this.size, index: e }
      if (this.realTimeSearchForm.value.toString()) {
        searchObj.key = this.realTimeSearchForm.key
        searchObj.value = this.realTimeSearchForm.value.toString()
      }
      if (this.realTimeSearchForm.time) {
        searchObj.startTime = this.realTimeSearchForm.time[0]
        searchObj.stopTime = this.realTimeSearchForm.time[1]
      }
      this.getDeviceRealTime(searchObj)
    },
    handleChangeHistoryPage (e) {
      this.loading = true
      var searchObj = { size: this.historySize, index: e }
      searchObj.deviceNum = this.historySearchForm.deviceNum
      searchObj.sceneId = this.historySearchForm.sceneId
      if (this.historySearchForm.time) {
        searchObj.startTime = this.historySearchForm.time[0]
        searchObj.stopTime = this.historySearchForm.time[1]
      }
      this.getDeviceHistory(searchObj)
    },
    handleClear () {
      this.getDeviceRealTime({ size: this.size })
    },
    handleSearch () {
      this.loading = true
      const reqData = { size: this.size }
      if (this.realTimeSearchForm.value.toString()) {
        reqData.key = this.realTimeSearchForm.key
        reqData.value = this.realTimeSearchForm.value.toString()
      }
      if (this.realTimeSearchForm.time[0]) {
        this.realTimeSearchForm.time = this.realTimeSearchForm.time.map((item, index) => new Date(item).getTime())
        reqData.startTime = this.realTimeSearchForm.time[0]
        reqData.stopTime = this.realTimeSearchForm.time[1]
      }
      this.getDeviceRealTime(reqData)
    },
    async handleSearchHistory () {
      const reqData = {}
      reqData.deviceNum = this.historySearchForm.deviceNum
      reqData.sceneId = this.historySearchForm.sceneId
      if (this.historySearchForm.time[0]) {
        this.historySearchForm.time = this.historySearchForm.time.map((item, index) => new Date(item).getTime())
        reqData.startTime = this.historySearchForm.time[0]
        reqData.stopTime = this.historySearchForm.time[1]
      }
      const res = await getDeviceHistory(reqData)
      this.historyTableData = res.data.data.list
      this.historyTotal = res.data.data.total
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
.search-item-1 {
  display: inline-block;
  min-width: 200px;
}
.search {
  &-con {
    padding: 10px 0;
  }
  &-col {
    display: inline-block;
    width: 200px;
    margin-left: 2px;
  }
  &-datepicker {
    width: 100px;
  }
  &-input {
    display: inline-block;
    width: 200px;
    margin-left: 2px;
  }
  &-btn {
    margin-left: 2px;
    margin-bottom: 24px;
  }
}
.timeline-item {
  display: flex;
}
.time {
  margin: 0 50px 0 0;
}
</style>
