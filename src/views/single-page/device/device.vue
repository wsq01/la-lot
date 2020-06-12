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
            <Button @click="handleSearch" type="primary" icon="md-search">搜索</Button>
          </FormItem>
          <span v-for="(bItem, bIndex) in btnList" :key="bIndex">
            <FormItem v-if="bItem === 'ADD'">
              <Button @click="addItem('device')" type="primary" icon="md-add">新增</Button>
            </FormItem>
            <FormItem v-if="bItem === 'DELETEBATCH'">
              <Poptip confirm title="确定要删除吗？" transfer @on-ok="handleDeleteBatch">
                <Button type="primary" icon="md-trash">批量删除</Button>
              </Poptip>
            </FormItem>
          </span>
        </Form>
      </i-col>
    </Row>
    <Row>
      <i-col :span="24">
        <Table :loading="loading" stripe border :columns="columns" :data="tableData" @on-selection-change="handleSelectTableItem">
          <template slot-scope="{row, index}" slot="action">
            <div v-for="(bItem, bIndex) in btnList" :key="bIndex" style="display: inline-block;margin-right: 5px">
              <Poptip v-if="bItem === 'DELETE'" confirm title="确定要删除吗？" transfer @on-ok="deleteItem(row, index)">
                <Button type="error" size="small">删除</Button>
              </Poptip>
              <Button v-if="bItem === 'EDIT'" type="primary" size="small" @click="editItem(row, index, 'device')">编辑</Button>
            </div>
          </template>
        </Table>
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" @on-page-size-change="handlePageSizeChange" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>
    <Modal v-model="modalConfig.show" :width="400" :title="modalConfig.title">
      <Row type="flex" justify="center">
        <i-col span="24">
          <Form ref="formValidate" :model="formItem" :label-width="80" :rules="rules">
            <FormItem :label="formItemLabel[0]" prop="name">
              <Input v-model="formItem.name" />
            </FormItem>
            <FormItem :label="formItemLabel[1]" prop="deviceNum">
              <Input v-model="formItem.deviceNum" />
            </FormItem>
            <FormItem :label="formItemLabel[2]">
              <Input v-model="formItem.businessId" />
            </FormItem>
            <FormItem :label="formItemLabel[3]">
              <Input v-model="formItem.type" />
            </FormItem>
            <FormItem :label="formItemLabel[4]">
              <Input v-model="formItem.remark" type="textarea"/>
            </FormItem>
            <FormItem>
              <Upload
                multiple
                type="drag"
                :on-success="uploadSuccess"
                action="//39.105.79.197:8002/api/tb/device/import">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>批量上传</p>
                </div>
              </Upload>
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
import { getDevice, deleteDevice, deleteDeviceList, addDevice, editDevice } from '@/api/data'
import { getBtn } from '@/api/user'
import minxin from '@/assets/js/mixin'

export default {
  name: 'Device',
  mixins: [ minxin ],
  data () {
    return {
      columns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '设备ID',
          key: 'id',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '设备名称',
          key: 'name',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '设备编号',
          key: 'deviceNum',
          sortable: true,
          minWidth: 100,
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          minWidth: 60,
          align: 'center'
        },
        {
          title: '设备类型',
          key: 'deviceType',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 120,
          align: 'center'
        }
      ],
      btnList: [],
      modalConfig: {
        show: false,
        title: '',
        type: ''
      },
      formItemLabel: ['设备名称', '设备编号', '业务ID', '类型', '备注'],
      formItem: {},
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        deviceNum: [
          { required: true, message: '编号不能为空', trigger: 'blur' },
          { type: 'string', min: 12, max: 12, message: '设备编号为12位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getItems (params) {
      const res = await getDevice(params)
      this.getSuccess(res)
    },
    async deleteItem (row, index) {
      const res = await deleteDevice(row.id)
      this.deleteSuccess(res, index)
    },
    async handleDeleteBatch () {
      const res = await deleteDeviceList(this.selection)
      this.deleteBatchSuccess(res)
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
    handleChangePage (e) {
      const obj = {}
      if (this.searchForm.key === 'id') {
        obj['deviceId'] = this.searchForm.value
      } else {
        obj[this.searchForm.key] = this.searchForm.value
      }
      Object.assign(obj, { size: this.size, index: e })
      this.getItems(obj)
    },
    handleSearch () {
      const obj = {}
      if (this.searchForm.key === 'id') {
        obj['deviceId'] = this.searchForm.value
      } else {
        obj[this.searchForm.key] = this.searchForm.value
      }
      this.getItems(obj)
    },
    uploadSuccess (res, file, fileList) {
      if (res.code === 0) {
        this.$Message.success(res.message)
      } else {
        this.$Notice.error({
          title: res.message
        })
      }
    },
    modalSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          if (this.modalConfig.type === 'add') {
            try {
              const res = await addDevice(this.formItem)
              if (res.data.code === 0) {
                this.$set(this.modalConfig, 'show', false)
                this.getItems()
                this.$Message.success('添加成功！')
              } else {
                this.$Message.error(res.data.message)
              }
            } catch (err) {
              this.$Message.error('服务器错误！')
            }
          } else {
            try {
              const res = await editDevice(this.formItem)
              if (res.data.code === 0) {
                this.$set(this.modalConfig, 'show', false)
                this.$Message.success('修改成功！')
              } else {
                this.$Message.error(res.data.message)
              }
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
  mounted () {
    this.initBtn()
  }
}
</script>
