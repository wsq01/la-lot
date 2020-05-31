<template>
  <Row type="flex" :gutter="20">
    <i-col :span="6" :xs="{span: 12}" v-for="(item, index) in lists" :key="index">
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
    async getDeviceRealTime (params) {
      const res = await getDeviceRealTime(params)
      if (res.data.code === 0) {
        const arr = []
        res.data.data.list.forEach(item => {
          if (item.device_num.startsWith('03')) {
            arr.push(item)
          }
        })
        this.lists = arr
      }
    }
  },
  mounted () {
    this.getDeviceRealTime({ key: 'receiverNum', value: '000000000002', size: 743 })
    this.timer = setInterval(() => {
      this.getDeviceRealTime({ key: 'receiverNum', value: '000000000002', size: 743 })
    }, 30000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
