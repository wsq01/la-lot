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
                  <Select v-model="importSearchForm.areaId" transfer clearable class="search-col" label-in-value  @on-change="handleChangeImportArea">
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
                <FormItem label="一级类型编码:">
                  <Input clearable placeholder="请输入一级类型编码" v-model="importSearchForm.code" class="search-col" />
                </FormItem>
                <FormItem label="二级类型编码:">
                  <Input clearable placeholder="请输入二级类型编码" v-model="importSearchForm.subCode" class="search-col" />
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
                  <Select v-model="checkSearchForm.areaId" transfer class="search-col" label-in-value @on-change="handleChangeArea">
                    <template v-for="item in areaList">
                      <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="场景:">
                  <Select v-model="checkSearchForm.sceneId" transfer label-in-value class="search-col">
                    <template v-for="item in sceneList">
                      <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="一级类型编码:">
                  <Input clearable placeholder="请输入一级类型编码" v-model="checkSearchForm.code" class="search-col" />
                </FormItem>
                <FormItem label="二级类型编码:">
                  <Input clearable placeholder="请输入二级类型编码" v-model="checkSearchForm.subCode" class="search-col" />
                </FormItem>
                <FormItem label="日期:">
                  <DatePicker type="datetime" @on-change="handleChangeCheckDatetime" placeholder="请选择年" class="search-col" transfer></DatePicker>
                </FormItem>
                <!-- <FormItem label="年:">
                  <DatePicker type="year" @on-change="handleChangeYear" placeholder="请选择年" class="search-col search-datepicker" transfer></DatePicker>
                </FormItem>
                <FormItem label="月:">
                  <DatePicker type="month" format="M" @on-change="handleChangeMonth" placeholder="请选择月" class="search-col search-datepicker" transfer></DatePicker>
                </FormItem>
                <FormItem label="日:">
                  <DatePicker type="date" format="d" @on-change="handleChangeDay" placeholder="请选择日" class="search-col search-datepicker" transfer></DatePicker>
                </FormItem> -->
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
              <chart-line :option="chartLineOption" style="width: 100%;height: 400px"></chart-line>
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
                  <p class="time">{{item.time}}</p>
                  <p class="content">{{item.scene_name}}</p>
                </TimelineItem>
              </Timeline>
            </i-col>
          </Row>
        </div>
      </TabPane>

    </Tabs>
  </Card>
</template>

