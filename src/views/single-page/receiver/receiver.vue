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
            <Poptip confirm title="确定要重载固件吗？" transfer @on-ok="editItemReload()">
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
          <Input clearable placeholder="请输入条数" v-model="receiverParams.counts" />
        </FormItem>
        <FormItem label="发送间隔(s)">
          <Input clearable placeholder="请输入发送间隔秒数" v-model="receiverParams.seconds" />
        </FormItem>
      </Form>
    </Modal>
    <Modal :styles="{top: '20px'}" v-model="modal1" draggable scrollable :footer-hide="true">
      <Progress :percent="progress" :stroke-color="['#108ee9', '#87d068']" />
    </Modal>
  </Card>
</template>

<script>
// import { mapState } from 'vuex'
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
      modal: false,
      modal1: false,
      receiverParams: {},
      clickedItem: {},
      isDisabled: [],
      progress: 0
    }
  },
  methods: {
    // 获取列表
    getItems (params) {
      getReceiver(params).then(res => {
        this.loading = false
        if (res.data.code === 0) {
          res.data.data.list.forEach((item, index) => {
            item.status = 'offline'
          })
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        } else {

        }
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
      orderReceiver(obj).then(res => {
        this.$Notice.info({
          title: '正在更新，请稍等...'
        })
      })
    },
    editItemTimer (row, index) {
      this.clickedItem = row
      const obj = { order: 'timer', receiverNum: row.receiverNum }
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
      orderReceiver(obj).then(res => {
        this.$Notice.info({
          title: '正在重启，请稍等...'
        })
      })
    },
    editItemReload () {
      const obj = { order: 'reload' }
      orderReceiver(obj).then(res => {
        this.$Notice.info({
          title: '正在重新加载，请稍等...'
        })
      })
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
      Object.assign(obj, this.receiverParams)
      this.receiverParams = {}
      orderReceiver(obj).then(res => {
        console.log(res)
        this.$Notice.info({
          title: '正在设置参数，请稍等...'
        })
      })
    }
  },
  computed: {
    socketMsg () {
      if (!this.$store.state.app.socketMsg) return
      const obj = JSON.parse(this.$store.state.app.socketMsg)
      this.tableData.forEach((item, index) => {
        if (item.receiverNum === obj.receive_num) {
          this.isDisabled[index] = true
          this.$set(this.tableData[index], 'status', obj.status)
        } else {
          this.isDisabled[index] = false
        }
      })
      return JSON.parse(this.$store.state.app.socketMsg)
    }
  },
  watch: {
    socketMsg (val) {
      console.log(val)
      if (val.result && val.result === 'succeed') {
        if (val.order === 'timer') {
          this.$Notice.success({
            title: '对时成功！'
          })
          // const obj = JSON.parse(this.$store.state.app.socketMsg)
          // this.tableData.forEach((item, index) => {
          //   if (item.receiverNum === obj.receive_num) {
          //   }
          // })
        } else if (val.order === 'pingpong') {
          const obj = JSON.parse(this.$store.state.app.socketMsg)
          this.tableData.forEach((item, index) => {
            if (item.receiverNum === obj.receive_num) {
              this.isDisabled[index] = true
              this.$set(this.tableData[index], 'status', obj.status)
            } else {
              this.isDisabled[index] = false
            }
          })
        } else if (val.order === 'reset') {
          this.$Notice.success({
            title: '重启成功！'
          })
        } else if (val.order === 'param') {
          this.$Notice.success({
            title: '设置参数成功！'
          })
        } else if (val.order === 'update') {
          this.modal1 = true
          this.progress = val.count / val.total
        }
      } else if (val.result && val.result !== 'succeed') {
        this.$Notice.error({
          title: val.result
        })
        this.tableData.forEach((item, index) => {
          if (item.receiverNum === val.receive_num) {
            this.$set(this.tableData[index], 'status', val.status)
          }
        })
      } else {}
    }
  },
  mounted () {
    this.initBtn()
  }
}
</script>
