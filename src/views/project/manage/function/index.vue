<template>
  <div class="app-container">
    <el-tree
      :data="data"
      default-expand-all
      :props="defaultProps"
      @node-click="handleNodeClick"
    />

    <el-divider />
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'Function',
  components: { UploadExcelComponent },
  props: { pid: String },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [
          { label: '三级 2-2-1' }
        ]
      }, {
        label: '一级 4'
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultData: {
        '001000': '1',
        '001001': '1-1',
        '001002': '1-2',
        '001003': '1-3',
        '002000': '2',
        '002001': '2-1',
        '002002': '2-2',
        '003000': '3',
        '003001': '3-1',
        '003002': '3-2',
        '003003': '3-3',
        '003004': '3-4'
      }
    }
  },
  created() {
    // this.generateTreeData()
  }, methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      console.log(this.tableHeader)
      console.log(this.tableData)
      const xlsxData = {}
      for (var i in this.tableData) {
        var line = this.tableData[i]
        xlsxData[line.level] = line.func
      }
      console.log(xlsxData)
      this.generateTreeData(xlsxData)
    },
    generateTreeData(data) {
      var sorted_map = data
      const treeData = []
      for (var key in sorted_map) {
        var level1 = parseInt(key.substr(0, 3))
        var level2 = parseInt(key.substr(3, 3))
        if (treeData.length < level1) {
          treeData.push({ label: sorted_map[key], children: [] })
        } else {
          if (treeData[level1 - 1].children.length < level2) {
            treeData[level1 - 1].children.push({ label: sorted_map[key] })
          } else {
            treeData[level1 - 1].children[level2 - 1] = { label: sorted_map[key] }
          }
        }
      }
      console.log(treeData)
      this.data = treeData
    }
  }
}
</script>

<style scoped>

</style>
