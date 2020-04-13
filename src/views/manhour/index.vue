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
          <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="上报日期查询"
            @keyup.enter.native="handleFilter"
          />
          <el-button icon="el-icon-search" type="primary" size="small" style="margin-left: 10px" @click="handleFilter">
            搜索
          </el-button>
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
      <el-table-column prop="mid" label="ID" width="70" align="center" sortable />
      <el-table-column prop="projectName" label="项目名称" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="function_desc" label="功能名称" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.function_desc }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="activityName" label="活动名称" show-overflow-tooltip>
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

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" content="三天之内的工时单方可编辑" placement="top">
            <el-button
              size="small"
              :disabled="!row.canEdit"
              type="primary"
              @click="handleEdit(row)"
            >编辑
            </el-button>
          </el-tooltip>
          <el-button
            size="small"
            type="danger"
            :disabled="row.status !== 'unfilled'"
            @click="handleDelete(row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next"
      :page-count="pageCount"
      @current-change="handleCurrentChange"
    />

  </div>
</template>

<script>
import * as manhourApi from '@/api/manhour'
const dayjs = require('dayjs')

export default {
  name: 'ManhourList',
  data() {
    return {
      manhourStatus: manhourApi.manhourStatus(),
      manhourList: [],
      queryParams: {
        page: 0,
        length: 10,
        date: null
      },
      statusSearch: '',
      selectedDate: null, // 日期filter使用
      pageCount: 1
    }
  },
  computed: {
    tableData: function() {
      return this.manhourList
        .filter(data => !this.statusSearch || data.status === this.statusSearch)
    },
    total: function() {
      return this.manhourList
        .filter(data => !this.statusSearch || data.status === this.statusSearch).length
    }
  },
  mounted() {
    this.handleFilter()
  },
  methods: {
    initManhourData(manhours) {
      this.manhourList = []
      for (const key in manhours) {
        const data = manhours[key]
        const m = {
          eid: data.employeeProject.employee_id,
          mid: data.mid,
          fid: data.fid,
          function_desc: data.function_desc,
          pid: data.employeeProject.project_id,
          projectName: data.employeeProject.project.name,
          activity_id: data.activity_id,
          activityName: data.activity.def1 + ' - ' + data.activity.def2,
          starttime: dayjs(data.starttime).format('YYYY-MM-DD HH:mm:ss'),
          endtime: dayjs(data.endtime).format('YYYY-MM-DD HH:mm:ss'),
          date: data.date,
          status: data.status,
          canEdit: data.status === 'unfilled' && dayjs().diff(data.date, 'day') <= 3
        }
        this.manhourList.push(m)
      }
    },

    handleEdit(row) {
      this.$router.push({
        name: 'edit-manhour',
        params: {
          mid: row.mid,
          row: row
        }
      })
    },

    handleDelete(row) {
      this.$confirm('此操作将永久删除该工时, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.deleteManhour(row.eid, row.mid)
      }).catch(() => {
      })
    },
    deleteManhour(eid, mid) {
      manhourApi.deleteManhour(eid, mid).then((response) => {
        console.log(response)
        this.$message.success('删除成功!')
        this.handleFilter()
      })
    },

    handleFilter() {
      // 若选择了日期filter，则转变一下日期格式
      if (this.selectedDate) {
        this.queryParams.date = dayjs(this.selectedDate).format('YYYY-MM-DD')
        this.selectedDate = null
      }
      manhourApi.getManhour(this.queryParams).then(response => {
        this.pageCount = response.responseMap.page_length
        this.initManhourData(response.responseMap.Manhour)
      })
    },
    handleCurrentChange(currentPage) {
      this.queryParams.page = currentPage - 1
      this.handleFilter()
    }
  }
}

</script>
