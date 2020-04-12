<template>
  <div class="app-container">
    <el-select v-if="op === 'new'" v-model="riskForm" placeholder="请选择风险模板">
      <el-option v-for="it in riskTemplate" :key="it.rid" :label="it.type" :value="it" />
    </el-select>
    <el-form
      ref="riskForm"
      :model="riskForm"
      label-width="150px"
      onautocomplete="on"
      :rules="rules"
      class="riskForm"
      span="12"
    >
      <el-form-item label="风险类型" prop="type">
        <el-input v-model="riskForm.type" />
      </el-form-item>
      <el-form-item label="风险描述" prop="desc">
        <el-input v-model="riskForm.desc" />
      </el-form-item>
      <el-form-item label="风险影响" prop="influence">
        <el-input v-model="riskForm.influence" />
      </el-form-item>
      <el-form-item label="风险策略" prop="strategy">
        <el-input v-model="riskForm.strategy" />
      </el-form-item>
      <el-form-item label="紧急度" prop="grade">
        <el-select v-model="riskForm.grade" placeholder="请选择紧急度">
          <el-option key="p1" label="p1" value="p1" />
          <el-option key="p2" label="p2" value="p2" />
          <el-option key="p3" label="p3" value="p3" />
        </el-select>
      </el-form-item>
      <el-form-item label="风险人员" prop="ep_ids">
        <el-select v-model="riskForm.ep_ids" multiple class="selector" filterable placeholder="请选择">
          <el-option
            v-for="item in members"
            :key="item.epid"
            :label="item.employee.name"
            :value="item.epid"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSubmit('riskForm')">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as RiskAPI from '@/api/risk'
import { mapGetters } from 'vuex'

export default {
  name: 'RiskDialog',
  props: {
    rid: String,
    pid: String,
    op: String,
    members: Array,
    risk: Object,
    onDialogSubmit: Function,
    onDialogCancel: Function
  },
  data() {
    return {
      template_id: 0,
      riskTemplate: [],
      riskForm: {
        type: '',
        desc: '',
        grade: '',
        influence: '',
        strategy: '',
        frequency: 0,
        ep_ids: []
      },
      loading: false,
      rules: {
        type: [
          { required: true, message: '请输入风险类型', trigger: 'blur' },
          { min: 3, message: '长度需要大于 3 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入风险描述', trigger: 'blur' },
          { min: 3, message: '长度需要大于 3 个字符', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '请选择风险紧急度', trigger: 'change' }
        ],
        influence: [
          { required: true, message: '请输入风险影响', trigger: 'blur' }
        ],
        strategy: [
          { required: true, message: '请填写风险策略', trigger: 'blur' }
        ],
        frequency: [
          { required: true, message: '请填写提醒频率', trigger: 'change' }
        ],
        ep_ids: [
          { required: true, type: 'array', message: '请选择风险人员', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'eid'
    ])
  },
  methods: {
    populateDialog() {
      RiskAPI.getRiskTemplate().then(response => {
        this.riskTemplate = response.responseMap.risks
      })
      if (this.risk !== null) {
        this.riskForm = {
          type: this.risk.type,
          desc: this.risk.desc,
          grade: this.risk.grade,
          influence: this.risk.influence,
          strategy: this.risk.strategy,
          frequency: this.risk.frequency,
          ep_ids: []
        }
        for (const it of this.risk.relations) {
          this.riskForm.ep_ids.push(it.employeeProject.epid)
        }
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          switch (this.op) {
            case 'new':
              RiskAPI.newRisk(this.eid, this.pid, this.riskForm).then((response) => {
                console.log(response)
                this.$message.success('提交成功')
                this.loading = false
                this.onDialogSubmit()
              }).catch(() => {
                this.$message.error('提交失败')
                this.loading = false
              })
              break
            case 'update':
              RiskAPI.updateRisk(this.eid, this.riskForm.rid, this.riskForm).then((response) => {
                this.$message.success('提交成功')
                this.loading = false
                this.onDialogSubmit()
              }).catch(() => {
                this.$message.error('提交失败')
                this.loading = false
              })
              break
            default:
              this.$message.error('真的裂开了')
          }
        } else {
          return false
        }
      })
    },
    onCancel() {
      this.riskForm = {
        type: '',
        desc: '',
        grade: '',
        influence: '',
        strategy: '',
        frequency: '',
        ep_ids: []
      }
      this.onDialogCancel()
    }
  }
}
</script>

<style lang="scss" scoped>
  .riskForm{
    width: 100%;
    position: relative;
    padding: 20px;
    .selector{
      width: 400px;
    }
  }
</style>

