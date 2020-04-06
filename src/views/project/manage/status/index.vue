<template>
  <div class="block">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            placement="top"
            :type="activity.type"
            size="large"
            :timestamp="activity.timestamp"
          >
            <el-card>
              <h4>{{ activity.content }}</h4>
              <p>{{ activity.employeeName }} 提交于 {{ activity.timestamp }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-col>
      <el-col :span="12">
        <el-card>
          <h4>你的角色为：{{ roles[0] }}</h4>
          <p>{{ whatTodo }}</p>
          <div>
            <p>暂时无可操作的内容</p>
            <p>等待Workflow前序完成</p>
          </div>
          <div>
            <p>项目审批</p>
            <el-button type="success">审批通过</el-button>
            <el-button type="danger">审批不通过</el-button>
          </div>
          <div>
            <p>项目配置</p>
            <el-button type="success">审批通过</el-button>
            <el-button type="danger">审批不通过</el-button>
          </div>
          <div>
            <p>指定项目EPG</p>
            <el-button type="success">审批通过</el-button>
            <el-button type="danger">审批不通过</el-button>
          </div>
          <div>
            <p>指定项目QA</p>
            <el-button type="success">审批通过</el-button>
            <el-button type="danger">审批不通过</el-button>
          </div>
          <div>
            <p>拉入项目成员</p>
            <el-button type="success">审批通过</el-button>
            <el-button type="danger">审批不通过</el-button>
          </div>
          <div>
            <p>为成员配置权限配置</p>
            <el-button type="success">启动配置</el-button>
          </div>
          <div>
            <p>初始化功能列表</p>
            <el-button type="success">审批通过</el-button>
            <el-button type="danger">审批不通过</el-button>
          </div>
          <div>
            <p>配置全部完成，可以启动项目</p>
            <el-button type="success">启动项目</el-button>
          </div>
          <div>
            <p>启动交付项目</p>
            <el-button type="success">审批通过</el-button>
            <el-button type="danger">审批不通过</el-button>
          </div>
          <div>
            <p>交付结束，准备归档</p>
            <el-button type="success">审批通过</el-button>
            <el-button type="danger">审批不通过</el-button>
          </div>
          <div>
            <p>交付结束，准备归档</p>
            <el-button type="success">审批通过</el-button>
            <el-button type="danger">审批不通过</el-button>
          </div>
          <div>
            <p>确认项目归档</p>
            <el-button type="success">审批通过</el-button>
            <el-button type="danger">审批不通过</el-button>
          </div>
          <!--        <p>{{ activity.employeeName }} 提交于 {{ activity.timestamp }}</p>-->
        </el-card>
        <div>
          <img src="@/assets/pivot_dribbble.gif" class="emptyGif">
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchProjectByPid } from '@/api/project'
import { fetchWorkflowTimeline } from '@/api/workflow'
import { generateWhatToDo } from '@/utils/workflow'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'Status',
  // eslint-disable-next-line vue/require-prop-types
  props: ['pid'],
  data() {
    return {

      projectData: '',
      activityTemplate: {
        'applying': {
          name: 'applying',
          content: '项目已开始审批',
          timestamp: '',
          size: 'large',
          type: 'primary'
        },
        'rejected': {
          name: 'rejected',
          content: '立项拒绝',
          timestamp: '',
          size: 'large',
          type: 'danger'
        },
        'approved': {
          name: 'approved',
          content: '项目审批已经通过、等待PM/QA/EPG配置与初始化',
          timestamp: '',
          size: 'large',
          type: 'success'
        },
        'started': {
          name: 'started',
          content: '配置与项目初始化完成、项目开始',
          timestamp: '',
          size: 'large',
          type: 'success'
        },
        'delivering': {
          name: 'delivering',
          content: '项目正在交付中',
          timestamp: '',
          size: 'large',
          type: 'primary'
        },
        'submitted': {
          name: 'delivering',
          content: '项目已经交付完成',
          timestamp: '',
          size: 'large',
          type: 'success'
        },
        'achieved': {
          name: 'achieved',
          content: '项目已经完成归档',
          timestamp: '',
          size: 'large',
          type: 'success'
        }
      },
      whatTodo: [],
      activities: []
    }
  },
  computed: {
    ...mapGetters([
      'eid',
      'roles'
    ])
  },
  created() {
    this.fetchProjectData()
  },
  methods: {
    async fetchProjectData() {
      this.projectData = (await fetchProjectByPid(this.pid)).responseMap.Project
      this.activities = await this.generateTimeline(this.projectData.workflow.wid)
      // console.log(this.projectData.workflow.flowbits)
      this.whatTodo = generateWhatToDo(this.projectData.workflow.flowbits, this.roles[0])
    },
    async generateTimeline(wid) {
      const ret = []
      const workflowtl = (await fetchWorkflowTimeline(wid)).responseMap.timelines
      console.log(workflowtl)
      for (const it of workflowtl) {
        const tmp = this.activityTemplate[it.operation]
        tmp.timestamp = parseTime(it.add_time)
        tmp.employeeName = it.employee.name
        ret.push(tmp)
      }
      console.log(ret)
      return ret
    }
  }
}
</script>

<style scoped>
  .emptyGif {
    width: 100%;
  }
</style>
