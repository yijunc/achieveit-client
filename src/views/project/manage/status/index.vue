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
          <div v-if="whatTodo.length === 0">
            <p>暂时无可操作的内容</p>
            <p>等待Workflow前序完成</p>
          </div>
          <div>
            <p>项目审批</p>
            <el-button type="success" @click="triggerWorkflow('sup_agree')">审批通过</el-button>
            <el-button type="danger" @click="triggerWorkflow('sup_disagree')">审批不通过</el-button>
          </div>
          <div>
            <p>项目配置</p>
            <el-form ref="projectForm" :model="configureForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="Git仓库" prop="git_repo">
                <el-input v-model="configureForm.git_repo" />
              </el-form-item>
              <el-form-item label="系统根目录" prop="server_root">
                <el-input v-model="configureForm.server_root" />
              </el-form-item>
              <el-form-item label="电子邮件列表" prop="mail_list">
                <el-input v-model="configureForm.mail_list" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('config')">配置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <p>指定项目EPG</p>
            <el-form ref="epgForm" :model="epgForm" label-position="left" label-width="100">
              <el-form-item label="项目EPG" prop="epg_eid">
                <el-select v-model="epgForm.epgs" multiple class="selector" filterable placeholder="请选择EPG" style="width: 400px">
                  <el-option
                    v-for="item in members"
                    :key="item.eid"
                    :label="item.name"
                    :value="item.eid"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('epg')">指定</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <p>指定项目QA</p>
            <el-form ref="qaForm" :model="qaForm" label-position="left" label-width="100">
              <el-form-item label="项目QA" prop="qa_eid">
                <el-select v-model="qaForm.qas" multiple class="selector" filterable placeholder="请选择QA" style="width: 400px">
                  <el-option
                    v-for="item in members"
                    :key="item.eid"
                    :label="item.name"
                    :value="item.eid"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('qa')">指定</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <p>拉入项目成员</p>
            <el-form ref="peopleForm" :model="peopleForm" label-position="left" label-width="100">
              <el-form-item label="项目RD Leader" prop="rd_leader_eid">
                <el-select v-model="peopleForm.rd_leader" class="selector" filterable placeholder="请选择RD Leader" style="width: 400px">
                  <el-option
                    v-for="item in members"
                    :key="item.eid"
                    :label="item.name"
                    :value="item.eid"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="项目RD" prop="rd_eid">
                <el-select v-model="peopleForm.rd" multiple class="selector" filterable placeholder="请选择RD" style="width: 400px">
                  <el-option
                    v-for="item in members"
                    :key="item.eid"
                    :label="item.name"
                    :value="item.eid"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="项目QA" prop="qa_eid">
                <el-select v-model="peopleForm.qas" class="selector" multiple filterable placeholder="请选择QA" style="width: 400px">
                  <el-option
                    v-for="item in members"
                    :key="item.eid"
                    :label="item.name"
                    :value="item.eid"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_member')">指定</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <p>成员配置权限配置</p>
            <el-button type="success" @click="triggerWorkflow('pm_authority')">启动配置</el-button>
          </div>
          <div>
            <p>初始化功能列表</p>
            <el-button type="success" @click="triggerWorkflow('pm_function')">配置功能列表</el-button>
          </div>
          <div>
            <p>配置全部完成，可以启动项目</p>
            <el-button type="success" @click="triggerWorkflow('pm_start')">启动项目</el-button>
          </div>
          <div>
            <p>启动交付项目</p>
            <el-button type="success" @click="triggerWorkflow('pm_submitting')">交付项目</el-button>
          </div>
          <div>
            <p>交付结束</p>
            <el-button type="success" @click="triggerWorkflow('pm_submitted')">完成交付</el-button>
          </div>
          <div>
            <p>填写归档文件</p>
            <el-button type="success">审批通过</el-button>
            <el-button type="danger">审批不通过</el-button>
          </div>
          <div>
            <p>确认项目归档</p>
            <el-button type="success" @click="triggerWorkflow('configurer_archive_done')">审批通过</el-button>
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
import { getByTitle } from '@/api/user'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'Status',
  // eslint-disable-next-line vue/require-prop-types
  props: ['pid'],
  data() {
    return {
      peopleForm: {
        members: {
          rd_leader: '',
          rd: [],
          qa: []
        }
      },
      qaForm: {
        qas: []
      },
      epgForm: {
        epgs: []
      },
      configureForm: {
        git_repo: '',
        server_root: '',
        mail_list: ''
      },
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
          content: '配置与项目初始化完成、项目已经开始',
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
          content: '项目已经交付完成，可以进行归档',
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
      activities: [],
      members: []
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
    this.populateMembers()
  },
  methods: {
    populateMembers() {
      getByTitle('member').then(response => {
        this.members = response.responseMap.employees
      })
    },
    async fetchProjectData() {
      this.projectData = (await fetchProjectByPid(this.pid)).responseMap.Project
      this.activities = await this.generateTimeline(this.projectData.workflow.wid)
      this.whatTodo = generateWhatToDo(this.projectData.workflow.flowbits, this.roles[0])
    },
    async generateTimeline(wid) {
      const ret = []
      const workflowtl = (await fetchWorkflowTimeline(wid)).responseMap.timelines
      for (const it of workflowtl) {
        const tmp = this.activityTemplate[it.operation]
        tmp.timestamp = parseTime(it.add_time)
        tmp.employeeName = it.employee.name
        ret.push(tmp)
      }
      console.log(ret)
      return ret
    },
    triggerWorkflow(op) {
      console.log(op)
      let data = {}
      switch (op) {
        case 'sup_agree':
          data = {}
          break
        case 'sup_disagree':
          data = {}
          break
        case 'config':
          data = this.configureForm
          break
        case 'epg':
          data = this.epgForm
          break
        default:
          this.$message.error('裂开了')
      }
      data.todo = op
      console.log(data)
    }
  }
}
</script>

<style scoped>
  .emptyGif {
    width: 100%;
  }
</style>
