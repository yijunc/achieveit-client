<template>
  <div class="app-container">
    <div class="filter-wrap mb-2">
      <el-row style="width: 100%">
        <el-col :xs="24" :sm="24" :md="12" :lg="3">
          <el-select v-model="statusSearch" placeholder="工时状态">
            <el-option label="全部" value="" />
            <el-option
              v-for="s in Object.keys(manhourStatus)"
              :key="manhourStatus[s].value"
              :label="manhourStatus[s].text"
              :value="manhourStatus[s].value"
            />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="7" style="margin-left: 10px">
          <el-input
            v-model.trim="projectSearch"
            placeholder="搜索项目名称"
            clearable
          />
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :default-sort="{prop: 'mid', order: 'descending'}"
    >
      <el-table-column prop="mid" label="ID" width="60" align="center" sortable />
      <el-table-column prop="employeeName" label="员工姓名" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.employeeName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fid" label="功能ID" width="70" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.fid }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="activityName" label="活动名称" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.activityName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="starttime" label="开始时间" align="center" sortable show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.starttime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endtime" label="结束时间" align="center" sortable show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.endtime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="上报时间" align="center" sortable show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag
            :type="manhourStatus[row.status].type"
            disable-transitions
            effect="plain"
          >{{ manhourStatus[row.status].text }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="审批" width="200" align="center">
        <template slot-scope="{row}">
          <el-button
            size="small"
            :disabled="row.status !== 'unfilled'"
            type="primary"
            @click="handlePass(row)"
          >通过
          </el-button>
          <el-button
            size="small"
            type="danger"
            :disabled="row.status !== 'unfilled'"
            @click="handleReject(row)"
          >不通过
          </el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="打回" align="center">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" content="三天以内的工时才可以打回" placement="top" style="margin: 3px">
            <el-button
              size="small"
              :disabled="!row.canSendBack"
              type="warning"
              @click="handleSendBack(row)"
            >打回
            </el-button>
          </el-tooltip>
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
  </div>
</template>

<script>
import * as manhourApi from '@/api/manhour'
import { mapGetters } from 'vuex'
const dayjs = require('dayjs')

export default {
  name: 'ManhourList',
  data() {
    return {
      manhourStatus: manhourApi.manhourStatus(),
      manhourList: [],
      queryParams: {
        fid: '',
        activity_id: '',
        starttime: '',
        endtime: '',
        status: ''
      },
      statusSearch: '',
      projectSearch: '',
      length: 10,
      currentPage: 1
    }
  },
  computed: {
    tableData: function() {
      return this.manhourList
        .filter(data => !this.projectSearch || data.projectName.toLowerCase().includes(this.projectSearch.toLowerCase()))
        .filter(data => !this.statusSearch || data.status === this.statusSearch)
        .slice((this.currentPage - 1) * this.length, this.currentPage * this.length)
    },
    total: function() {
      return this.manhourList
        .filter(data => !this.projectSearch || data.projectName.toLowerCase().includes(this.projectSearch.toLowerCase()))
        .filter(data => !this.statusSearch || data.status === this.statusSearch).length
    },
    ...mapGetters([
      'eid'
    ])
  },
  mounted() {
    this.getManhourList()
  },
  methods: {
    getManhourList() {
      manhourApi.getSubManhour(this.eid).then(response => {
        this.initManhourList(response.responseMap.activities)
      })
    },
    initManhourList(manhours) {
      this.manhourList = []
      for (const key in manhours) {
        const data = manhours[key]
        const m = {
          mid: data.mid,
          fid: data.fid,
          employeeName: data.employeeProject.employee.name,
          function_desc: data.function_desc,
          pid: data.employeeProject.project_id,
          projectName: data.employeeProject.project.name,
          aid: data.activity_id,
          activityName: data.activity.def1 + ' - ' + data.activity.def2,
          starttime: dayjs(data.starttime).format('YYYY-MM-DD HH:mm:ss'),
          endtime: dayjs(data.endtime).format('YYYY-MM-DD HH:mm:ss'),
          date: data.date,
          status: data.status,
          canSendBack: data.status !== 'unfilled' && dayjs().diff(data.date, 'day') <= 3
        }
        this.manhourList.push(m)
      }
    },
    handlePass(row) {
      this.$confirm('确定通过该工时信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.queryParams = {
          fid: row.fid,
          activity_id: row.aid,
          starttime: row.starttime,
          endtime: row.endtime,
          status: 'checked'
        }
        this.editManhour(this.eid, row.mid, this.queryParams)
      }).catch(() => {
      })
    },
    handleReject(row) {
      this.$confirm('确定不通过该工时信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.queryParams = {
          fid: row.fid,
          activity_id: row.aid,
          starttime: row.starttime,
          endtime: row.endtime,
          status: 'unchecked'
        }
        this.editManhour(this.eid, row.mid, this.queryParams)
      }).catch(() => {
      })
    },
    handleSendBack(row) {
      this.$confirm('此操作需要员工重新填写该工时, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.queryParams = {
          fid: row.fid,
          activity_id: row.aid,
          starttime: row.starttime,
          endtime: row.endtime,
          status: 'unfilled'
        }
        this.editManhour(this.eid, row.mid, this.queryParams)
      }).catch(() => {
      })
    },

    editManhour(eid, mid, queryParams) {
      manhourApi.updateManhour(eid, mid, queryParams).then((response) => {
        console.log(response)
        this.$message.success('修改成功!')
        this.getManhourList()
      })
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    }
  }
}

</script>
