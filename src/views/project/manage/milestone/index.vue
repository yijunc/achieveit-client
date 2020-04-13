<template>
  <div>
    <div style="margin: 10px">人员管理
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

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="onConfirmed">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchMilestone } from '@/api/project'
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
      dialogVisible: false
    }
  },
  created() { this.getMilestones() },
  methods: {
    getMilestones() {
      this.tableLoading = true
      console.log(this.pid)
      fetchMilestone(this.pid).then(response => {
        const milestones = response.responseMap.milestones
        console.log(milestones)
        this.tableData = milestones
        this.tableLoading = false
      })
    },
    handleEdit(row) {
      console.log(row)
    },
    handleDelete(row) {
      console.log(row)
    },
    openAddDialog() {
      this.dialogVisible = true
    },
    onClosed() {
    },
    onConfirmed() {
    }
  }
}
</script>

<style scoped>

</style>
