<template>
  <div class="home-container">
    <Row>
      <i-col>
        <Card>
          <p slot="title">库区所在城市：</p>
          <div class="center">
            <RadioGroup v-model="selectedCity" type="button" @on-change="handleCityChange">
              <Radio v-for="(item, index) in cityList" :key="index" :label="item.id">{{item.name}}</Radio>
            </RadioGroup>
          </div>
        </Card>
      </i-col>
    </Row>
    <Row>
      <i-col>
        <baidu-map class="bm-view" ak="XP1alssWsEscC3NfYAhj6YfqKvgQgUXF" :center="initMap.center" :zoom="initMap.zoom" :scroll-wheel-zoom="initMap.isScrollWheelZoom">
          <!-- <bm-copyright
            anchor="BMAP_ANCHOR_TOP_RIGHT"
            :copyright="[{id: 1, content: initMap.copyrightContent}]">
          </bm-copyright> -->
           <bm-marker v-for="(item, index) in points" :key="index" :position="item" @click="item.show=true" @mouseover="item.show=!item.show" @mouseleave="item.show=!item.show" animation="BMAP_ANIMATION_DROP">
             <bm-info-window :show="item.show">
               <p>{{item.name}}区域</p>
               设备总数：<span class="mark">{{item.number}}</span>
               </bm-info-window>
               <!-- <bm-label  /> -->
          </bm-marker>
          <Drawer scrollable :mask-style="{background: 'transparent'}" class-name="drawer-style" title="库区" width="11" class="center" placement="left" :closable="false" v-model="isShowDrawerLeft" :inner="true" :transfer="false" @on-visible-change="handleLeftDrawerClose">
            <Dropdown @on-click="handleClickleftDrawerMenu" v-for="(item, index) in leftDrawerList" :key="index" placement="right-start" :transfer="true" transfer-class-name="show-menu">
              <a href="javascript:;" @click="handleClickleftDrawerMenu('areaId/' + item.id + '/' + item.name)">
                <Button type="text" ghost long>{{item.name}}<Icon type="ios-arrow-forward"></Icon></Button>
                <Divider size="small"/>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem  :name="'sceneId/' + sItem.id + '/' + sItem.name" v-for="(sItem, sIndex) in item.sceneList" :key="sIndex">{{sItem.name}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Drawer>
          <Drawer class-name="drawer-style" width="60" :closable="false" placement="right" :mask="false" v-model="isShowDrawerRight" :inner="true" :transfer="false">
            <Row>
              <i-col span="14">
                <Card :padding="0" :bordered="false" style="background: transparent;">
                  <p slot="title">{{chartTitle}}</p>
                  <chart-bar :option="chartBarOption" style="height: 200px"></chart-bar>
                </Card>
              </i-col>
              <i-col span="10">
                <Card :padding="0" :bordered="false" style="background: transparent;">
                  <p slot="title">资产丢失</p>
                  <div slot="extra"> <a href="javascript:;" @click.prevent="toMissed"> 查看详情<Icon type="ios-arrow-forward" /></a></div>
                  <chart-pie :option="chartPieOption" style="width: 100%;height: 200px"></chart-pie>
                </Card>
              </i-col>
            </Row>
            <Row>
              <i-col span="24">
                <Card :padding="0" :bordered="false" style="background: transparent;">
                  <p slot="title">设备详情</p>
                  <chart-pie :option="secondChartPieOption" style="width: 100%;height: 250px"></chart-pie>
                </Card>
              </i-col>
            </Row>
          </Drawer>
        </baidu-map>
      </i-col>
    </Row>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map'
// import BmCopyright from 'vue-baidu-map/components/controls/Copyright'
// import BmLabel from 'vue-baidu-map/components/overlays/Label'
import BmMarker from 'vue-baidu-map/components/overlays/Marker'
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow'
import ChartBar from '@/components/charts/bar'
import ChartPie from '@/components/charts/pie'

import { getCityListByOid, getCityInfo, getDeviceNumber } from '@/api/data'
import { mapActions } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      initMap: {
        center: '北京', // 经纬度
        zoom: 5, // 缩放等级
        isScrollWheelZoom: true,
        copyrightContent: '中集制冷'
      },
      points: [],
      selectedCity: '',
      isShowDrawerLeft: false,
      isShowDrawerRight: false,
      leftDrawerList: [],
      chartBarOption: {},
      chartPieOption: {},
      secondChartPieOption: {},
      chartTitle: '',
      cityList: []
    }
  },
  components: {
    BaiduMap,
    // BmCopyright,
    // BmLabel,
    BmMarker,
    BmInfoWindow,
    ChartBar,
    ChartPie
  },
  computed: {
    // ...mapState({
    //   cityList: state => state.app.cityList
    // })
  },
  methods: {
    ...mapActions(['getCityList']),
    async handleCityChange (e) {
      const res = await getCityInfo(e)
      if (res.data.code === 0) {
        this.leftDrawerList = res.data && res.data.data.list
      }
      this.isShowDrawerLeft = true
    },
    handleClickleftDrawerMenu (e) {
      console.log(e)
      getDeviceNumber({ key: e.split('/')[0], value: e.split('/')[1] }).then(res => {
        if (res.data.code === 0) {
          let lists = res.data.data.list
          this.chartTitle = e.split('/')[2]
          this.chartBarOption = this.traverseDeviceList(lists)
          this.chartPieOption = this.changeList(lists)
          this.secondChartPieOption = this.statisticList(lists)
        }
      })
      this.isShowDrawerRight = true
    },
    handleLeftDrawerClose () {
      this.isShowDrawerRight = false
    },
    toMissed () {
      this.$router.push({
        name: 'missed'
      })
    },
    traverseDeviceList (lists) {
      if (lists.length === 0) return {}
      var xAxis = {
        type: 'value',
        axisLabel: {
          color: '#fff'
        },
        splitLine: { show: true }
      }
      var textStyle = {
        color: '#fff'
      }
      var yAxis = {
        type: 'category',
        axisLabel: {
          color: '#fff'
        },
        splitLine: { show: false },
        data: []
      }
      var tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      }
      var grid = {
        left: '25%',
        right: 20,
        top: 10,
        bottom: 30
      }
      var series = [{
        name: '数量',
        type: 'bar',
        barWidth: '60%',
        data: []
      }]
      lists.forEach((item, index) => {
        if (item.name === 'Unknown') return
        item.sub.forEach((sItem, sIndex) => {
          if (sItem.name === 'Unknown') return
          yAxis.data.push(item.name + '/' + sItem.name)
          series[0].data.push(sItem.number)
        })
      })
      return {
        tooltip,
        textStyle,
        grid,
        xAxis,
        yAxis,
        series
      }
    },
    statisticList (lists) {
      if (lists.length === 0) return {}
      const newList = []
      lists.forEach((item, index) => {
        if (item.name !== 'Unknown') {
          newList.push(item)
        }
      })
      var tooltip = {
        trigger: 'item'
      }
      var series = []
      newList.forEach((item, index) => {
        if (item.name === 'Unknown') return
        var obj = {
          name: item.name,
          type: 'pie',
          radius: ['60%', (70 / newList.length) + '%'],
          center: [(2 * index + 1) / 2 / newList.length * 100 + '%',
            '50%'
          ],
          label: {
            normal: {
              formatter: '{a}\n {b}:{c}',
              show: true,
              textStyle: {
                fontSize: 14
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          data: []
        }
        item.sub.forEach((sItem, sIndex) => {
          if (sItem.name === 'Unknown') return
          const sObj = {
            value: sItem.number,
            name: sItem.name
          }
          obj.data.push(sObj)
        })
        series.push(obj)
      })
      return {
        tooltip,
        series
      }
    },
    changeList (lists) {
      if (lists.length === 0) return {}
      var tooltip = {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
      }
      var legend = {
        bottom: 'bottom',
        textStyle: {
          fontSize: 16,
          color: '#fff'
        }
      }
      var series = [{
        name: '丢失',
        type: 'pie',
        radius: '50%',
        label: {
          show: true,
          // position: 'center',
          fontSize: 20,
          color: '#fff',
          formatter: '{c}',
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        },
        center: ['50%', '40%'],
        data: []
      }]
      lists.forEach((item, index) => {
        if (item.name === 'Unknown') return
        series[0].data.push({ value: item.missed, name: item.name })
      })
      return {
        tooltip,
        legend,
        series
      }
    },
    traverseCityList (lists) { // 数据转换
      return lists.reduce((a, v) => {
        return a.concat({ lng: v.longitude, lat: v.latitude, show: false, name: v.name, number: v.number, id: v.id })
      }, [])
    },
    async addPoints () { // 地图添加点
      const res = await getCityListByOid()
      if (res.data && res.data.code === 0) {
        const list = this.traverseCityList(res.data.data.list)
        this.points = list
        this.cityList = list
      }
    }
  },
  created () {
    this.addPoints()
  }
}
</script>

<style lang="less">
  .show-menu {
    background: rgba(0, 0, 0, 0.5);
    ul li {
      color: #fff;
    }
    .ivu-dropdown-item:hover {
      background: transparent;
    }
  }
.home-container {
  .drawer-style .ivu-drawer-content {
    background: rgba(0, 0, 0, 0.5);
    .ivu-drawer-header-inner {
      color: #fff;
    }
    button {
      color: #fff;
    }
  }
  .ivu-card-head p, .ivu-card-head-inner {
    color: #fff;
  }
}
</style>
<style lang="less" scoped>
.bm-view {
  width: 100%;
  height: 600px;
}
.mark {
  color: red;
}
.center {
  text-align: center;
}
.show-menu {
  z-index: 10;
}
</style>
