<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key">
              <template v-for="item in columns">
                <Option v-if="item.key && item.key !== 'remark'" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
              </template>
            </Select>
          </FormItem>
          <FormItem>
            <Input @on-change="handleClear" clearable placeholder="请输入关键字" v-model="searchForm.value" class="search-item" />
          </FormItem>
          <FormItem>
            <RadioGroup v-model="searchForm.state" type="button">
              <Radio label="">全部</Radio>
              <Radio label="0">空闲</Radio>
              <Radio label="1">在线</Radio>
              <Radio label="2">离线</Radio>
          </RadioGroup>
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
        <Table :loading="loading" stripe border :columns="columns" :data="tableData" @on-select-change="handleSelectTableItem">
          <template slot-scope="{ row }" slot="status">
            <!-- 0: 空闲 1: 在线 2: 离线 -->
            <span :style="{color: row.state === 1 ? '#19be6b' : row.state === 2 ? '#c5c8ce' : ''}">{{ row.state === 0 ? '空闲' : row.state === 1 ? '在线' : '离线' }}</span>
          </template>
          <template slot-scope="{row, index}" slot="action">
            <div v-for="(bItem, bIndex) in btnList" :key="bIndex" style="display: inline-block;margin-right: 5px">
              <Poptip v-if="bItem === 'DELETE'" confirm title="确定要删除吗？" transfer @on-ok="deleteItem(row, index)">
                <Button type="error" size="small">删除</Button>
              </Poptip>
              <Button v-if="bItem === 'EDIT'" type="primary" size="small" @click="editItem(row, index)">编辑</Button>
            </div>
            <Button type="success" size="small" style="margin-right: 5px" @click="editItemTimer(row, index)">对时</Button>
            <Button type="success" size="small" style="margin-right: 5px" :disabled="isDisabled[index]" @click="editItemReset(row, index)">重启</Button>
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
    <Modal v-model="modalConfig.show" :width="400" :title="modalConfig.title">
      <Row type="flex" justify="center">
        <i-col span="24">
          <Form ref="formValidate" :model="formItem" :label-width="80" :rules="rules">
            <FormItem :label="formItemLabel[0]">
              <Input v-model="formItem.name" />
            </FormItem>
            <FormItem :label="formItemLabel[1]" prop="receiverNum">
              <Input v-model="formItem.receiverNum" />
            </FormItem>
            <FormItem :label="formItemLabel[2]">
              <Select v-model="formItem.sceneId">
                <Option v-for="(item, index) in sceneList" :key="index" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="formItemLabel[3]">
              <Input v-model="formItem.type" />
            </FormItem>
            <FormItem :label="formItemLabel[4]">
              <Input v-model="formItem.remark" type="textarea"/>
            </FormItem>
          </Form>
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="modalSubmit('formValidate')">提交</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
import { getReceiver, deleteReceiver, orderReceiver, addReceiver, editReceiver } from '@/api/data'
import { getBtn } from '@/api/user'
import minxin from '@/assets/js/mixin'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Receiver',
  mixins: [ minxin ],
  data () {
    return {
      columns: [
        {
          title: '接收器ID',
          key: 'id',
          minWidth: 130,
          align: 'center'
        },
        {
          title: '接收器名称',
          key: 'name',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '接收器编号',
          key: 'receiverNum',
          sortable: true,
          minWidth: 120,
          align: 'center'
        },
        {
          title: '场景ID',
          key: 'sceneId',
          minWidth: 130,
          align: 'center'
        },
        {
          title: '场景名称',
          key: 'sceneName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          minWidth: 90,
          align: 'center'
        },
        {
          title: '状态',
          key: 'state',
          slot: 'status',
          minWidth: 70,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 360,
          fixed: 'right',
          align: 'center'
        }
      ],
      btnList: [],
      modal: false,
      modal1: false,
      receiverParams: {},
      clickedItem: {},
      isDisabled: [],
      progress: 0,
      formItemLabel: ['接收器名称', '接收器编号', '场景', '类型', '备注'],
      formItem: {},
      rules: {
        receiverNum: [
          { required: true, message: '编号不能为空', trigger: 'blur' }
        ]
      },
      modalConfig: {
        show: false,
        title: '',
        type: ''
      }
    }
  },
  computed: {
    ...mapState({
      sceneList: state => state.app.sceneList
    }),
    socketMsg () {
      return this.computedSocketMsg()
    }
  },
  methods: {
    ...mapActions(['getSceneList']),
    async getItems (params) {
      const res = await getReceiver(params)
      this.getSuccess(res)
      if (res.data.code === 0) {
        this.isDisabled = []
        this.tableData.forEach((item, index) => {
          if (item.state === 1) {
            this.isDisabled[index] = false
          } else {
            this.isDisabled[index] = true
          }
        })
      }
    },
    async deleteItem (row, index) {
      const res = await deleteReceiver(row.id)
      this.deleteSuccess(res, index)
    },
    async initBtn () {
      const uri = this.$route.name
      const menuList = this.$store.state.user.userMenu
      const menu = menuList.find(item => item.uri === uri || item.uri === '/' + uri)
      const res = await getBtn({ menuId: menu.id })
      if (res.data.code === 0) {
        this.btnList = res.data.data.list.map(item => item.buttonName)
      }
    },
    handleSearch () {
      const obj = {}
      if (this.searchForm.state) {
        obj.state = this.searchForm.state
      }
      obj[this.searchForm.key] = this.searchForm.value
      this.getItems(obj)
    },
    handlePageSizeChange (e) {
      this.size = e
      const searchObj = { size: this.size }
      if (this.searchForm.state) {
        Object.assign(searchObj, { state: this.searchForm.state })
      }
      if (this.searchForm.value) {
        Object.assign(searchObj, { [this.searchForm.key]: this.searchForm.value })
      }
      this.getItems(searchObj)
    },
    handleChangePage (e) {
      const searchObj = { size: this.size, index: e }
      if (this.searchForm.state) {
        Object.assign(searchObj, { state: this.searchForm.state })
      }
      if (this.searchForm.value) {
        Object.assign(searchObj, { [this.searchForm.key]: this.searchForm.value })
      }
      this.getItems(searchObj)
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
        this.$Notice.info({
          title: '正在设置参数，请稍等...'
        })
      })
    },
    computedSocketMsg () {
      if (!this.$store.state.app.socketMsg) return
      return JSON.parse(this.$store.state.app.socketMsg)
    },
    modalSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          if (this.modalConfig.type === 'add') {
            try {
              const res = await addReceiver(this.formItem)
              this.addSuccess(res)
            } catch (err) {
              this.$Message.error('服务器错误！')
            }
          } else {
            try {
              const res = await editReceiver(this.formItem)
              this.editSuccess(res)
            } catch (err) {
              this.$Message.error('服务器错误！')
            }
          }
        }
      })
    },
    cancel () {
      this.$set(this.modalConfig, 'show', false)
    }
  },
  watch: {
    socketMsg (val) {
      if (val.result && val.result === 'succeed') {
        if (val.order === 'timer') {
          this.$Notice.success({
            title: '对时成功！'
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
      }
    }
  },
  mounted () {
    if (this.sceneList.length === 0) {
      this.getSceneList()
    }
    this.initBtn()
  }
}
</script>
