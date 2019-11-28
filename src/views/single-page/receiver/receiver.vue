<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key" class="search-item">
              <template v-for="item in columns">
                <Option v-if="item.key && item.key !== 'remark'" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
              </template>
            </Select>
          </FormItem>
          <FormItem>
            <Input @on-change="handleClear" clearable placeholder="请输入关键字" v-model="searchForm.value" class="search-item" />
          </FormItem>
          <FormItem>
            <Button @click="handleSearch" type="primary" icon="md-search">搜索</Button>
          </FormItem>
          <FormItem>
            <Poptip confirm title="确定要重载固件吗？" transfer @on-ok="editItemReload(row, index)">
              <Button type="primary">重载固件</Button>
            </Poptip>
          </FormItem>
          <span v-for="(bItem, bIndex) in btnList" :key="bIndex">
            <FormItem v-if="bItem === 'ADD'">
              <Button @click="addItem" type="primary" icon="md-add">新增</Button>
            </FormItem>
          </span>
        </Form>
      </i-col>
    </Row>
    <Row>
      <i-col :span="24">
        <Table :loading="loading" stripe border :columns="columns" :data="tableData" @on-select="handleSelectTableItem">
          <template slot-scope="{row, index}" slot="action">
            <div v-for="(bItem, bIndex) in btnList" :key="bIndex" style="display: inline-block;margin-right: 5px">
              <Poptip v-if="bItem === 'DELETE'" confirm title="确定要删除吗？" transfer @on-ok="deleteItem(row, index)">
                <Button type="error" size="small">删除</Button>
              </Poptip>
              <Button v-if="bItem === 'EDIT'" type="primary" size="small" @click="editItem(row, index)">编辑</Button>
            </div>
            <Button type="success" size="small" style="margin-right: 5px" @click="editItemTimer(row, index)">对时</Button>
            <Button type="success" size="small" style="margin-right: 5px" :disabled="!isDisabled[index]" @click="editItemReset(row, index)">重启</Button>
            <Button type="success" size="small" style="margin-right: 5px" @click="openModal(row, index)">设置参数</Button>
            <Button type="success" size="small" style="margin-right: 5px" @click="editItemUpdate(row, index)">更新固件</Button>
          </template>
        </Table>
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" @on-page-size-change="handlePageSizeChange" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>
    <Modal v-model="modal" scrollable class-name="vertical-center-modal" title="设置参数" @on-ok="editItemParam" @on-cancel="closeModal">
      <Form :model="receiverParams" :label-width="80" style="padding: 0 50px">
        <FormItem label="条数">
          <Input clearable placeholder="请输入条数" v-model="receiverParams.count" />
        </FormItem>
        <FormItem label="发送间隔(s)">
          <Input clearable placeholder="请输入发送间隔秒数" v-model="receiverParams.interval" />
        </FormItem>
      </Form>
    </Modal>
    <Modal :styles="{top: '20px'}" v-model="modal1" draggable scrollable :footer-hide="true">
      <Progress :percent="progress" :stroke-color="['#108ee9', '#87d068']" />
    </Modal>
  </Card>
</template>

<script>
import { getReceiver, deleteReceiver, orderReceiver } from '@/api/data'
import { getBtn } from '@/api/user'
import minxin from '@/assets/js/mixin'

