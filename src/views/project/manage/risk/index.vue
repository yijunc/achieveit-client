<template>
  <div class="app-container">
    <el-row class="new">
      <el-button
        size="small"
        type="primary"
        icon="el-icon-magic-stick"
        @click="handleNew"
      >新建项目风险
      </el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%;"
      :default-sort="{prop: 'grade', order: 'descending'}"
    >
      <el-table-column prop="id" sortable min-width="10" align="center">
        <template slot-scope="scope">
          {{ scope.row.rid }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="风险类别" min-width="60" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>风险策略：{{ scope.row.strategy }}</p>
            <p>风险影响：{{ scope.row.strategy }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag>{{ scope.row.type }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述" min-width="60" align="center">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column prop="grade" sortable label="紧急度" min-width="15" align="center">
        <template slot-scope="scope">
          <el-tag :type=" scope.row.grade | gradeTypeFilter ">
            {{ scope.row.grade }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="influence" label="提醒频率" min-width="15" align="center">
        <template slot-scope="scope">
          {{ scope.row.frequency }}
        </template>
      </el-table-column>
      <el-table-column prop="eids" label="拥有者" min-width="20" align="center">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="ownerSearch"
            size="mini"
            placeholder="搜索姓名"
          />
        </template>
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>ID: {{ scope.row.employee.eid }}</p>
            <p>Email: {{ scope.row.employee.email }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag>{{ scope.row.employee.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="eids" label="人员分配" min-width="50" align="center">
        <template slot-scope="{row}">
          <el-popover v-for="it in row.relations" :key="it.employeeProject.employee.eid" trigger="hover" placement="top">
            <p>ID: {{ it.employeeProject.employee.eid }}</p>
            <p>Email: {{ it.employeeProject.employee.email }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag type="info">{{ it.employeeProject.employee.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template slot-scope="{row}">
          <el-button
            size="small"
            type="primary"
            :disabled="eid!==row.employee.eid"
            @click="handleUpdate(row)"
          >更新
          </el-button>
          <el-button
            size="small"
            type="danger"
            :disabled="eid!==row.employee.eid"
            @click="handleDelete(row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      small
      background
      :current-page="currentPage"
      :page-size="length"
      layout="total, jumper, prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    />

    <el-dialog width="50%" :title="dialogTitle" :visible.sync="dialogVisible" @open="handleOpen" @close="handleClose">
      <RiskDialog
        ref="dialog"
        :op="dialogOp"
        :on-dialog-submit="handleClose"
        :on-dialog-cancel="handleClose"
        :members="memberList"
        :risk="riskForDialog"
        :pid="pid"
      />
    </el-dialog>

  </div>
</template>

<script>
import * as RiskAPI from '@/api/risk'
import * as ProjectAPI from '@/api/project'
import { mapGetters } from 'vuex'
import RiskDialog from '@/views/project/manage/risk/components/RiskDialog'

export default {
  name: 'Risk',
  components: { RiskDialog },
  filters: {
    gradeTypeFilter(grade) {
      const gradeMap = {
        'p0': 'danger',
        'p1': 'warning',
        'p2': 'primary'
      }
      return gradeMap[grade]
    }
  },
  props: { pid: String },
  data: function() {
    return {
      ownerSearch: '',
      riskList: [],
      memberList: [],
      currentPage: 1,
      length: 15,
      dialogTitle: '',
      dialogVisible: false,
      dialogOp: '',
      riskForDialog: null
    }
  },
  computed: {
    tableData: function() {
      return this.riskList
        .filter(data => !this.ownerSearch || data.employee.name.toLowerCase().includes(this.ownerSearch.toLowerCase()))
        .slice((this.currentPage - 1) * this.length, this.currentPage * this.length)
    },
    total: function() {
      return this.riskList
        .filter(data => !this.ownerSearch || data.employee.name.toLowerCase().includes(this.ownerSearch.toLowerCase()))
        .filter(data => !this.search || data.property_desc.toLowerCase().includes(this.search.toLowerCase()))
        .length
    },
    ...mapGetters([
      'eid'
    ])
  },
  mounted() {
    this.getRiskList()
    this.getProjectInfo()
  },
  methods: {
    getRiskList() {
      RiskAPI.getRiskByPid(this.pid).then(response => {
        this.riskList = response.responseMap.risks
        // console.log(this.riskList)
      })
    },
    getProjectInfo() {
      ProjectAPI.fetchProjectByPid(this.pid).then(response => {
        this.memberList = response.responseMap.EmployeeProjects
        // console.log(this.memberList)
      })
    },
    handleNew() {
      this.dialogTitle = '新建项目风险'
      this.dialogOp = 'new'
      this.dialogVisible = true
      this.riskForDialog = null
    },
    handleUpdate(row) {
      // console.log(row)
      this.dialogTitle = '编辑项目风险'
      this.dialogOp = 'update'
      this.dialogVisible = true
      this.riskForDialog = row
    },
    handleDelete(row) {
      this.$confirm('确定删除 ' + row.type + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        RiskAPI.deleteRisk(this.eid, row.rid).then(response => {
          this.$message.success('删除成功!')
        })
        this.getRiskList()
      })
    },
    handleOpen() {
      this.$refs.dialog.populateDialog()
    },
    handleClose() {
      this.dialogVisible = false
      this.getRiskList()
      this.riskForDialog = null
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    }
  }
}

</script>

<style>
  .new{
    margin-bottom: 10px;
    width: 300px;
  }
</style>
