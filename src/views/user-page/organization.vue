<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key">
              <template v-for="item in columns">
                <Option v-if="item.key && (item.key === 'id' || item.key === 'name' || item.key === 'code')" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
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
            <Button @click="addItem" type="primary" icon="md-add">新增</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
    <Row>
      <i-col :span="24">
        <Table :loading="loading" stripe border :columns="columns" :data="tableData" @on-select-change="handleSelectTableItem">
          <template slot-scope="{row, index}" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="editItem(row, index)">编辑</Button>
            <Poptip confirm title="确定要删除吗？" transfer @on-ok="deleteItem(row, index)">
              <Button type="error" size="small">删除</Button>
            </Poptip>
          </template>
        </Table>
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>
    <Modal v-model="modalConfig.show" :width="400" :title="modalConfig.title">
      <Row type="flex" justify="center">
        <i-col span="24">
          <Form ref="formValidate" :model="formItem" :label-width="80" :rules="rules">
            <FormItem :label="formItemLabel[0]" prop="name">
              <Input v-model="formItem.name" />
            </FormItem>
            <FormItem :label="formItemLabel[1]">
              <Select v-model="formItem.code" clearable>
                <Option v-for="(item, index) in organizationList" :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="formItemLabel[2]">
              <Input v-model="formItem.telephone" />
            </FormItem>
            <FormItem :label="formItemLabel[3]">
              <Input v-model="formItem.address" />
            </FormItem>
            <FormItem :label="formItemLabel[4]">
              <Input v-model="formItem.remark" type="textarea"/>
            </FormItem>
          </Form>
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="cancel" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="modalSubmit('formValidate')">提交</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
import { getOrganization, deleteOrganization, addOrganization, editOrganization } from '@/api/user'
import minxin from '@/assets/js/mixin'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Organization',
  mixins: [ minxin ],
  data () {
    return {
      columns: [
        {
          title: '机构ID',
          key: 'id',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '机构名称',
          key: 'name',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '机构编码',
          key: 'badCount',
          minWidth: 60,
          align: 'center'
        },
        {
          title: '机构地址',
          key: 'address',
          minWidth: 60,
          align: 'center'
        },
        {
          title: '上级机构编码',
          key: 'code',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '机构电话',
          key: 'telephone',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 120,
          align: 'center'
        }
      ],
      modalConfig: {
        show: false,
        title: '',
        type: ''
      },
      formItemLabel: ['机构名称', '机构编码', '机构电话', '机构地址', '备注'],
      formItem: {},
      rules: {
        name: [
          { required: true, message: '机构名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      organizationList: state => state.app.organizationList
    })
  },
  methods: {
    ...mapActions(['getOrganizationList']),
    async getItems (params) {
      const res = await getOrganization(params)
      this.getSuccess(res)
    },
    async deleteItem (row, index) {
      const res = await deleteOrganization(row.id)
      this.deleteSuccess(res, index)
    },
    modalSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          if (this.modalConfig.type === 'add') {
            try {
              const res = await addOrganization(this.formItem)
              this.addSuccess(res)
            } catch (err) {
              this.$Message.error('服务器错误！')
            }
          } else {
            try {
              const res = await editOrganization(this.formItem)
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
    if (this.organizationList.length === 0) {
      this.getOrganizationList()
    }
  }
}
</script>

<style lang="less" scoped>
.search-item {
  display: inline-block;
  width: 200px;
}
</style>
