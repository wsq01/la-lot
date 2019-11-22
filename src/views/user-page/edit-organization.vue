<template>
    <Row type="flex" justify="center">
      <i-col span="6">
        <Form :model="formItem" :label-width="80">
          <FormItem :label="formItemLabel[0]">
            <Input v-model="formItem.name" />
          </FormItem>
          <FormItem :label="formItemLabel[1]">
            <Input v-model="formItem.badCount" />
          </FormItem>
          <FormItem :label="formItemLabel[2]">
            <Select v-model="formItem.code">
              <Option v-for="(item, index) in organizationList" :key="index" :value="item.code">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[3]">
            <Input v-model="formItem.telephone" />
          </FormItem>
          <FormItem :label="formItemLabel[4]">
            <Input v-model="formItem.address" />
          </FormItem>
          <FormItem :label="formItemLabel[5]">
            <Input v-model="formItem.remark" type="textarea"/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submit">提交</Button>
            <Button @click="cancel" style="margin-left: 5px">取消</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { addOrganization } from '@/api/user'
export default {
  name: 'EditArea',
  data () {
    return {
      formItemLabel: ['机构名称', '机构编码', '上级机构', '机构电话', '机构地址', '备注'],
      formItem: {}
    }
  },
  computed: {
    ...mapState({
      organizationList: state => state.app.organizationList
    })
  },
  methods: {
    ...mapActions(['getOrganizationList']),
    ...mapMutations([
      'closeTag'
    ]),
    cancel () {
      if (this.$route.name === 'edit-organization') {
        this.closeTag({
          name: 'edit-organization',
          params: this.$route.params
        })
      } else {
        this.closeTag({
          name: 'add-organization',
          params: this.$route.params
        })
      }
    },
    submit () {
      if (this.$route.name === 'add-organization') {
        this.formItem.organizationId = this.$store.state.user.organizationId
      }
      addOrganization(this.formItem).then(res => {
        if (res.data.code === 0) {
          this.$Message.success('添加成功！')
          this.cancel()
        } else {
          this.$Message.warning(res.data.message)
        }
      })
    }
  },
  mounted () {
    if (this.organizationList.length === 0) {
      this.getOrganizationList()
    }
    this.formItem = this.$route.params
  }
}
</script>

<style lang="less" scoped>

</style>
