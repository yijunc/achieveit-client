<template>
  <div style="height: calc(100vh - 104px);overflow: scroll">
    <el-container>
      <el-header height="auto">
        <div>
          <h2>{{ project.name }}</h2>
          <!--<div>描述：{{ project.technique }}</div>-->
        </div>
      </el-header>
      <!--<el-divider />-->
      <el-main>
        <!--<div>基本信息</div>-->
        <!--<div-->
        <!--v-for="(name,key) in projectInfoMap"-->
        <!--:key="key"-->
        <!--v-loading="infoLoading"-->
        <!--&gt;-->
        <!--<h5>{{ name }} : {{ project[key] }}</h5>-->
        <!--</div>-->
        <el-collapse class="basic-info" value="1">
          <el-collapse-item>
            <template slot="title">
              基本信息 <i
                style="padding-left: 10px"
                class="header-icon el-icon-edit"
                @click="openDialog"
              >编辑</i>
            </template>
            <div
              v-for="(name,key) in projectInfoMap"
              :key="key"
              v-bind="project"
              v-loading="infoLoading"
              style="font-size: 14px;line-height: 2"
            >
              <div v-if="key == 'starttime' || key == 'endtime'">
                {{ name }} : {{ convertDate(project[key]) }}
              </div>
              <div v-else>{{ name }} : {{ project[key] }}</div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-row :gutter="24">
          <el-col :xs="16" :sm="16" :lg="12">
            <div class="chart-wrapper">
              <SubFuncCard cardname="客户" type="company" :content="project.client" />
            </div>
          </el-col>
          <el-col
            v-for="(value,key) in cardMap"
            :key="key"
            :xs="16"
            :sm="16"
            :lg="12"
          >
            <div class="chart-wrapper">
              <SubFuncCard :cardname="value.name" type="member" :content="project.workflow[key]" />
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog title="修改基本信息" :visible.sync="dialogFormVisible">
      <EditInfo ref="edit_info" :pj-info="pjInfo" :on-dialog-cancel="onDialogCancel" :on-dialog-confirm="onDialogConfirm" />
    </el-dialog>
  </div>
</template>
<script>
import { fetchProjectByPid } from '@/api/project'
import SubFuncCard from './components/SubFuncCard'
import EditInfoDialog from './components/EditInfoDialog'

const dayjs = require('dayjs')

export default {
  name: 'Overview',
  components: { SubFuncCard, EditInfo: EditInfoDialog },
  props: {
    pid: { type: String }
  },
  data() {
    return {
      infoLoading: true,
      project: {
        'name': '',
        'client': null,
        'workflow': {
          'pm': null,
          'sup': null,
          'configurer': null,
          'epgleader': null,
          'qamanager': null
        }
      },
      projectInfoMap: {
        'pid': '项目ID',
        'technique': '技术',
        'starttime': '项目开始时间',
        'endtime': '项目结束时间',
        'domain': '领域'
      },
      cardMap: {
        'pm': {
          name: '产品经理'
        },
        'sup': {
          name: '上级'
        },
        'configurer': {
          name: '配置员'
        },
        'epgleader': {
          name: 'EPG Leader'
        },
        'qamanager': {
          name: 'QA Leader'
        }
      },
      dialogFormVisible: false,
      pjInfo: {
        'pid': '',
        'name': '',
        'technique': '',
        'starttime': '',
        'endtime': '',
        'domain': ''
      }
    }
  },
  created() {
    this.fetchProject()
  },
  methods: {
    fetchProject() {
      this.infoLoading = true
      fetchProjectByPid(this.pid).then(response => {
        this.project = response.responseMap.Project
        // 编辑基本信息子组建赋值
        Object.keys(this.pjInfo).forEach(key => { this.pjInfo[key] = this.project[key] })
        // console.log(this.pjInfo)
        this.infoLoading = false
      })
    },
    convertDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    openDialog() {
      this.dialogFormVisible = true
      if (this.$refs.edit_info !== undefined) { this.$refs.edit_info.update() }
    },
    onDialogCancel() {
      this.dialogFormVisible = false
    },
    onDialogConfirm() {
      this.dialogFormVisible = false
      this.fetchProject()
    }
  }
}
</script>

<style scoped>
  .el-header {
    /*background-color: #B3C0D1;*/
    color: #333;
    /*min-height: 100px;*/
    padding: 0 15px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
  }

  .el-main {
    /*background-color: #E9EEF3;*/
    /*color: #333;*/
    padding: 0 20px 0 20px;
  }

  .basic-info {
    margin: 10px;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
