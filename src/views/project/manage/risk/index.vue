<template>
  <div class="app-container">
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
      <el-table-column prop="type" label="风险类别" min-width="40" align="center">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="搜索类别"
          />
        </template>
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
          <el-popover v-for="it in row.relations" :key="it" trigger="hover" placement="top">
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
      ownerSearch: '',
      search: '',
      riskList: [],
      currentPage: 1,
      length: 10
    }
  },
  computed: {
    tableData: function() {
      return this.riskList
        .filter(data => !this.search || data.type.toLowerCase().includes(this.search.toLowerCase()))
        .filter(data => !this.ownerSearch || data.employee.name.toLowerCase().includes(this.ownerSearch.toLowerCase()))
        .slice((this.currentPage - 1) * this.length, this.currentPage * this.length)
    },
    total: function() {
      return this.riskList
        .filter(data => !this.search || data.type.toLowerCase().includes(this.search.toLowerCase()))
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
    handleDelete(row) {
      this.$confirm('确定删除 ' + row.type + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // RiskAPI.(row.poid, row).then(response => {
        //   this.$message.success('归还成功!')
        // })
        this.getRiskList()
      })
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    }
  }
}

</script>
