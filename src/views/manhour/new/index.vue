<template>
  <div class="app-container">
    <div class="headerspan">
      <span style="font-size:20px;padding-top:20px;display:inline-block;">上报工时</span>
      <el-divider />
    </div>
    <el-row>
      <el-col :span="16">
        <el-form
          ref="manhourForm"
          :model="manhourForm"
          :rules="rules"
          label-width="150px"
          onautocomplete="on"
          class="manhourForm"
          span="12"
        >

          <el-form-item label="项目名称" prop="project_pid">   
            <el-select v-model="manhourForm.project_pid" class="selector" filterable placeholder="请选择项目名称" @change="getCurrentFunctions">
              <el-option
                v-for="item in projects_doing"
                :key="item.pid"
                :label="item.name"
                :value="item.pid"
              />
            </el-select>
          </el-form-item>

        <el-form-item label="功能名称" prop="function_id">
            <el-select v-model="manhourForm.function_id" class="selector" filterable placeholder="请选择功能名称">
              <el-option
                v-for="item in functions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="活动名称" prop="activity_aid">
            <el-select v-model="manhourForm.activity_aid" class="selector" filterable placeholder="请选择活动名称">
              <el-option
                v-for="item in activities"
                :key="item.aid"
                :label="item.name"
                :value="item.aid"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="manhourForm.startTime"
              type="datetime"
              placeholder="选择时间"
            />
          </el-form-item>

          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="manhourForm.endTime"
              type="datetime"
              placeholder="选择时间"
            />
          </el-form-item>
         
          <el-form-item>
            <el-button :loading="loading" type="primary" @click="submitForm('manhourForm')">保存</el-button>
            <el-button @click="resetForm('manhourForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <div>
          <img src="@/assets/mondays.gif" class="emptyGif">
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as projectApi from '@/api/project'
import * as activityApi from '@/api/activity'
import * as manhourApi from '@/api/manhour'

export default {
  name: 'ManhourNew',
  data() {
    return {
      manhourForm: {
        project_pid: '',
        function_id: '',
        activity_aid: '',
        startTime: '',
        endTime: '',
      },

      rules: {
        project_pid: [
          { required: true, message: '请选择项目', trigger: 'change' },
        ],
        function_id: [
          { required: true, message: '请选择功能', trigger: 'change' }
        ],
        activity_aid: [
          { required: true, message: '请选择活动', trigger: 'change' }
        ],
        startTime: [
          { type: 'date', required: true, message: '需要填写开始时间', trigger: 'change' }
        ],
        endTime: [
          { type: 'date', required: true, message: '需要填写结束时间', trigger: 'change' }
        ],
      },

      projects_doing: [],
      functions: [],
      activities: [],
      loading: false,

      projectParams: {
        length: 20,
        page: 0,
        status: 'doing'
      },

      currentPid: ''
    }
  },
  created() {
    this.populateSelectorData()
  },
  methods: {
    populateSelectorData() {
      projectApi.fetchProjects(this.projectParams).then(response => {
        this.initProjects(response.responseMap.Project);
      })
      activityApi.getActivities().then(response => {
        this.initActivities(response.responseMap.activities);   
      })
    },
    initProjects(projects){
      this.projects_doing = []
      for (const key in projects) {
        const data = projects[key]
        const proj = {
          pid: data.pid,
          name: data.name,
        }
        this.projects_doing.push(proj)
      }
    },
    initActivities(a){
        this.activities = []
        for(const key in a){
            const ac = {
              aid: a[key].aid,
              name: a[key].def1 + " - " + a[key].def2
            }
            this.activities.push(ac)
        }
    },

    getCurrentFunctions(){
        this.currentPid = this.manhourForm.project_pid
        projectApi.fetchProjectByPid(this.currentPid).then(response => {
          this.initFunctions(response.responseMap.Project);   
      })
    },
    initFunctions(proj){
      this.functions = []
      var funcs = JSON.parse(proj.function)
      for(const key in funcs){
        const f = {
          id: key,
          name: funcs[key]
        }
        this.functions.push(f)
      }
    }
  ,

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          //todo: 这个接口还木有
          manhourApi.saveManhour(this.manhourForm).then(() => {
            // console.log(this.manhourForm)
            this.loading = false
          }).catch(() => {
            this.$message.error('新建项目网络错误或意外发生')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    width: 100%;
  }
  .headerspan{
    padding-left: 30px;
  }
  .manhourForm{
    width: 100%;
    position: relative;
    padding: 20px;
    .selector{
      width: 400px;
    }
  }
</style>

