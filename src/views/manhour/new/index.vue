<template>
  <div class="app-container">
    <div class="headerspan">
      <span style="font-size:20px;padding-top:20px;display:inline-block;">上报工时</span>
      <span style="font-size:10px;padding-top:10px;">测试中，请用Kiki账号</span>
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

          <el-form-item label="项目名称" prop="pid">   
            <el-select v-model="manhourForm.pid" class="selector" placeholder="请选择项目名称" @change="handleCurrentProject" :disabled="isEditting">
              <el-option
                v-for="item in projects_doing"
                :key="item.pid"
                :label="item.name"
                :value="item.pid"
              />
            </el-select>
          </el-form-item>

        <el-form-item label="功能名称" prop="fid">
            <el-select v-model="manhourForm.fid" class="selector" placeholder="请选择功能名称">
              <el-option
                v-for="item in functions"
                :key="item.fid"
                :label="item.name"
                :value="item.fid"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="活动名称" prop="aid">
            <el-select v-model="manhourForm.aid" class="selector" placeholder="请选择活动名称">
              <el-option
                v-for="item in activities"
                :key="item.aid"
                :label="item.name"
                :value="item.aid"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="开始时间" prop="starttime">
            <el-date-picker
              v-model="manhourForm.starttime"
              type="datetime"
              placeholder="选择时间"
            />
          </el-form-item>

          <el-form-item label="结束时间" prop="endtime">
            <el-date-picker
              v-model="manhourForm.endtime"
              type="datetime"
              placeholder="选择时间"
            />
          </el-form-item>
         
         <el-form-item v-if="!isEditting && !hasSup">
            <el-alert title="您在当前项目中没有上级，无法提交工时单！" type="error"></el-alert>
          </el-form-item>
          <el-form-item v-if="hasSup">
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
        mid: '',
        pid: '',
        aid: '',
        fid: '',
        starttime: '',
        endtime: '',
      },

      rules: {
        pid: [
          { required: true, message: '请选择项目', trigger: 'change' },
        ],
        fid: [
          { required: true, message: '请选择功能', trigger: 'change' }
        ],
        aid: [
          { required: true, message: '请选择活动', trigger: 'change' }
        ],
        starttime: [
          { type: 'date', required: true, message: '需要填写开始时间', trigger: 'change' }
        ],
        endtime: [
          { type: 'date', required: true, message: '需要填写结束时间', trigger: 'change' }
        ],
      },

      projects_doing: [],
      functions: [],
      activities: [],
      loading: false,
      eid: '10',  // 为方便测试用一个member
      hasSup: true,  // 在选中项目中有无上级
      isEditting: false,

      projectParams: {
        length: 10,
        page: 0,
        status: 'doing'
      },
    }
  },
  created() {
    this.populateSelectorData()
    this.isEditting = this.$route.params.mid ? true:false
  },
   mounted() {
    if(this.isEditting){
      this.initManhour()
      this.handleCurrentProject()
    }
  },
  methods: {
    populateSelectorData() {
      if(!this.isEditting){
        projectApi.fetchProjects(this.projectParams).then(response => {
          console.log(response.responseMap)
          this.initProjects(response.responseMap.Project);
        })
      }
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
    // 设置当前选中项目的功能，并判断此人在该项目中有无上级
    handleCurrentProject(){
        projectApi.fetchProjectByPid(this.manhourForm.pid).then(response => {
          console.log(response.responseMap)
          this.initFunctions(response.responseMap.Project)
          if(!this.isEditting)  // 新建状态下才检查有无上级
            this.initSup(response.responseMap.EmployeeProjects)  
      })
    },
    initFunctions(proj){
      this.functions = []
      var funcs = JSON.parse(proj.function)
      for(const key in funcs){
        const f = {
          fid: key,
          name: funcs[key]
        }
        this.functions.push(f)
      }
    }
  ,
    // 检查在该项目中有无上级
    initSup(employeeProjects){
      this.hasSup = false
        for(const key in employeeProjects){
          if(employeeProjects[key].employee_id == this.eid && employeeProjects[key].sup){
            this.hasSup = true
            break
          }
        }
    },

    // isEditting == true
    initManhour() {
      this.manhourForm.mid = this.$route.params.mid
      this.manhourForm.pid = this.$route.params.pid
      this.manhourForm.aid = this.$route.params.aid
      this.manhourForm.starttime = this.$route.params.starttime
      this.manhourForm.endtime = this.$route.params.endtime
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if(!this.isEditting){  //todo: eid
            manhourApi.createManhour(this.eid, this.manhourForm.pid, this.manhourForm.aid, this.manhourForm.fid, this.manhourForm)
            .then((response) => {
              console.log(response)
              this.$message.success('保存成功!')
              this.$router.push('/manhour/list')
              this.loading = false
            }).catch(() => {
              this.$message.error('网络错误或意外发生')
            })
          }
          else{  //todo: eid
            manhourApi.updateManhour(this.eid,this.manhourForm.mid, this.manhourForm)
            .then((response) => {
              console.log(response)
              this.$message.success('保存成功!')
              this.$router.push('/manhour/list')
              this.loading = false
            }).catch(() => {
              this.$message.error('网络错误或意外发生')
            })
          }
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

