<template>
    <Row type="flex" justify="center">
      <i-col span="6">
        <Form :model="formItem" :label-width="80">
          <FormItem :label="formItemLabel[0]">
            <Input v-model="formItem.name" />
          </FormItem>
          <FormItem :label="formItemLabel[1]">
            <Input v-model="formItem.type" />
          </FormItem>
          <FormItem :label="formItemLabel[2]">
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
import { mapMutations } from 'vuex'
import { addRelresource, editRelresource } from '@/api/user'
export default {
  name: 'EditArea',
  data () {
    return {
      formItemLabel: ['资源ID', '角色ID', '备注'],
      formItem: {}
    }
  },
  computed: {
    // ...mapState({
    //   areaList: state => state.app.areaList
    // })
  },
  methods: {
    // ...mapActions(['getAreaList']),
    ...mapMutations([
      'closeTag'
    ]),
    cancel () {
      if (this.$route.name === 'edit-relresource') {
        this.closeTag({
          name: 'edit-relresource',
          params: this.$route.params
        })
      } else {
        this.closeTag({
          name: 'add-relresource',
          params: this.$route.params
        })
      }
    },
    submit () {
      if (this.$route.name === 'add-relresource') {
        this.formItem.organizationId = this.$store.state.user.organizationId
        addRelresource(this.formItem).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('添加成功！')
            this.cancel()
          } else {
            this.$Message.warning(res.data.message)
          }
        })
      } else {
        editRelresource(this.formItem).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('修改成功！')
            this.cancel()
          } else {
            this.$Message.warning(res.data.message)
          }
        })
      }
    }
  },
  mounted () {
    // if (this.areaList.length === 0) {
    //   this.getAreaList()
    // }
    this.formItem = this.$route.params
  }
}
</script>

<style lang="less" scoped>

</style>
