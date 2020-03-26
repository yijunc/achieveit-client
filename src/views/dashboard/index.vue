<template>
  <div class="dashboard-container">

    <panel-group :panel-data="panelData" />

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span: 24}" style="padding-right:8px;margin-bottom:30px;">
        <ProjectTableDashboard :project-list="projectData" />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <ProjectTableDashboard />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <ProjectTableDashboard />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import ProjectTableDashboard from './components/ProjectTableDashboard'

import { fetchDashboard } from '@/api/dashboard'
import { parseTime } from '@/utils/index';

export default {
  name: 'Dashboard',
  components: {
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
      projectData: [
        {
          project_id: "1",
          project: {
            name: "千亿大项目",
            endtime: parseTime("2020-03-28T15:19:37.000+0800"),
            "technique": "没有技术含量的",
            domain: "01语言",
            "function": "{0:\"能用就行\"}",
            "client_id": 1,
            "workflow_id": 1,
            "client": null,
            "workflow": null
          }
        },
        {
          project_id: "2",
          project: {
            name: "千亿大项目",
            endtime: parseTime("2020-03-29T15:19:37.000+0800"),
          }
        }
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
        const { projects, risks, defects, manhours } = this.dashboardData
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
