<template>
  <div class="app-container">
    <div class="filter-wrap mb-2">
      <el-row style="width: 100%">
        <el-col :xs="24" :sm="24" :md="12" :lg="3">
          <el-select v-model="status" placeholder="到期状态">
            <el-option label="全部" value="" />
            <el-option
              key="0"
              label="未到期"
              value="0"
            />
            <el-option
              key="1"
              label="已到期"
              value="1"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="7" style="margin-left: 10px">
          <el-input
            v-model.trim="search"
            placeholder="搜索设备名称"
            clearable
          />
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%;"
      :default-sort="{prop: 'grade', order: 'descending'}"
      @row-click="openProjectDetails"
    >
      <el-table-column prop="id" sortable min-width="10" align="center">
        <template slot-scope="scope">
          {{ scope.row.rid }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="风险类别" min-width="40" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="desc" label="描述" min-width="50" align="center">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column prop="grade" sortable label="紧急度" min-width="15" align="center">
        <template slot-scope="scope">
          <el-tag type="warning">
            {{ scope.row.grade }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="strategy" label="风险策略" min-width="15" align="center">
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.strategy }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="influence" label="风险影响" min-width="15" align="center">
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.influence }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="eids" label="拥有者" min-width='15' align="center">
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
      <el-table-column prop="eids" label="人员分配" min-width='50' align="center">
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.influence }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template slot-scope="{row}">
          <el-button
            size="small"
            :disabled="row.expired || eid!=row.employee_id"
            @click="handleUpdate(row)"
          >更新
          </el-button>
          <el-button
            size="small"
            type="primary"
            :disabled="row.expired || eid!=row.employee_id"
            @click="handleReturn(row)"
          >归还
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

  </div>
</template>

<script>
import * as RiskAPI from '@/api/risk'
import { mapGetters } from 'vuex'
const dayjs = require('dayjs')

export default {
  name: 'Risk',
  filters: {
    intactFilter(is_intact) {
      const intactMap = {
        true: '完好',
        false: '有损坏'
      }
      return intactMap[is_intact]
    },
    intactTypeFilter(is_intact) {
      const intactMap = {
        true: 'success',
        false: 'danger'
      }
      return intactMap[is_intact]
    },
    expiredFilter(expired) {
      const expiredMap = {
        true: '已到期',
        false: '未到期'
      }
      return expiredMap[expired]
    },
    expiredTypeFilter(expired) {
      const expiredMap = {
        true: 'danger',
        false: 'success'
      }
      return expiredMap[expired]
    }
  },
  props: { pid: String },
  data: function() {
    return {
      riskList: [],
      status: '',
      search: '',
      currentPage: 1,
      length: 10
    }
  },
  computed: {
    tableData: function() {
      return this.riskList
        .filter(data => !this.status || (data.expired && this.status === '1') || (!data.expired && this.status === '0'))
        .filter(data => !this.search || data.property_desc.toLowerCase().includes(this.search.toLowerCase()))
        .slice((this.currentPage - 1) * this.length, this.currentPage * this.length)
    },
    total: function() {
      return this.riskList
        .filter(data => !this.status || (data.expired && this.status === '1') || (!data.expired && this.status === '0'))
        .filter(data => !this.search || data.property_desc.toLowerCase().includes(this.search.toLowerCase()))
        .length
    },
    ...mapGetters([
      'eid'
    ])
  },
  mounted() {
    this.getRiskList()
  },
  methods: {
    getRiskList() {
      RiskAPI.getRiskByPid(this.pid).then(response => {
        this.riskList = response.responseMap.risks
        console.log(this.riskList)
      })
    },
    handleUpdate(row) {
      this.$router.push({
        name: 'property-edit',
        params: {
          poid: row.poid,
          row: row
        }
      })
    },
    handleReturn(row) {
      this.$confirm('确定归还' + row.property_desc + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        row.expire_time = dayjs()
        row.expired = true
        propertyApi.updateOccupy(row.poid, row).then(response => {
          this.$message.success('归还成功!')
        })
      }).catch(() => {
      })
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    }
  }
}

</script>
