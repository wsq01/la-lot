<template>
  <Card>
    <Tabs @on-click="handleClickTab" :value="tabOption[0].name">
      <TabPane v-for="item in tabOption" :label="item.label" :key="item.name" :name="item.name">
        <!-- 1 -->
        <div v-if="item.name === 'import'">
          <Row>
            <i-col :span="24">
              <Form ref="checkForm" :model="importSearchForm" inline :label-width="90">
                <FormItem label="区域:">
                  <Select v-model="importSearchForm.areaId" transfer clearable class="search-col" label-in-value  @on-change="handleChangeImportArea" @clear="handleChangeImportArea">
                    <template v-for="item in areaList">
                      <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="场景:">
                  <Select v-model="importSearchForm.sceneId" clearable transfer label-in-value class="search-col">
                    <template v-for="item in sceneList">
                      <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="一级类型:">
                  <Select v-model="importSearchForm.code" clearable transfer label-in-value class="search-col" @on-change="handleChangeFirstLevel">
                    <template v-for="(item, index) in firstLevelList">
                      <Option :value="item.code" :key="index">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="二级类型:">
                  <Select v-model="importSearchForm.subCode" clearable transfer label-in-value class="search-col">
                    <template v-for="(item, index) in secondLevelList">
                      <Option :value="item.code" :key="index">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="日期:">
                  <DatePicker type="datetime" @on-change="handleChangeDatetime" placeholder="请选择年" class="search-col" transfer></DatePicker>
                </FormItem>
                <Button @click="handleImportSearch" type="primary" class="search-btn"><Icon type="md-search" />&nbsp;&nbsp;搜索</Button>
                <Button @click="handleExportExcel" type="primary" class="search-btn"><Icon type="md-download" />&nbsp;&nbsp;导出Excel</Button>
              </Form>
            </i-col>
          </Row>
          <Row>
            <i-col :span="24">
              <Table :loading="reportLoading" stripe border :columns="importColumns" :data="importTableData"></Table>
              <Page :total="importTotal" show-sizer show-total show-elevator @on-change="handleChangeReportPage" @on-page-size-change="handlePageSizeChange" style="margin: 10px 0 0"></Page>
            </i-col>
          </Row>
        </div>
        <!-- 2 -->
        <div v-else-if="item.name === 'check'">
          <Row>
            <i-col :span="24">
              <Form ref="checkForm" :model="checkSearchForm" inline :label-width="90">
                <FormItem label="区域:">
                  <Select v-model="checkSearchForm.areaId" transfer class="search-col" label-in-value @on-change="handleChangeArea" @clear="handleChangeArea">
                    <template v-for="item in areaList">
                      <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="场景:">
                  <Select v-model="checkSearchForm.sceneId" transfer label-in-value class="search-col" @clear="handleChangeArea">
                    <template v-for="item in sceneList">
                      <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="一级类型编码:">
                  <Select v-model="checkSearchForm.code" clearable transfer label-in-value class="search-col" @on-change="handleChangeFirstLevel">
                    <template v-for="(item, index) in firstLevelList">
                      <Option :value="item.code" :key="index">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="二级类型编码:">
                  <Select v-model="checkSearchForm.subCode" clearable transfer label-in-value class="search-col">
                    <template v-for="(item, index) in secondLevelList">
                      <Option :value="item.code" :key="index">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="日期:">
                  <DatePicker type="datetime" @on-change="handleChangeCheckDatetime" placeholder="请选择年" class="search-col" transfer></DatePicker>
                </FormItem>
                <Button @click="handleSearch" type="primary" class="search-btn"><Icon type="md-search" />&nbsp;&nbsp;搜索</Button>
                <Button @click="handleExportExcel2" type="primary" class="search-btn"><Icon type="md-download" />&nbsp;&nbsp;导出Excel</Button>
              </Form>
            </i-col>
          </Row>
          <Row>
            <i-col :span="24">
              <Table :loading="checkLoading" stripe border :columns="columns" :data="checkTableData"></Table>
              <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" @on-page-size-change="handlePageSizeChange" style="margin: 10px 0 0"></Page>
            </i-col>
          </Row>
        </div>
        <!-- 3 -->
        <div v-else-if="item.name === 'trend'">
          <Row>
            <i-col :span="24">
              <Form ref="trendForm" :model="trendSearchForm" inline :label-width="70">
                <FormItem label="区域:">
                  <Select v-model="trendSearchForm.areaId" transfer class="search-col" label-in-value @on-change="handleChangeTrendArea">
                    <template v-for="item in areaList">
                      <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="场景:">
                  <Select v-model="trendSearchForm.sceneId" transfer class="search-col" label-in-value>
                    <template v-for="item in trendSceneList">
                      <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="时间范围:">
                  <DatePicker type="datetimerange" placeholder="请选择范围" class="search-col" transfer @on-change="handleChangeTrendTimeRange"></DatePicker>
                </FormItem>
                <Button @click="handleTrendSearch" type="primary" class="search-btn"><Icon type="md-search" />&nbsp;&nbsp;搜索</Button>
              </Form>
            </i-col>
          </Row>
          <Row>
            <i-col :span="24">
              <chart-line :option="chartLineOption" style="width: 100%;height: 500px"></chart-line>
              <Spin size="large" fix v-if="trendLoading"></Spin>
            </i-col>
          </Row>
        </div>
        <!-- 4 -->
        <div v-else>
          <Row>
            <i-col :span="24">
              <Form ref="traceForm" :model="traceSearchForm" inline :label-width="70">
                <FormItem label="设备编码:">
                  <Input @on-change="handleClear" clearable placeholder="请输入关键字" v-model="traceSearchForm.deviceNum" class="search-input" />
                </FormItem>
                <FormItem label="时间范围:">
                  <DatePicker type="datetimerange" placeholder="请选择范围" class="search-col" transfer @on-change="handleChangeTraceTimeRange"></DatePicker>
                </FormItem>
                <Button @click="handleTraceSearch" type="primary" class="search-btn"><Icon type="md-search" />&nbsp;&nbsp;搜索</Button>
              </Form>
            </i-col>
          </Row>
          <Row>
            <i-col :span="12" offset="6">
              <Timeline>
                <TimelineItem class="timeline-item" v-for="(item, index) in timelineList" :key="index">
                  <p class="content">{{item.sceneName}}</p>
                  <p class="time">起始时间：{{item.startTime}}</p>
                  <p class="time">结束时间：{{item.endTime}}</p>
                </TimelineItem>
              </Timeline>
              <Spin size="large" fix v-if="tranceLoading"></Spin>
            </i-col>
            <i-col :span="24" style="text-center">
              <Page v-if="timelineList.length != 0" :total="traceTotal" show-sizer show-total show-elevator @on-change="handleChangeTracePage" @on-page-size-change="handleTracePageSizeChange" style="margin: 10px 0"></Page>
            </i-col>
          </Row>
        </div>
      </TabPane>

    </Tabs>
  </Card>
