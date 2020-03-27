<template>
  <div class="dashboard-container">

    <panel-group :panel-data="panelData" />

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <ProjectTableDashboard :project-list="projectData" />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="margin-bottom:30px;">
        <RiskTableDashboard :risk-list="riskData" />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="margin-bottom:30px;">
        <RiskTableDashboard />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="margin-bottom:30px;">
        <RiskTableDashboard />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import ProjectTableDashboard from './components/ProjectTableDashboard'
import RiskTableDashboard from './components/RiskTableDashboard'

import { fetchDashboard } from '@/api/dashboard'
import { parseTime } from '@/utils/index'

export default {
  name: 'Dashboard',
  components: {
    RiskTableDashboard,
    ProjectTableDashboard,
    PanelGroup
  },
  data() {
    return {
      dashboardData: null,
      panelData: {
        projectCount: 0,
        riskCount: 0,
        defectCount: 0,
        manhourCount: 0
      },
      projectData: [],
      riskData: [

      ],
      defectData: [

      ],
      manhourData: [

      ]
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
        const { projects, risks, defects, manhours, proterties } = this.dashboardData
        let manhoursTotal = 0
        for (const it of manhours) {
          const endDate = new Date(parseTime(it.endtime))
          const startDate = new Date(parseTime(it.starttime))
          manhoursTotal += Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))
        }
        this.panelData = {
          projectCount: projects.length,
          riskCount: risks.length,
          defectCount: defects.length,
          manhourCount: manhoursTotal
        }
        this.projectData = projects
        for (let i = 0; i < 10; i++) {
          this.projectData.push(projects[0])
        }
        for (const it of this.projectData) {
          it.project.endtime = parseTime(it.project.endtime)
        }

      })
    }
  }
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