<script>
import { getScene, getDeviceRealTimeReport, getDeviceRealTimeCheck } from '@/api/data'
import { getCheck, getTrace, getTrend, getDeviceCheckHistory } from '@/api/history'
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
          key: 'device_num'
        },
        {
          title: '接收器编码',
          key: 'receiver_num'
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
          title: '业务ID',
          key: 'business_id'
        },
        {
          title: '时间',
          key: 'time'
        }
      ],
      columns: [
        {
          title: '设备名称',
          key: 'name'
        },
        {
          title: '数量',
          key: 'number'
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '区域名称',
          key: 'areaName'
        },
        {
          title: '场景名称',
          key: 'sceneName'
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
      timelineList: []
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
      console.log(name)
      if (name === 'check') {
        this.getDeviceRealTimeCheck({ size: this.size, total: this.total, organizationId: this.$store.state.user.organizationId })
      }
    },
    // 获取实时盘点列表
    getDeviceRealTimeCheck (params) {
      getDeviceRealTimeCheck(params).then(res => {
        this.checkLoading = false
        if (res.data.code === 0) {
          this.checkTableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    // 获取实时报表列表
    getDeviceRealTimeReport (params) {
      getDeviceRealTimeReport(params).then(res => {
        this.reportLoading = false
        if (res.data.code === 0) {
          this.importTableData = res.data.data.list
          this.importTotal = res.data.data.total
        }
      })
    },
    handleChangeDatetime (e) {
      console.log(e)
      if (e) {
        this.$set(this.importSearchForm, 'time', new Date(e).getTime())
      } else {
        this.$delete(this.importSearchForm, 'time')
      }
    },
    handleChangeCheckDatetime (e) {
      console.log(e)
      if (e) {
        this.$set(this.checkSearchForm, 'time', new Date(e).getTime())
      } else {
        this.$delete(this.checkSearchForm, 'time')
      }
    },
    // handleChangeYear (e) {
    //   this.$set(this.checkSearchForm, 'year', e)
    // },
    // handleChangeMonth (e) {
    //   this.$set(this.checkSearchForm, 'month', e)
    // },
    // handleChangeDay (e) {
    //   this.$set(this.checkSearchForm, 'day', e)
    // }
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
    handleExportExcel () {
      this.importSearchForm.organizationId = this.$store.state.user.organizationId
      let str = ''
      for (let [key, val] of Object.entries(this.importSearchForm)) {
        str += key + '=' + val + '&'
      }
      let link = document.createElement('a')
      link.style.display = 'none'
      if (this.importSearchForm.time) {
        link.href = '//www.sscs58.com:8003/api/hd/device/report/export?' + str
      } else {
        link.href = '//39.105.79.197:8002/api/tb/device/report/export?' + str
      }
      link.click()
    },
    // 盘点导出
    handleExportExcel2 () {
      this.checkSearchForm.organizationId = this.$store.state.user.organizationId
      let str = ''
      for (let [key, val] of Object.entries(this.checkSearchForm)) {
        str += key + '=' + val + '&'
      }
      let link = document.createElement('a')
      link.style.display = 'none'
      if (this.checkSearchForm.time) {
        link.href = '//www.sscs58.com:8003/api/hd/device/check/export?' + str
      } else {
        link.href = '//39.105.79.197:8002/api/tb/device/check/export?' + str
      }
      link.click()
    },
    handleClear () {

    },
    // 盘点分页点击事件
    handleChangePage (e) {
      const obj = { size: this.size, index: e, organizationId: this.$store.state.user.organizationId }
      Object.assign(obj, this.checkSearchForm)
      this.getDeviceRealTimeCheck(obj)
    },
    // 报表分页点击事件
    handleChangeReportPage (e) {
      const obj = { size: this.importSize, index: e }
      Object.assign(obj, this.importSearchForm)
      this.getDeviceRealTimeReport(obj)
    },
    // 报表搜索
    handleImportSearch () {
      this.importSearchForm.organizationId = this.$store.state.user.organizationId
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
    handleSearch () {
      this.checkSearchForm.organizationId = this.$store.state.user.organizationId
      if (this.checkSearchForm.time) {
        this.checkLoading = true
        getCheck(this.checkSearchForm).then(res => {
          this.checkLoading = false
          if (res.data.code === 0) {
            this.checkTableData = res.data.data.list
            this.total = res.data.data.total
          }
        })
      } else {
        getDeviceRealTimeCheck(this.checkSearchForm).then(res => {
          this.checkLoading = false
          if (res.data.code === 0) {
            this.checkTableData = res.data.data.list
            this.total = res.data.data.total
          }
        })
      }
    },
    // 流动图搜索
    handleTrendSearch () {
      this.trendSearchForm.organizationId = this.$store.state.user.organizationId
      getTrend(this.trendSearchForm).then(res => {
        this.chartLineOption = this.initChartOption(res.data.data)
      })
    },
    // 设备轨迹搜索
    handleTraceSearch () {
      getTrace(this.traceSearchForm).then(res => {
        console.log(res)
        this.timelineList = res.data.data.list
      })
    },
    handleChangeTraceTimeRange (e) {
      this.traceSearchForm.startTime = new Date(e[0]).getTime()
      this.traceSearchForm.endTime = new Date(e[1]).getTime()
    },
    handleChangeTrendTimeRange (e) {
      this.trendSearchForm.startTime = new Date(e[0]).getTime()
      this.trendSearchForm.endTime = new Date(e[1]).getTime()
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
          containLabel: true
        },
        legend: { data: [] },
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
      for (let [key, value] of Object.entries(data)) {
        option.legend.data.push(key)
        var obj = {
          name: key,
          type: 'line',
          stack: '总量',
          data: []
        }
        for (let [sk, sv] of Object.entries(value)) {
          option.xAxis.data.push(sk)
          obj.data.push(sv)
        }
        option.series.push(obj)
      }
      return option
    },
    // 报表区域改变事件
    handleChangeImportArea (e) {
      getScene({ areaId: e.value }).then(res => {
        this.sceneList = res.data.data.list
      })
    },
    // 盘点区域改变事件
    handleChangeArea (e) {
      // this.checkSearchForm.areaName = e.label
      getScene({ areaId: e.value }).then(res => {
        this.sceneList = res.data.data.list
      })
    },
    handleChangeTrendArea (e) {
      getScene({ areaId: e.value }).then(res => {
        this.trendSceneList = res.data.data.list
      })
    },
    // handleChangeScene (e) {
    //   this.checkSearchForm.sceneName = e.label
    // },
    handleChangeTrendScene (e) {
      // this.checkSearchForm.sceneName = e.label
    }
  },
  mounted () {
    if (this.areaList.length === 0) {
      this.getAreaList()
    }
    this.getDeviceRealTimeReport()
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
