<template>
  <Row type="flex" :gutter="20">
    <i-col :span="6" v-for="(item, index) in lists" :key="index">
      <Card :padding="20" style="margin: 20px auto;text-align: center" :style="item.status === 1 ? 'color: green' : 'color: red'">
        <div>{{item.area_name}}</div>
        <div>{{item.name}}</div>
        <div>{{item.device_num}}</div>
        <div>{{item.scene_name}}</div>
        <div>{{item.status}}</div>
      </Card>
    </i-col>
  </Row>
</template>

<script>
import { getDeviceRealTime } from '@/api/data'
export default {
  name: 'repository',
  data () {
    return {
      size: 10,
      lists: [],
      timer: null
    }
  },
  methods: {
    getDeviceRealTime (params) {
      getDeviceRealTime(params).then(res => {
          console.log(res)
        if (res.data.code === 0) {
          this.lists = res.data.data.list
        }
      })
    },
  },
  mounted () {
    this.getDeviceRealTime({ key: 'receiverNum', value: '33ffd4055054' })
    this.timer = setInterval(() => {
      this.getDeviceRealTime({ key: 'receiverNum', value: '33ffd4055054' })
    }, 30000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
