<template>
    <Row type="flex" justify="center">
      <i-col span="6">
        <Form ref="formValidate" :model="formItem" :label-width="80" :rules="rules">
          <FormItem :label="formItemLabel[0]" prop="name">
            <Input v-model="formItem.name" />
          </FormItem>
          <FormItem :label="formItemLabel[1]" prop="level">
            <Input v-model="formItem.level" />
          </FormItem>
          <FormItem :label="formItemLabel[2]">
            <Input v-model="formItem.parent" />
          </FormItem>
          <FormItem :label="formItemLabel[3]" prop="code">
            <Input v-model="formItem.code" />
          </FormItem>
          <FormItem :label="formItemLabel[4]">
            <Input v-model="formItem.remark" type="textarea"/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submit('formValidate')">提交</Button>
            <Button @click="cancel" style="margin-left: 5px">取消</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
</template>

<script>
import { mapMutations } from 'vuex'
import { addDeviceType, editDeviceType } from '@/api/data'
export default {
  name: 'EditDevice',
  data () {
    return {
      formItemLabel: ['类型名称', '类型等级', '类型父级', '类型编码', '备注'],
      formItem: {},
      rules: {
        name: [
          { required: true, message: '设备类型名称不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '设备类型级别不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '设备类型编码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    cancel () {
      if (this.$route.name === 'edit-type') {
        this.closeTag({
          name: 'edit-type',
          params: this.$route.params
        })
      } else {
        this.closeTag({
          name: 'add-type',
          params: this.$route.params
        })
      }
    },
    submit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.$route.name === 'add-type') {
            this.formItem.organizationId = this.$store.state.user.organizationId
            addDeviceType(this.formItem).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('添加成功！')
                this.cancel()
              } else {
                this.$Message.error(res.data.message)
              }
            })
          } else {
            editDeviceType(this.formItem).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('修改成功！')
                this.cancel()
              } else {
                this.$Message.error(res.data.message)
              }
            })
          }
        }
      })
    }
  },
  mounted () {
    this.formItem = this.$route.params
  }
}
</script>

<style lang="less" scoped>

</style>
