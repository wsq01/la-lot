<template>
  <Card>
    <Row>
      <i-col :span="24">
        <Form :model="searchForm" inline :label-width="0">
          <FormItem>
            <Select v-model="searchForm.key" class="search-item">
              <template v-for="item in columns">
                <Option v-if="item.key && (item.key === 'userId' || item.key === 'roleId' || item.key === 'organizationId')" :value="item.key" :key="`search-${item.key}`">{{item.title}}</Option>
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
        <Page :total="total" show-sizer show-total show-elevator @on-change="handleChangePage" @on-page-size-change="handlePageSizeChange" style="margin: 10px 0 0"></Page>
      </i-col>
    </Row>
  </Card>
</template>

<script>
import { getUser, deleteUser } from '@/api/user'
import minxin from '@/assets/js/mixin'

export default {
  name: 'UserManager',
  mixins: [ minxin ],
  data () {
    return {
      columns: [
        {
          title: '用户ID',
          key: 'userId'
        },
        {
          title: '用户名',
          key: 'userName'
        },
        {
          title: '英文名',
          key: 'userNameEn'
        },
        {
          title: '角色ID',
          key: 'roleId'
        },
        {
          title: '角色名',
          key: 'roleName'
        },
        {
          title: '角色备注',
          key: 'roleRemark'
        },
        {
          title: '用户机构ID',
          key: 'userOrganizationId'
        },
        {
          title: '用户机构名',
          key: 'organizationName'
        },
        {
          title: '手机号',
          key: 'mobile'
        },
        {
          title: '邮箱',
          key: 'mail'
        },
        {
          title: '登录时间',
          key: 'loginTime'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '短信报警',
          key: 'messagePush'
        },
        {
          title: '微信报警',
          key: 'wechatPush'
        },
        {
          title: '操作',
          slot: 'action',
          width: 130,
          align: 'center'
        }
      ]
    }
  },
  methods: {
    async getItems (params) {
      const res = await getUser(params)
      this.getSuccess(res)
    },
    async deleteItem (row, index) {
      const res = await deleteUser(row.userId)
      this.deleteSuccess(res, index)
    },
    addItem () {
      this.$router.push({
        name: 'add-user'
      })
    },
    editItem (row, index) {
      this.$router.push({
        name: 'edit-user',
        params: row
      })
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
