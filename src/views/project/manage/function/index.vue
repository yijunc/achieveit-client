<template>
  <div class="app-container">
    <div style="margin: 10px">功能展示
      <el-button
        v-if="this.$store.getters.manage_roles.includes(this.$store.getters.roles[0])"
        style="margin: 0 10px"
        type="primary"
        plain
        size="mini"
        @click="addFirstLevel"
      >添加一级功能</el-button>
      <el-button
        v-if="this.$store.getters.manage_roles.includes(this.$store.getters.roles[0])"
        :loading="updateLoading"
        style="margin: 0 10px"
        type="primary"
        plain
        size="mini"
        @click="updateFunc"
      >保存修改</el-button>
    </div>
    <el-tree
      v-loading="treeLoading"
      :data="data"
      default-expand-all
      :props="defaultProps"
      :expand-on-click-node="false"
      node-key="id"
      draggable
      @node-click="handleNodeClick"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span
          style="padding-left: 20px"
        >
          <el-button
            :disabled="!isManage"
            v-if="node.parent==undefined || node.parent.parent==undefined"
            icon="el-icon-document-add"
            type="text"
            size="mini"
            @click="() => append(data)"
          />
          <el-button
            :disabled="!isManage"
            icon="el-icon-edit"
            type="text"
            size="mini"
            @click="() => edit(node, data)"
          />
          <el-button
            :disabled="!isManage"
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="() => remove(node, data)"
          />
        </span>
      </span>
    </el-tree>
    <el-divider />
    <upload-excel-component
      v-if="this.$store.getters.manage_roles.includes(this.$store.getters.roles[0])"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { fetchProjectByPid, updateProject } from '@/api/project'

export default {
  name: 'Function',
  components: { UploadExcelComponent },
  props: { pid: String },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      data: [],
      testData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 11,
          label: '二级 1-1'
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 21,
          label: '二级 2-1'
        }, {
          id: 22,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3'
      }, {
        id: 4,
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
      },
      updateLoading: false,
      treeLoading: false,
      isManage: this.$store.getters.manage_roles.includes(this.$store.getters.roles[0])
    }
  },
  created() {
    // this.generateTreeData()
    this.treeLoading = true
    fetchProjectByPid(this.pid).then(response => {
      const project = response.responseMap.Project
      this.generateTreeData(JSON.parse(project.function))
      this.treeLoading = false
    })
  },
  methods: {
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
      this.treeLoading = true
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
        // console.log(key)
        var level1 = parseInt(key.substr(0, 3))
        var level2 = parseInt(key.substr(3, 3))

        if (level1 > treeData.length) {
          treeData.push({ id: new Date().getTime() + Math.random() * 1000, label: sorted_map[key] })
        } else {
          if (!treeData[level1 - 1].children) {
            this.$set(treeData[level1 - 1], 'children', [])
          }
          treeData[level1 - 1].children.push({ id: new Date().getTime() + Math.random() * 1000, label: sorted_map[key] })

          // if (level2 > treeData[level1 - 1].children.length) {
          //   treeData[level1 - 1].children.push({ id: new Date().getTime(), label: sorted_map[key] })
          // } else {
          //   treeData[level1 - 1].children[level2 - 1] = { label: sorted_map[key] }
          // }
        }
      }
      console.log(treeData)
      this.data = treeData
      this.treeLoading = false
    },
    append(data) {
      this.inputDialog('请输入功能名称', (value) => {
        const newChild = { id: new Date().getTime(), label: value, children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      })
    },
    edit(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      this.inputDialog('请输入要修改的功能名称', (value) => {
        children[index].label = value
      })
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    inputDialog(promptText, onConfirmed, onCanceled) {
      this.$prompt(promptText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        onConfirmed(value)
      }).catch(() => {
        onCanceled()
      })
    },
    updateFunc() {
      this.updateLoading = true

      const func = {}
      for (let i = 0; i < this.data.length; i++) {
        for (let j = -1; j < (this.data[i].children !== undefined ? this.data[i].children.length : 0); j++) {
          if (j === -1) {
            const index = this.getIndexWithLeadingZeros(i + 1) + '000'
            func[index] = this.data[i].label
          } else {
            const index = this.getIndexWithLeadingZeros(i + 1) + this.getIndexWithLeadingZeros(j + 1, 3)
            func[index] = this.data[i].children[j].label
          }
        }
      }
      console.log(func)

      updateProject(this.pid, { 'function': func }).then(response => {
        if (response.status === 200) {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        } else {
          this.$message.error('上传失败')
          console.log(response)
        }
        this.updateLoading = false
      }).catch(error => {
        console.log(error)
        this.$message.error('上传失败')
        this.updateLoading = false
      })
    },
    getIndexWithLeadingZeros(num) {
      var pad = '000'
      var result = (pad + num.toString()).slice(-pad.length)
      return result
    },
    addFirstLevel() {
      this.inputDialog('请输入功能名称', (value) => {
        const newChild = { id: new Date().getTime(), label: value, children: [] }
        this.data.push(newChild)
      })
    }
  }
}
</script>

<style scoped>

</style>
