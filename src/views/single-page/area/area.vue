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
              <FormItem v-if="bItem === 'DELETEBATCH'">
                <Poptip confirm title="确定要删除吗？" transfer @on-ok="handleDeleteBatch">
                  <Button type="primary" icon="md-trash">批量删除</Button>
                </Poptip>
              </FormItem>
              <FormItem v-if="bItem === 'ADD'">
                <Button @click="addItem" type="primary" icon="md-add">新增</Button>
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
            <FormItem :label="formItemLabel[1]" prop="type">
              <Input v-model="formItem.type" />
            </FormItem>
            <FormItem :label="formItemLabel[2]" prop="cityId">
              <Select v-model="formItem.cityId">
                <Option v-for="(item, index) in cityList" :key="index" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="formItemLabel[3]">
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
import { getArea, deleteArea, deleteAreaList, addArea, editArea } from '@/api/data'
import { getBtn } from '@/api/user'
import minxin from '@/assets/js/mixin'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Area',
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
          title: '区域ID',
          key: 'id',
          align: 'center'
        },
        {
          title: '区域名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '机构ID',
          key: 'organizationId',
          align: 'center'
        },
        {
          title: '城市ID',
          key: 'cityId',
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
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
      formItemLabel: ['区域名称', '区域类型', '所属城市', '备注'],
      formItem: {},
      rules: {
        name: [
          { required: true, message: '区域名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '区域类型不能为空', trigger: 'blur' }
        ],
        cityId: [
          { required: true, message: '城市不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      cityList: state => state.app.cityList
    })
  },
  methods: {
    ...mapActions([
      'getCityList'
    ]),
    async getItems (params) {
      const res = await getArea(params)
      this.getSuccess(res)
    },
    async deleteItem (row, index) {
      const res = await deleteArea(row.id)
      this.deleteSuccess(res, index)
    },
    // 批量删除
    async handleDeleteBatch () {
      const res = await deleteAreaList(this.selection)
      this.deleteBatchSuccess(res)
    },
    async initBtn () {
      const uri = '/' + this.$route.name
      const menuList = this.$store.state.user.userMenu
      const menu = menuList.find(item => item.uri === uri)
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
              const res = await addArea(this.formItem)
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
              const res = await editArea(this.formItem)
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
    if (this.cityList.length === 0) {
      this.getCityList()
    }
    this.initBtn()
  }
}
</script>
