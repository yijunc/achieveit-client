<template>
  <div class="app-container">
    <div class="headerspan">
      <span style="font-size:20px;padding-top:20px;display:inline-block;">租借设备</span>
      <el-divider />
    </div>
    <el-row>
      <el-col :span="16">
        <el-form
          ref="poForm"
          :model="poForm"
          :rules="rules"
          label-width="150px"
          onautocomplete="on"
          class="poForm"
          span="12"
        >

          <el-form-item label="项目名称" prop="project_id">
            <el-select v-model="poForm.project_id" class="selector" placeholder="请选择项目名称" :disabled="isEditting">
              <el-option
                v-for="item in projects_doing"
                :key="item.pid"
                :label="item.name"
                :value="item.pid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称" prop="property_id">
            <el-select v-model="poForm.property_id" class="selector" filterable placeholder="请选择或输入设备名称" :disabled="isEditting">
              <el-option
                v-for="item in properties"
                :key="item.pid"
                :label="item.desc"
                :value="item.pid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备状态" prop="is_intact">
            <el-select v-model="poForm.is_intact" class="selector" placeholder="请选择设备状态">
              <el-option
                v-for="item in intactStatus"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="到期时间" prop="expire_time">
            <el-date-picker
              v-model="poForm.expire_time"
              type="datetime"
              placeholder="选择到期时间"
            />
          </el-form-item>

          <el-form-item>
            <el-button :loading="loading" type="primary" @click="submitForm('poForm')">保存</el-button>
            <el-button @click="resetForm('poForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <div>
          <img src="@/assets/fast_company_lab.gif" class="emptyGif">
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as projectApi from '@/api/project'
import * as propertyApi from '@/api/property'
import { mapGetters } from 'vuex'
const dayjs = require('dayjs')

export default {
  name: 'PropertyNew',
  data() {
    return {
      intactStatus: propertyApi.getIntactStatus(),
      poForm: {
        project_id: '',
        property_id: '',
        expire_time: '',
        is_intact: ''
      },
      rules: {
        property_id: [
          { required: true, message: '请选择设备', trigger: 'change' }
        ],
        project_id: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        expire_time: [
          { required: true, message: '需要填写到期时间', trigger: 'change' }
        ],
        is_intact: [
          { required: true, message: '请选择设备状态', trigger: 'change' }
        ]
      },

      projects_doing: [],
      properties: [],
      loading: false,
      isEditting: false,

      projectParams: {
        length: 10,
        page: 0,
        status: 'doing'
      }
    }
  },
  computed: {
    ...mapGetters([
      'eid'
    ])
  },
  created() {
    this.isEditting = !!this.$route.params.poid
    this.populateSelectorData()
    if (this.isEditting) {
      this.initPropertyForm()
    }
  },
  methods: {
    populateSelectorData() {
      projectApi.fetchProjects(this.projectParams).then(response => {
        this.initProjects(response.responseMap.Project)
      })
      propertyApi.getProperties().then(response => {
        this.initProperties(response.responseMap.properties)
      })
    },
    initProjects(projects) {
      this.projects_doing = []
      for (const key in projects) {
        const data = {
          pid: projects[key].pid,
          name: projects[key].name
        }
        this.projects_doing.push(data)
      }
    },
    initProperties(p) {
      this.properties = []
      for (const key in p) {
        const data = {
          pid: p[key].pid,
          desc: p[key].desc
        }
        this.properties.push(data)
      }
    },
    // 编辑状态时
    initPropertyForm() {
      Object.keys(this.poForm).forEach(key => {
        if (key !== 'expire_time') {
          this.poForm[key] = this.$route.params.row[key]
        } else {
          this.poForm[key] = dayjs(this.$route.params.row[key]).format() // 时间要转化
        }
      })
    },
    submitForm(formName) {
      if (dayjs(this.poForm.expire_time).isBefore(dayjs())) {
        this.$message.error('错误的到期时间！')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (!this.isEditting) {
            const { project_id, property_id } = this.poForm
            console.log('Created expire_time: ', this.poForm.expire_time)
            propertyApi.occupy(this.eid, project_id, property_id, this.poForm)
              .then((response) => {
                console.log(response)
                this.$message.success('保存成功!')
                this.$router.go(-1)
                this.loading = false
              }).catch(() => {
                this.$message.error('网络错误或意外发生')
                this.loading = false
              })
          } else {
            console.log('Updated expire_time: ', this.poForm.expire_time)
            propertyApi.updateOccupy(this.$route.params.poid, this.poForm)
              .then((response) => {
                console.log(response)
                this.$message.success('修改成功!')
                this.$router.go(-1)
                this.loading = false
              }).catch(() => {
                this.$message.error('网络错误或意外发生')
                this.loading = false
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
  .poForm{
    width: 100%;
    position: relative;
    padding: 20px;
    .selector{
      width: 400px;
    }
  }
</style>

