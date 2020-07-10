<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key">
              <template v-for="item in columns">
                <Option v-if="item.key && item.key === 'id'" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
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
              <Button @click="addItem" type="primary" icon="md-trash">新增</Button>
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
              <Button v-if="bItem === 'EDIT'" type="primary" size="small" @click="editItem(row, index)">编辑</Button>
            </div>
          </template>
        </Table>
        <Page :total="total" :page-size="total" show-total @on-change="handleChangePage" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>

    <Modal v-model="modalConfig.show" :width="400" :title="modalConfig.title">
      <Row type="flex" justify="center">
        <i-col span="24">
          <Form ref="formValidate" :model="formItem" :label-width="80" :rules="rules">
            <FormItem :label="formItemLabel[0]" prop="name">
              <Input v-model="formItem.name" />
            </FormItem>
            <FormItem :label="formItemLabel[1]" prop="level">
              <Input type="number" :number="true" v-model="formItem.level" />
            </FormItem>
            <FormItem :label="formItemLabel[2]" prop="parent">
              <Input v-model="formItem.parent" />
            </FormItem>
            <FormItem :label="formItemLabel[3]" prop="code">
              <Input v-model="formItem.code" />
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
import { getDeviceTypeList, deleteDeviceType, getDeviceTypeById, addDeviceType, editDeviceType } from '@/api/data'
import { getBtn } from '@/api/user'
import minxin from '@/assets/js/mixin'

export default {
  name: 'DeviceType',
  mixins: [ minxin ],
  data () {
    return {
      columns: [
        {
          title: '设备类型ID',
          key: 'id',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '类型名称',
          key: 'name',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '类型编号',
          key: 'code',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '类型级别',
          key: 'level',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '备注',
          minWidth: 40,
          key: 'remark'
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
      formItemLabel: ['类型名称', '类型等级', '类型父级', '类型编码', '备注'],
      formItem: {},
      rules: {
        name: [
          { required: true, message: '类型名称不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '类型等级不能为空', type: 'number', trigger: 'blur' }
        ],
        parent: [
          { required: true, message: '父设备类型不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '类型编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getItems (params) {
      const res = await getDeviceTypeList(params)
      this.getSuccess(res)
      this.total = res.data.data.list.length
    },
    async deleteItem (row, index) {
      const res = await deleteDeviceType(row.id)
      this.deleteSuccess(res, index)
    },
    async handleSearch () {
      const res = await getDeviceTypeById(this.searchForm.value)
      if (res.data.code === 0) {
        this.tableData = []
        this.tableData.push(res.data.data)
        this.total = res.data.seqnum
      }
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
    modalSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          if (this.modalConfig.type === 'add') {
            try {
              const res = await addDeviceType(this.formItem)
              this.addSuccess(res)
            } catch (err) {
              this.$Message.error('服务器错误！')
            }
          } else {
            try {
              const res = await editDeviceType(this.formItem)
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
  mounted () {
    this.initBtn()
  }
}
</script>
