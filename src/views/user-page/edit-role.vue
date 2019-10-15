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
            <Select v-model="formItem.areaId">
              <Option v-for="(item, index) in areaList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="formItemLabel[3]">
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
import { addRole, editRole } from '@/api/user'
export default {
  name: 'EditArea',
  data () {
    return {
      formItemLabel: ['场景名称', '场景类型', '所属区域', '备注'],
      formItem: {}
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
    submit () {
      if (this.$route.name === 'add-scene') {
        this.formItem.organizationId = this.$store.state.user.organizationId
        addRole(this.formItem).then(res => {
          if (res.data.code === 0) {
            this.cancel()
          }
        })
      } else {
        editRole(this.formItem).then(res => {
          if (res.data.code === 0) {
            this.cancel()
          }
        })
      }
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
