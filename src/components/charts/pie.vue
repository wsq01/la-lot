<template>
  <div ref="dom" class="charts chat-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  data () {
    return {
      dom: null
    }
  },
  props: {
    option: Object
  },
  watch: {
    option () {
      this.initChart()
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    initChart () {
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(this.option, true)
        on(window, 'resize', this.resize)
      })
    }
  },
  mounted () {
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>

<style>

</style>
