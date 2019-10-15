<template>
  <Card>
    <Tabs @on-click="handleClickTab">
      <TabPane v-for="item in tabOption" :label="item.label" :key="item.name">
        <!-- 1 -->
        <div v-if="item.name === 'check'">
          <Row>
            <i-col :span="24">
              <Form ref="checkForm" :model="checkSearchForm" inline :label-width="50">
                <FormItem label="区域:">
                  <Select v-model="checkSearchForm.areaId" transfer class="search-col" label-in-value @on-change="handleChangeArea">
                    <template v-for="item in areaList">
                      <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="场景:">
                  <Select v-model="checkSearchForm.sceneId" transfer label-in-value class="search-col" @on-change="handleChangeScene">
                    <template v-for="item in sceneList">
                      <Option :value="item.id" :key="`search-${item.id}`">{{item.name}}</Option>
                    </template>
                  </Select>
                </FormItem>
                <FormItem label="年:">
                  <DatePicker type="year" format="yyyy" @on-change="handleChangeYear" placeholder="请选择年" class="search-col search-datepicker" transfer></DatePicker>
                </FormItem>
                <FormItem label="月:">
                  <DatePicker type="month" format="M" @on-change="handleChangeMonth" placeholder="请选择月" class="search-col search-datepicker" transfer></DatePicker>
                </FormItem>
                <FormItem label="日:">
                  <DatePicker type="date" format="d" @on-change="handleChangeDay" placeholder="请选择日" class="search-col search-datepicker" transfer></DatePicker>
                </FormItem>
                <Button @click="handleSearch" type="primary" class="search-btn"><Icon type="md-search" />&nbsp;&nbsp;搜索</Button>
              </Form>
            </i-col>
          </Row>
          <Row>
            <i-col :span="24">
              <Table :loading="loading" stripe border :columns="columns" :data="tableData"></Table>
              <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" style="margin: 10px 0 0"></Page>
            </i-col>
          </Row>
        </div>
        <!-- 2 -->
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
                  <Select v-model="trendSearchForm.sceneId" transfer class="search-col" label-in-value @on-change="handleChangeTrendScene">
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
        <!-- 3 -->
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
import { getScene } from '@/api/data'
import { getCheck, getTrace, getTrend } from '@/api/history'
import { mapState, mapActions } from 'vuex'
import ChartLine from '@/components/charts/line'
export default {
  name: 'Check',
  data () {
    return {
      tabOption: [
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
      loading: false,
      total: 0,
      size: 10,
      searchKey: 'sceneId',
      searchValue: '',
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
      tableData: [],
      sceneList: [],
      trendSceneList: [],
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
      if (name === 'historydata') {

      }
    },
    handleClear () {

    },
    handleChangeYear (e) {
      this.$set(this.checkSearchForm, 'year', e)
    },
    handleChangeMonth (e) {
      this.$set(this.checkSearchForm, 'month', e)
    },
    handleChangeDay (e) {
      this.$set(this.checkSearchForm, 'day', e)
    },
    handleSearch () {
      getCheck(this.checkSearchForm).then(res => {
      })
    },
    handleTrendSearch () {
      getTrend(this.trendSearchForm).then(res => {
        this.chartLineOption = this.initChartOption(res.data.data)
        console.log(JSON.stringify(this.chartLineOption))
      })
    },
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
    handleChangePage () {

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
        legend: {data: []},
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
      for(let [key, value] of Object.entries(data)) {
        option.legend.data.push(key)
        var obj = {
          name: key,
          type: 'line',
          stack: '总量',
          data: []
        }
        for(let [sk, sv] of Object.entries(value)) {
          option.xAxis.data.push(sk)
          obj.data.push(sv)
        }
        option.series.push(obj)
      }
      return option
    },
    // 选择区域联动场景
    handleChangeArea (e) {
      this.checkSearchForm.areaName = e.label
      getScene({ areaId: e.value }).then(res => {
        this.sceneList = res.data.data.list
      })
    },
    handleChangeTrendArea (e) {
      getScene({ areaId: e.value }).then(res => {
        this.trendSceneList = res.data.data.list
      })
    },
    handleChangeScene (e) {
      this.checkSearchForm.sceneName = e.label
    },
    handleChangeTrendScene (e) {
      this.checkSearchForm.sceneName = e.label
    }
  },
  mounted () {
    if (this.areaList.length === 0) {
      this.getAreaList()
    }
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
  }
}
.timeline-item {
  display: flex;
}
.time {
  margin: 0 50px 0 0;
}
</style>
