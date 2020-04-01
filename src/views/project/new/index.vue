<template>
  <div class="app-container">
    <div>
      <span style="font-size:20px;padding-top:20px;display:inline-block;">创建一个全新的项目</span>
      <el-divider />
    </div>
    <el-form ref="projectForm" :model="projectForm" :rules="rules" label-width="100px" class="demo-projectForm">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="projectForm.name" />
      </el-form-item>
<!--      <el-form-item label="活动区域" prop="region">-->
<!--        <el-select v-model="projectForm.region" placeholder="请选择活动区域">-->
<!--          <el-option label="区域一" value="shanghai" />-->
<!--          <el-option label="区域二" value="beijing" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="活动起止时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker v-model="projectForm.starttime" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker v-model="projectForm.endtime" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="projectForm.delivery" />
      </el-form-item>
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="projectForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type" />
          <el-checkbox label="地推活动" name="type" />
          <el-checkbox label="线下主题活动" name="type" />
          <el-checkbox label="单纯品牌曝光" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group v-model="projectForm.resource">
          <el-radio label="线上品牌商赞助" />
          <el-radio label="线下场地免费" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式" prop="desc">
        <el-input v-model="projectForm.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('projectForm')">立即创建</el-button>
        <el-button @click="resetForm('projectForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ProjectNew',
  data() {
    return {
      projectForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 3, message: '长度需要大于 3 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        starttime: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        endtime: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
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

<style scoped>

</style>

