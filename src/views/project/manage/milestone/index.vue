<template>
  <div>
    <div style="margin: 10px">项目里程碑
      <el-button
        v-if="this.$store.getters.manage_roles.includes(this.$store.getters.roles[0])"
        style="margin: 0 10px"
        type="primary"
        plain
        size="mini"
        @click="openAddDialog"
      >新增</el-button>
    </div>
    <el-table v-loading="tableLoading" border stripe :data="tableData" style="width: 100%">

      <!--<el-table-column-->
      <!--:prop="col.jsonKey"-->
      <!--:label="col.text"-->
      <!--:width="col.width?col.width:'auto'"-->
      <!--align="center"-->
      <!--/>-->

      <el-table-column prop="mid" sortable label="ID" min-width="20" align="center" />

      <el-table-column prop="desc" label="里程碑描述" min-width="30" align="center" />

      <el-table-column prop="time" width="150px" align="center" label="最后更新时间" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.time | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="project_id" label="项目ID" min-width="70" align="center" />

      <el-table-column
        v-if="this.$store.getters.manage_roles.includes(this.$store.getters.roles[0])"
        fixed="right"
        label="操作"
        width="100"
        min-width="30"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑里程碑" :visible.sync="dialogVisible" @close="onClosed">
      <el-form ref="form" :model="form" label-width="120px" label-position="left" size="medium">
        <el-form-item label="里程碑ID">
          <el-input v-model="form.mid" :disabled="true" />
        </el-form-item>
        <el-form-item label="里程碑描述">
          <el-input v-model="form.desc" />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="form.time" type="datetime" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item label="项目ID" >
          <el-input v-model="form.project_id"  disabled="true"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="onConfirmed">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchMilestone, addMilestone, editMilestone, delMilestone } from '@/api/project'
export default {
  name: 'Milestone',
  filters: {
    parseTime(time) {
      const values = (time || '').split('-')
      if (values.length >= 2) {
        const year = parseInt(values[0], 10)
        const mon = parseInt(values[1], 10)
        const day = parseInt(values[2], 10)

        return year + '年' + mon + '月' + day + '日'
      }
      /* istanbul ignore next */
      return null
    }
  },
  props: ['pid'],
  data() {
    return {
      tableData: [],
      tableLoading: false,
      dialogVisible: false,
      form: {}
    }
  },
  created() { this.getMilestones() },
  methods: {
    getMilestones() {
      this.tableLoading = true
      fetchMilestone(this.pid).then(response => {
        const milestones = response.responseMap.milestones
        this.tableData = milestones
        this.tableLoading = false
      })
    },
    handleEdit(row) {
      this.dialogVisible = true
      this.form = row
      this.form['type'] = 'edit'
    },
    handleDelete(row) {
      console.log(row)
      delMilestone(row.mid).then(response => {
        if (response.status === 200) {
          this.$message({ message: '删除成功', type: 'success' })
        } else {
          this.$message.error(response.message)
        }
        this.getMilestones()
      })
    },
    openAddDialog() {
      this.dialogVisible = true
      this.form = {}
      this.form['type'] = 'add'
    },
    onClosed() {
      this.form = {}
    },
    onConfirmed() {
      const param = {
        'time': this.form.time,
        'desc': this.form.desc
      }
      if (this.form['type'] === 'add') {
        addMilestone(this.pid, param).then(response => {
          if (response.status === 200) {
            this.$message({ message: '增加成功', type: 'success' })
          } else {
            this.$message.error(response.message)
          }
          this.getMilestones()
          this.dialogVisible = false
        })
      } else if (this.form['type'] === 'edit') {
        editMilestone(this.form.mid, param).then(response => {
          if (response.status === 200) {
            this.$message({ message: '编辑成功', type: 'success' })
          } else {
            this.$message.error(response.message)
          }
          this.getMilestones()
          this.dialogVisible = false
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
