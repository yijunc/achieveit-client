<template>
  <div class="dashboard-container">

    <panel-group :panel-data="panelData" />

<!--    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
<!--      <line-chart :chart-data="lineChartData" />-->
<!--    </el-row>-->

<!--    <el-row :gutter="32">-->
<!--      <el-col :xs="24" :sm="24" :lg="8">-->
<!--        <div class="chart-wrapper">-->
<!--          <raddar-chart />-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :xs="24" :sm="24" :lg="8">-->
<!--        <div class="chart-wrapper">-->
<!--          <pie-chart />-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :xs="24" :sm="24" :lg="8">-->
<!--        <div class="chart-wrapper">-->
<!--          <bar-chart />-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->

<!--    <el-row :gutter="8">-->
<!--      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">-->
<!--        <transaction-table />-->
<!--      </el-col>-->
<!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
<!--        <todo-list />-->
<!--      </el-col>-->
<!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
<!--        <box-card />-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
// import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

import { fetchDashboard } from '@/api/dashboard'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup
  //   LineChart,
  //   RaddarChart,
  //   PieChart,
  //   BarChart,
  //   TransactionTable,
  //   TodoList,
  //   BoxCard
  },
  data() {
    return {
      dashboardData: null,
      panelData: {
        projectCount: 0,
        riskCount: 0,
        defectCount: 0,
        manhourCount: 0
      }
    }
  },
  computed: {

  },
  created() {
    this.populateDashboardData()
  },
  activated() {
    // keep-alive下如果要刷新，这里写函数，否则就空着
    this.populateDashboardData()
  },
  methods: {
    populateDashboardData() {
      fetchDashboard().then(response => {
        this.dashboardData = response.responseMap
        const { projects, risks, defects, manhours } = this.dashboardData
        function genDate(it) {
          return new Date(it.split('.')[0].replace('T', ' ').replace(/\-/g, '/'))
        }
        let manhoursTotal = 0
        for (const it of manhours) {
          const endDate = genDate(it.endtime)
          const startDate = genDate(it.starttime)
          manhoursTotal += Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))
        }
        this.panelData = {
          projectCount: projects.length,
          riskCount: risks.length,
          defectCount: defects.length,
          manhourCount: manhoursTotal
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
  .dashboard-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
