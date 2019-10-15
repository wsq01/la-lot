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
          <FormItem :label="formItemLabel[2]" prop="cityId">
            <Select v-model="formItem.cityId">
              <Option v-for="(item, index) in cityList" :key="index" :value="item.id">{{item.name}}</Option>
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
import { addArea, editArea } from '@/api/data'
export default {
  name: 'EditArea',
  data () {
    return {
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
          { required: true, message: '城市不能为空', trigger: 'blur' }
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
    ...mapMutations([
      'closeTag'
    ]),
    ...mapActions([
      'getCityList'
    ]),
    cancel () {
      if (this.$route.name === 'edit-area') {
        this.closeTag({
          name: 'edit-area',
          params: this.$route.params
        })
      } else {
        this.closeTag({
          name: 'add-area',
          params: this.$route.params
        })
      }
    },
    submit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.$route.name === 'add-area') {
            this.formItem.organizationId = this.$store.state.user.organizationId
            addArea(this.formItem).then(res => {
              if (res.data.code === 0) {
                this.cancel()
              } else {
                this.$Message.error(res.data.message)
              }
            })
          } else {
            editArea(this.formItem).then(res => {
              if (res.data.code === 0) {
                this.cancel()
              }
            })
          }
        }
      })
    }
  },
  mounted () {
    if (this.cityList.length === 0) {
      this.getCityList()
    }
    console.log(this.$route)
    this.formItem = this.$route.params
  }
}
</script>

<style lang="less" scoped>

</style>
