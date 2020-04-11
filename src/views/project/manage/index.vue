<template>
  <div>
    <div class="tab-container">
      <el-tabs v-model="activeName" tab-position="left">
        <el-tab-pane key="overview" label="基本信息" name="overview">
          <Overview :pid="pid" />
        </el-tab-pane>
        <el-tab-pane key="workflow" label="项目 WorkFlow" name="workflow">
          <Workflow :pid="pid" />
        </el-tab-pane>
        <el-tab-pane key="member" label="人员管理" name="member">
          <Member :pid="pid" />
        </el-tab-pane>
        <el-tab-pane key="function" label="功能管理" name="function">
          <Function :pid="pid" />
        </el-tab-pane>
        <el-tab-pane key="defect" label="缺陷管理" name="defect">
          <Defect :pid="pid" />
        </el-tab-pane>
        <el-tab-pane key="risk" label="风险管理" name="risk">
          <Risk :pid="pid" />
        </el-tab-pane>
        <el-tab-pane key="property" label="设备管理" name="property">
          <Property :pid="pid" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Overview from './overview/index'
import Workflow from './workflow/index'
import Member from './member/index'
import Function from './function/index'
import Defect from './defect/index'
import Risk from './risk/index'
import Property from './property/index'

export default {
  name: 'Manage',
  components: { Overview, Workflow, Member, Function, Defect, Risk, Property },
  data() {
    return {
      pid: null,
      tabMapOptions: [
        { label: '基本信息', key: 'overview' },
        { label: '项目 WorkFlow', key: 'workflow' },
        { label: '人员管理', key: 'member' },
        { label: '功能管理', key: 'function' },
        { label: '缺陷管理', key: 'defect' },
        { label: '风险管理', key: 'risk' },
        { label: '设备管理', key: 'property' },
      ],
      activeName: 'overview',
      createdTimes: 0
    }
  },
  created() {
    this.pid = this.$route.params.pid === undefined ? null : this.$route.params.pid
  },
  methods: {
    key() {
      return this.$route.path + new Date().toString()
    }
  }

}
</script>

<style scoped>
  .tab-container {
    margin: 20px 10px;
  }
</style>