export default {
  name: 'Receiver',
  mixins: [ minxin ],
  data () {
    return {
      columns: [
        // {
        //   type: 'selection',
        //   width: 50,
        //   align: 'center'
        // },
        {
          title: '接收器ID',
          key: 'id'
        },
        {
          title: '接收器名称',
          key: 'name'
        },
        {
          title: '接收器编号',
          key: 'receiverNum'
        },
        {
          title: '场景ID',
          key: 'sceneId'
        },
        {
          title: '场景名称',
          key: 'sceneName'
        },
        {
          title: '接收器类型',
          key: 'type'
        },
        {
          title: '接收器状态',
          key: 'status'
        },
        {
          title: '操作',
          slot: 'action',
          width: 400,
          align: 'center'
        }
      ],
      btnList: [],
      socketUrl: 'ws://39.105.79.197:8002/websocket',
      socket: null,
      modal: false,
      modal1: false,
      receiverParams: {},
      handleOption: '',
      clickedItem: {},
      isDisabled: [],
      message: '',
      progress: 0,
      worker: null
    }
  },
  methods: {
    // 获取列表
    getItems (params) {
      getReceiver(params).then(res => {
        this.getSuccess(res)
      })
    },
    // 删除
    deleteItem (row, index) {
      deleteReceiver(row.id).then(res => {
        this.deleteSuccess(res)
      })
    },
    addItem () {
      this.$router.push({
        name: 'add-receiver'
      })
    },
    editItem (row, index) {
      this.$router.push({
        name: 'edit-receiver',
        params: row
      })
    },
    initBtn () {
      const uri = this.$route.name
      const menuList = this.$store.state.user.userMenu
      let menuId = '0'
      menuList.forEach((item, index) => {
        if (item.uri === uri) {
          menuId = item.id
        }
      })
      getBtn({ menuId }).then(res => {
        if (res.data.code === 0) {
          const btnList = res.data.data.list
          btnList.forEach((item, index) => {
            this.btnList.push(item.buttonName)
          })
        }
      })
    },
    editItemUpdate (row, index) {
      this.clickedItem = row
      const obj = { order: 'update', receiverNum: row.receiverNum }
      this.handleOption = 'update'
      orderReceiver(obj).then(res => {
        this.$Notice.info({
          title: '正在更新，请稍等...'
        })
      })
    },
    editItemTimer (row, index) {
      this.clickedItem = row
      const obj = { order: 'timer', receiverNum: row.receiverNum }
      this.handleOption = 'timer'
      orderReceiver(obj).then(res => {
        console.log(res)
        this.$Notice.info({
          title: '正在对时，请稍等...'
        })
      })
    },
    editItemReset (row, index) {
      this.clickedItem = row
      const obj = { order: 'reset', receiverNum: row.receiverNum }
      this.handleOption = 'reset'
      orderReceiver(obj).then(res => {
        this.$Notice.info({
          title: '正在重启，请稍等...'
        })
      })
    },
    editItemReload () {

    },
    openModal (row, index) {
      this.modal = true
      this.selectedReceiverNum = row.receiverNum
      this.clickedItem = row
    },
    closeModal () {
      this.receiverParams = {}
    },
    editItemParam () {
      const obj = { order: 'param', receiverNum: this.selectedReceiverNum }
      this.handleOption = 'param'
      Object.assign(obj, this.receiverParams)
      this.receiverParams = {}
      orderReceiver(obj).then(res => {
        console.log(res)
        this.$Notice.info({
          title: '正在设置参数，请稍等...'
        })
      })
    },
    initScoket () {
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
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
      this.message = msg.data
    },
    send () {
      this.socket.send('params')
    },
    close () {
      console.log('socket已经关闭')
    },
    initWorker () {

    }
  },
  watch: {
    message: function(newVal, oldVal) {
      const msg = JSON.parse(newVal)
      console.log(msg)
      if (msg.result === 'succeed') {
        if (this.handleOption === 'timer') {
          this.$set(this.tableData[this.clickedItem._index], 'status', msg.status)
          this.isDisabled[this.clickedItem._index] = true
          this.$Notice.success('对时完成！')
        } else if(this.handleOption === 'reset') {

        } else if(this.handleOption === 'param') {

        } else if(this.handleOption === 'update') {
          this.modal1 = true
          this.progress = res.count / res.total
        }
      } else {
        this.$Notice.error({
          title: msg.result
        })
        this.message = {}
      }
    }
  },
  mounted () {
    this.initBtn()
    this.initScoket()
  },
  beforeDestroy () {
    // 销毁监听
    if (this.socket) this.socket.onclose = this.close
  }
}
</script>