</template>

<script>
import { getScene, getDeviceRealTimeReport, getDeviceRealTimeCheck, getFirstLevel, getSecondLevel, getDeviceCheckExport, getDeviceReportExport } from '@/api/data'
import { getCheck, getTrace, getTrend, getDeviceCheckHistory, getHDDeviceCheckExport, getHDDeviceReportExport } from '@/api/history'
import { mapState, mapActions } from 'vuex'
import ChartLine from '@/components/charts/line'
export default {
  name: 'Check',
  data () {
    return {
      tabOption: [
        {
          label: '资产报表',
          name: 'import'
        },
        {
          label: '资产盘点',
          name: 'check'
        },
        {
          label: '资产流动',
          name: 'trend'
        },
        {
          label: '资产跟踪',
          name: 'trace'
        }
      ],
      reportLoading: true,
      checkLoading: true,
      total: 0,
      size: 10,
      importTotal: 0,
      importSize: 10,
      searchKey: 'sceneId',
      searchValue: '',
      importColumns: [
        {
          title: '设备编码',
          key: 'device_num',
          align: 'center',
          minWidth: 110
        },
        {
          title: '接收器编码',
          key: 'receiver_num',
          align: 'center',
          minWidth: 110
        },
        {
          title: '类型',
          key: 'type',
          align: 'center',
          minWidth: 60
        },
        {
          title: '区域名称',
          key: 'area_name',
          align: 'center',
          minWidth: 90
        },
        {
          title: '场景名称',
          key: 'scene_name',
          align: 'center',
          minWidth: 120
        },
        {
          title: '业务ID',
          key: 'business_id',
          align: 'center',
          minWidth: 140
        },
        {
          title: '时间',
          key: 'time',
          align: 'center',
          minWidth: 150
        }
      ],
      columns: [
        {
          title: '设备名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '数量',
          key: 'number',
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          align: 'center'
        },
        {
          title: '区域名称',
          key: 'areaName',
          align: 'center'
        },
        {
          title: '场景名称',
          key: 'sceneName',
          align: 'center'
        }
      ],
      importTableData: [],
      checkTableData: [],
      sceneList: [],
      trendSceneList: [],
      importSearchForm: {},
      checkSearchForm: {},
      trendSearchForm: {},
      traceSearchForm: {},
      chartLineOption: {},
      timelineList: [],
      firstLevelList: [],
      secondLevelList: [],
      traceTotal: 0,
      traceSize: 10,
      tranceLoading: false,
      trendLoading: false
    }
  },
  components: {
    ChartLine
  },
  computed: {
    ...mapState({
      areaList: state => state.app.areaList
    })
  },
  methods: {
    ...mapActions(['getAreaList']),
    handleClickTab (name) {
      if (name === 'check') {
        this.getDeviceRealTimeCheck({ size: this.size, total: this.total })
      }
    },
    // 获取实时盘点列表
    async getDeviceRealTimeCheck (params) {
      const res = await getDeviceRealTimeCheck(params)
      this.checkLoading = false
      if (res.data.code === 0) {
        this.checkTableData = res.data.data.list
        this.total = res.data.data.total
      } else {
        this.$Message.error(res.data.message)
      }
    },
    // 获取实时报表列表
    async getDeviceRealTimeReport (params) {
      const res = await getDeviceRealTimeReport(params)
      this.reportLoading = false
      if (res.data.code === 0) {
        this.importTableData = res.data.data.list
        this.importTotal = res.data.data.total
      } else {
        this.$Message.error(res.data.message)
      }
    },
    handleChangeDatetime (e) {
      if (e) {
        this.$set(this.importSearchForm, 'time', new Date(e).getTime())
      } else {
        this.$delete(this.importSearchForm, 'time')
      }
    },
    handleChangeFirstLevel (code) {
      this.getSecondLevel(code.value)
    },
    handleChangeCheckDatetime (e) {
      if (e) {
        this.$set(this.checkSearchForm, 'time', new Date(e).getTime())
      } else {
        this.$delete(this.checkSearchForm, 'time')
      }
    },
    // 分页改变事件
    handlePageSizeChange (e) {
      this.size = e
      const searchObj = { size: this.size }
      if (this.searchForm.value) {
        Object.assign(searchObj, this.searchForm)
      }
      this.getItems(searchObj)
    },
    // 报表导出
    async handleExportExcel () {
      let params = {}
      let res
      let fileName = '导出.xls'
      for (let [key, val] of Object.entries(this.importSearchForm)) {
        params[key] = val
      }
      if (this.importSearchForm.time) {
        res = await getHDDeviceReportExport(params)
        fileName = '报表导出.xls'
      } else {
        res = await getDeviceReportExport(params)
        fileName = '报表导出.xls'
      }
      const blob = new Blob([res.data], { type: 'application/octet-stream' })

      let link = document.createElement('a')
      link.style.display = 'none'
      link.download = fileName
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
    },
    // 盘点导出
    async handleExportExcel2 () {
      let params = {}
      let res
      let fileName = '导出.xls'
      for (let [key, val] of Object.entries(this.checkSearchForm)) {
        params[key] = val
      }
      if (this.checkSearchForm.time) {
        res = await getHDDeviceCheckExport(params)
        fileName = '盘点导出.xls'
      } else {
        res = await getDeviceCheckExport(params)
        fileName = '盘点导出.xls'
      }
      const blob = new Blob([res.data], { type: 'application/octet-stream' })

      let link = document.createElement('a')
      link.style.display = 'none'
      link.download = fileName
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
    },
    handleClear () {

    },
    // 盘点分页点击事件
    handleChangePage (e) {
      const obj = { size: this.size, index: e }
      Object.assign(obj, this.checkSearchForm)
      this.getDeviceRealTimeCheck(obj)
    },
    // 报表分页点击事件
    handleChangeReportPage (e) {
      const obj = { size: this.importSize, index: e }
      Object.assign(obj, this.importSearchForm)
      this.getDeviceRealTimeReport(obj)
    },
    handleTracePageSizeChange (e) {
      this.traceSize = e
      const obj = { size: e }
      this.handleTraceSearch(obj)
    },
    handleChangeTracePage (e) {
      const obj = { size: this.traceSize, index: e }
      this.handleTraceSearch(obj)
    },
    // 报表搜索
    handleImportSearch () {
      if (this.importSearchForm.time) {
        this.reportLoading = true
        getDeviceCheckHistory(this.importSearchForm).then(res => {
          this.reportLoading = false
          if (res.data.code === 0) {
            this.importTableData = res.data.data.list
            this.importTotal = res.data.data.total
          }
        })
      } else {
        this.reportLoading = true
        getDeviceRealTimeReport(this.importSearchForm).then(res => {
          this.reportLoading = false
          if (res.data.code === 0) {
            this.importTableData = res.data.data.list
            this.importTotal = res.data.data.total
          }
        })
      }
    },
    // 盘点搜索
    async handleSearch () {
      if (this.checkSearchForm.time) {
        this.checkLoading = true
        const res = await getCheck(this.checkSearchForm)
        this.checkLoading = false
        if (res.data.code === 0) {
          this.checkTableData = res.data.data.list
          this.total = res.data.data.total
        }
      } else {
        const res = await getDeviceRealTimeCheck(this.checkSearchForm)
        this.checkLoading = false
        if (res.data.code === 0) {
          this.checkTableData = res.data.data.list
          this.total = res.data.data.total
        }
      }
    },
    // 流动图搜索
    async handleTrendSearch () {
      this.trendLoading = true
      const res = await getTrend(this.trendSearchForm)
      this.chartLineOption = this.initChartOption(res.data.data.list)
      this.trendLoading = false
    },
    // 设备轨迹搜索
    async handleTraceSearch (params) {
      this.tranceLoading = true
      const obj = JSON.parse(JSON.stringify(this.traceSearchForm))
      if (params) {
        Object.assign(obj, params)
      }
      const res = await getTrace(obj)
      this.tranceLoading = false
      if (res.data.code === 0) {
        this.timelineList = res.data.data.list
        this.traceTotal = res.data.data.total
      } else {
        this.$Message.error(res.data.message)
      }
    },
    handleChangeTraceTimeRange (e) {
      this.traceSearchForm.startTime = new Date(e[0]).getTime()
      this.traceSearchForm.stopTime = new Date(e[1]).getTime()
    },
    handleChangeTrendTimeRange (e) {
      this.trendSearchForm.startTime = new Date(e[0]).getTime()
      this.trendSearchForm.stopTime = new Date(e[1]).getTime()
    },
    // 资产流动折线图初始化
    initChartOption (data) {
      var option = {
        title: {
          text: '资产流动'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 100,
          containLabel: true
        },
        legend: { data: [], top: 36 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
      data.forEach((item, index) => {
        if (!option.legend.data.includes(item.sceneName)) {
          option.legend.data.push(item.sceneName)
        }

        if (!option.xAxis.data.includes(item.dateTime)) {
          option.xAxis.data.push(item.dateTime)
        }
      })
      option.legend.data.forEach((item, index) => {
        const obj = {
          name: item,
          type: 'line',
          stack: '数量',
          data: []
        }
        data.forEach(sItem => {
          if (sItem.sceneName === item) {
            obj.data.push(sItem.number)
          }
        })
        option.series.push(obj)
      })
      return option
    },
    // 报表区域改变事件
    handleChangeImportArea (e) {
      if (e) {
        getScene({ areaId: e.value }).then(res => {
          this.sceneList = res.data.data.list
        })
      } else {
        this.sceneList = []
        this.$set(this.importSearchForm, 'sceneId', '')
      }
    },
    // 盘点区域改变事件
    handleChangeArea (e) {
      if (e) {
        getScene({ areaId: e.value }).then(res => {
          this.sceneList = res.data.data.list
        })
      } else {
        this.sceneList = []
        this.$set(this.checkSearchForm, 'sceneId', '')
      }
    },
    async handleChangeTrendArea (e) {
      const res = await getScene({ areaId: e.value })
      this.trendSceneList = res.data.data.list
    },
    async getFirstLevel () {
      const res = await getFirstLevel()
      if (res.data.code === 0) {
        this.firstLevelList = res.data.data.list
      } else {
        this.$Message.error(res.data.message)
      }
    },
    async getSecondLevel (code) {
      const res = await getSecondLevel(code)
      if (res.data.code === 0) {
        this.secondLevelList = res.data.data.list
      } else {
        this.$Message.error(res.data.message)
      }
    }
  },
  mounted () {
    if (this.areaList.length === 0) {
      this.getAreaList()
    }
    this.getDeviceRealTimeReport()
    this.getFirstLevel()
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
