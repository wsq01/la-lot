<template>
    <Row type="flex" justify="center">
      <i-col span="6">
        <Form :model="formItem" :label-width="80">
          <FormItem :label="formItemLabel[0]">
            <Input v-model="formItem.name" />
          </FormItem>
          <FormItem :label="formItemLabel[1]">
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
              action="//39.105.79.197:8002/api/tb/excel">
              <div style="padding: 20px 0">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p>批量上传</p>
              </div>
          </Upload>
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
import { addDevice, editDevice } from '@/api/data'
export default {
  name: 'EditDevice',
  data () {
    return {
      formItemLabel: ['设备名称', '设备编号', '业务ID', '类型', '备注'],
      formItem: {}
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    cancel () {
      if (this.$route.name === 'edit-device') {
        this.closeTag({
          name: 'edit-device',
          params: this.$route.params
        })
      } else {
        this.closeTag({
          name: 'add-device',
          params: this.$route.params
        })
      }
    },
    submit () {
      if (this.$route.name === 'add-device') {
        this.formItem.organizationId = this.$store.state.user.organizationId
        addDevice(this.formItem).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('添加成功！')
            this.cancel()
          } else {
            this.$Message.error(res.data.message)
          }
        })
      } else {
        editDevice(this.formItem).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('修改成功！')
            this.cancel()
          } else {
            this.$Message.error(res.data.message)
          }
        })
      }
    }
  },
  mounted () {
    this.formItem = this.$route.params
  }
}
</script>

<style lang="less" scoped>
</style>
