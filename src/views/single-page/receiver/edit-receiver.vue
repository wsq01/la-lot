<template>
    <Row type="flex" justify="center">
      <i-col span="6">
        <Form :model="formItem" :label-width="80">
          <FormItem :label="formItemLabel[0]">
            <Input v-model="formItem.name" />
          </FormItem>
          <FormItem :label="formItemLabel[1]">
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
import { addReceiver } from '@/api/data'
export default {
  name: 'EditArea',
  data () {
    return {
      formItemLabel: ['接收器名称', '接收器编号', '场景', '类型', '备注'],
      formItem: {}
    }
  },
  computed: {
    ...mapState({
      sceneList: state => state.app.sceneList
    })
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    ...mapActions(['getSceneList']),
    cancel () {
      if (this.$route.name === 'edit-receiver') {
        this.closeTag({
          name: 'edit-receiver',
          params: this.$route.params
        })
      } else {
        this.closeTag({
          name: 'add-receiver',
          params: this.$route.params
        })
      }
    },
    submit () {
      if (this.$route.name === 'add-receiver') {
        this.formItem.organizationId = this.$store.state.user.organizationId
      }
      addReceiver(this.formItem).then(res => {
        if (res.data.code === 0) {
          this.cancel()
        }
      })
    }
  },
  mounted () {
    if (this.sceneList.length === 0) {
      this.getSceneList()
    }
    this.formItem = this.$route.params
  }
}
</script>

<style lang="less" scoped>

</style>
