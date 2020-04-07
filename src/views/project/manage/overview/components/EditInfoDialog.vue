<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" label-position="left" size="medium">
      <el-form-item label="项目ID">
        <el-input v-model="form.pid" :disabled="true" />
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="项目开始时间">
        <el-date-picker v-model="form.starttime" type="datetime" placeholder="选择日期时间" />
      </el-form-item>
      <el-form-item label="项目结束时间">
        <el-date-picker v-model="form.endtime" type="datetime" placeholder="选择日期时间" />
      </el-form-item>
      <el-form-item label="技术">
        <el-input v-model="form.technique" />
      </el-form-item>
      <el-form-item label="领域">
        <el-input v-model="form.domain" />
      </el-form-item>
    <!--<el-form-item>-->
    <!--<el-button type="primary" @click="onSubmit">立即创建</el-button>-->
    <!--<el-button>取消</el-button>-->
    <!--</el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onDialogCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { updateProject } from '@/api/project'

export default {
  name: 'EditInfo',
  props: {
    pjInfo: {
      pid: '',
      name: '',
      starttime: '',
      endtime: '',
      technique: '',
      domain: ''
    },
    onDialogCancel: Function,
    onDialogConfirm: Function },
  data() {
    return {
      form: {
        pid: '',
        name: '',
        starttime: '',
        endtime: '',
        technique: '',
        domain: ''
      }
    }
  },
  created() {
    Object.keys(this.form).forEach(key => { this.form[key] = this.pjInfo[key] })
  },
  methods: {
    // 防止修改后不提交form内容缓存
    update() {
      Object.keys(this.form).forEach(key => {
        if (this.form[key] !== this.pjInfo[key]) {
          this.form[key] = this.pjInfo[key]
        }
      })
    },
    onSubmit() {
      const param = {}
      Object.keys(this.form).forEach(key => {
        if (this.form[key] !== this.pjInfo[key]) {
          param[key] = this.form[key]
        }
      })
      this.onDialogConfirm()
      updateProject(this.form.pid, param)
      console.log('basic info update!')
    }
  }
}
</script>

<style scoped>

</style>
