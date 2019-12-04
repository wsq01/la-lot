<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Cookies from 'js-cookie'
export default {
  name: 'App',
  data () {
    return {
      socketUrl: 'ws://39.105.79.197:8002/websocket/' + Cookies.get('userId'),
      socket: null
    }
  },
  mounted () {
    this.initScoket()
  },
  // watch: {
  //   message: function(newVal, oldVal) {
  //     const msg = JSON.parse(newVal)
  //     console.log(msg)
  //     if (msg.result === 'succeed') {
  //       if (this.handleOption === 'timer') {
  //         this.$set(this.tableData[this.clickedItem._index], 'status', msg.status)
  //         this.isDisabled[this.clickedItem._index] = true
  //         this.$Notice.success('对时完成！')
  //       } else if(this.handleOption === 'reset') {

  //       } else if(this.handleOption === 'param') {

  //       } else if(this.handleOption === 'update') {
  //         this.modal1 = true
  //         this.progress = res.count / res.total
  //       }
  //     } else {
  //       this.$Notice.error({
  //         title: msg.result
  //       })
  //       this.message = {}
  //     }
  //   }
  // },
  methods: {
    ...mapActions(['reqSocketMsg']),
    initScoket () {
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
        console.log(this.socketUrl)
        this.socket = new WebSocket(this.socketUrl)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open () {
      console.log('socket连接成功')
    },
    error () {
      this.$Notice.info({
        title: '提示',
        desc: 'socket连接失败！'
      })
    },
    getMessage (msg) {
      // this.message = msg.data
      this.reqSocketMsg(msg.data)
    },
    send () {
      this.socket.send('params')
    },
    close () {
      console.log('socket已经关闭')
    }
  },
  beforeDestroy () {
    // 销毁监听
    if (this.socket) this.socket.onclose = this.close
  }
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
