<template>
    <Row type="flex" justify="center">
      <i-col span="6">
        <Form ref="formValidate" :model="formItem" :label-width="80" :rules="rules">
          <FormItem :label="formItemLabel[0]" prop="name">
            <Input v-model="formItem.name" />
          </FormItem>
          <FormItem :label="formItemLabel[1]" prop="type">
            <Input v-model="formItem.type" />
          </FormItem>
          <FormItem :label="formItemLabel[2]" prop="areaId">
            <Select v-model="formItem.areaId">
              <Option v-for="(item, index) in areaList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[3]">
            <Input v-model="formItem.remark" type="textarea"/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submit('formValidate')">提交</Button>
            <Button @click="cancel" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { addScene, editScene } from '@/api/data'
export default {
  name: 'EditScene',
  data () {
    return {
      formItemLabel: ['场景名称', '场景类型', '所属区域', '备注'],
      formItem: {},
      rules: {
        name: [
          { required: true, message: '场景名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '场景类型不能为空', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '区域不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      areaList: state => state.app.areaList
    })
  },
  methods: {
    ...mapActions(['getAreaList']),
    ...mapMutations([
      'closeTag'
    ]),
    cancel () {
      if (this.$route.name === 'edit-scene') {
        this.closeTag({
          name: 'edit-scene',
          params: this.$route.params
        })
      } else {
        this.closeTag({
          name: 'add-scene',
          params: this.$route.params
        })
      }
    },
    submit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.$route.name === 'add-scene') {
            addScene(this.formItem).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('添加成功！')
                this.cancel()
              } else {
                this.$Message.error(res.data.message)
              }
            })
          } else {
            editScene(this.formItem).then(res => {
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
    if (this.areaList.length === 0) {
      this.getAreaList()
    }
    this.formItem = this.$route.params
  }
}
</script>

<style lang="less" scoped>

</style>
