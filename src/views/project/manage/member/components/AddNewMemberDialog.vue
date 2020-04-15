<template>
  <div>
    <el-table
      ref="singleTable"
      :data="membersNotIn"
      highlight-current-row
      stripe
      border
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column prop="eid" label="ID" align="center" />

      <el-table-column prop="name" label="姓名" align="center" />

      <el-table-column prop="email" label="邮箱" align="center" width="180" />

      <el-table-column prop="address" label="地址" align="center" />

      <el-table-column prop="department" label="部门" align="center" />

      <el-table-column prop="phone" label="联系方式" align="center" />

      <el-table-column prop="title" label="职位" align="center">
        <template slot-scope="{row}">
          <el-tag :type="tagMap[row.title].tag">{{ row.title }}</el-tag>
        </template>
      </el-table-column>

    </el-table>
    <h4>新增角色</h4>
    <el-checkbox-group v-model="addRoleCheckList">
      <el-checkbox label="qa" />
      <el-checkbox label="epg" />
      <el-checkbox label="rd" />
    </el-checkbox-group>
    <div style="margin-top: 20px">
      <el-button @click="onCanceled">取消</el-button>
      <el-button @click="onSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddNewMember',
  props: {
    membersNotIn: Array,
    onAddNewDialogCancel: Function,
    onAddNewDialogConfirm: Function },
  data() {
    return {
      currentRow: null,
      addRoleCheckList: [],
      tagMap: {
        'pm_manager': { priority: 3, tag: 'danger' },
        'configurer': { priority: 2, tag: '' },
        'pm': { priority: 2, tag: '' },
        'epg_leader': { priority: 5, tag: 'success' },
        'qa_manager': { priority: 4, tag: 'success' },
        'member': { priority: 4, tag: 'warning' }
      }
    }
  },
  created() {
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val
    },
    onCanceled() {
      this.addRoleCheckList = []
      this.onAddNewDialogCancel()
    },
    onSubmit() {
      if (this.currentRow === null) {
        this.$message.error('什么都没选')
      } else {
        this.onAddNewDialogConfirm(this.currentRow.eid, this.addRoleCheckList)
        this.addRoleCheckList = []
        this.currentRow = null
      }
    }
  }
}
</script>

<style scoped>

</style>
