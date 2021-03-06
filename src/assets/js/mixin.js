export default {
  data () {
    return {
      size: 10,
      loading: true,
      total: 0,
      tableData: [],
      searchForm: {},
      selection: []
    }
  },
  methods: {
    addItem () {
      this.$refs.formValidate.resetFields()
      this.formItem = {}
      this.modalConfig = {
        show: !this.modalConfig.show,
        title: '添加',
        type: 'add'
      }
    },
    editItem (row, index) {
      this.formItem = row
      this.modalConfig = {
        show: !this.modalConfig.show,
        title: '编辑',
        type: 'edit'
      }
    },
    // 分页
    handleChangePage (e) {
      const obj = { size: this.size, index: e }
      if (this.searchForm.value) {
        Object.assign(obj, this.searchForm)
      }
      this.getItems(obj)
    },
    // 搜索清除
    handleClear (e) {
      if (e.target.value === '') this.getItems({ size: this.size })
    },
    // 多选
    handleSelectTableItem (selection, row) {
      this.selection = selection
    },
    // 设置默认的搜索key
    setDefaultSearchKey () {
      this.$set(this.searchForm, 'key', this.columns[0].key ? this.columns[0].key : this.columns[1].key)
    },
    // 分页改变事件
    handlePageSizeChange (e) {
      this.size = e
      const searchObj = { size: this.size }
      if (this.searchForm.value) {
        Object.assign(searchObj, this.searchForm)
      }
      this.getItems(searchObj)
    },
    // 搜索
    handleSearch () {
      const obj = {}
      obj[this.searchForm.key] = this.searchForm.value
      this.getItems(obj)
    },
    getSuccess (res) {
      this.loading = false
      if (res.data.code === 0) {
        this.tableData = res.data.data.list
        this.total = res.data.data.total
      } else {
        this.$Message.error(res.data.message)
      }
    },
    deleteSuccess (res, index) {
      if (res.data.code === 0) {
        this.$Message.success('删除成功！')
        this.tableData.splice(index, 1)
        this.total = this.total - 1
      } else {
        this.$Message.error(res.data.message)
      }
    },
    deleteBatchSuccess (res) {
      if (res.data.code === 0) {
        this.selection.forEach((item, index) => {
          this.tableData.forEach((sItem, sIndex) => {
            if (sItem.id === item.id) {
              this.tableData.splice(sIndex, 1)
              this.total = this.total - 1
            }
          })
        })
        this.$Message.success('删除成功！')
      } else {
        this.$Message.error(res.data.message)
      }
    },
    addSuccess (res) {
      if (res.data.code === 0) {
        this.$set(this.modalConfig, 'show', false)
        this.getItems()
        this.$Message.success('添加成功！')
      } else {
        this.$Message.error(res.data.message)
      }
    },
    editSuccess (res) {
      if (res.data.code === 0) {
        this.$set(this.modalConfig, 'show', false)
        this.$Message.success('修改成功！')
      } else {
        this.$Message.error(res.data.message)
      }
    }
  },
  mounted () {
    this.getItems()
    this.setDefaultSearchKey()
  }
}
