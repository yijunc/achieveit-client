<template>
  <div>
    <div style="margin: 10px">人员管理
      <el-button style="margin: 0 10px" type="primary" plain size="mini" @click="">新增</el-button>
    </div>
    <el-table v-model="members" v-loading="tableLoading" :data="members" style="width: 100%">

      <!--<el-table-column-->
      <!--:prop="col.jsonKey"-->
      <!--:label="col.text"-->
      <!--:width="col.width?col.width:'auto'"-->
      <!--align="center"-->
      <!--/>-->

      <el-table-column prop="eid" label="ID" align="center" />

      <el-table-column prop="name" label="姓名" align="center" />

      <el-table-column prop="email" label="邮箱" align="center" />

      <el-table-column prop="address" label="地址" align="center" />

      <el-table-column prop="department" label="部门" align="center" />

      <el-table-column prop="phone" label="联系方式" align="center" />

      <el-table-column prop="role" label="职位" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="r in row.role" :key="r" :type="roles[r].tag">{{ r }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" :disabled="validate(scope.row)" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" :disabled="validate(scope.row)" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑职位" :visible.sync="dialogVisible">
      <h3>选择你要编辑的职位</h3>
      <el-checkbox-group v-model="editRoleCheckList">
        <el-checkbox label="qa" />
        <el-checkbox label="epg" />
        <el-checkbox label="rd" />
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onEditRoleCanceled">取 消</el-button>
        <el-button type="primary" @click="onEditRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchProjectByPid, editMemberRole, deleteMemberRole } from '@/api/project'

export default {
  name: 'Member',
  props: { pid: String },
  data() {
    return {
      memberMap: {
        eid: { text: 'ID', jsonKey: 'eid' },
        name: { text: '姓名', jsonKey: 'name' },
        email: { text: '邮箱', jsonKey: 'email' },
        address: { text: '地址', jsonKey: 'address' },
        department: { text: '部门', jsonKey: 'department' },
        phone: { text: '联系方式', jsonKey: 'phone' },
        role: { text: '职位', jsonKey: 'role' }
      },
      workflowMember: ['sup', 'configurer', 'epgleader', 'qamanager'],
      members: [],
      newMembers: [],
      roles: {
        'pm': { priority: 3, editable: false, tag: 'warning' },
        'rd_leader': { priority: 2, editable: false, tag: 'success' },
        'qa_leader': { priority: 2, editable: false, tag: 'success' },
        'sup': { priority: 5, editable: false, tag: 'danger' },
        'configurer': { priority: 4, editable: false, tag: '' },
        'epgleader': { priority: 4, editable: false, tag: '' },
        'qamanager': { priority: 4, editable: false, tag: '' },
        'rd': { priority: 1, editable: false, tag: 'info' },
        'qa': { priority: 1, editable: false, tag: 'info' },
        'epg': { priority: 1, editable: false, tag: 'info' }
      },
      tableLoading: false,
      dialogVisible: false,
      editRoleCheckList: [],
      selectedRow: null
    }
  },
  computed: {
    tableData: function() {
      this.getPjMembers()
      return this.members
    }
  },
  created() {
    this.getPjMembers()
  },
  methods: {
    getPjMembers() {
      fetchProjectByPid(this.pid).then(response => {
        const employees = response.responseMap.EmployeeProjects
        const workflow = response.responseMap.Project.workflow

        // get employee from project info
        for (const index in employees) {
          const employee = employees[index]['employee']
          if (employee !== undefined) {
            const member = {}
            // epid
            member['epid'] = employees[index]['epid']
            Object.keys(this.memberMap).forEach((key) => {
              if (key !== 'role') {
                // member.set(this.memberMap[key].jsonKey, employee[this.memberMap[key].jsonKey])
                member[this.memberMap[key].jsonKey] = employee[this.memberMap[key].jsonKey]
              } else {
                member['role'] = Array.from(employees[index]['roles'], r => r['role'])
              }
            })
            // console.log(member)
            this.members.push(member)
          }
        }

        for (const workflowMemberIndex in this.workflowMember) {
          const member = {}
          Object.keys(this.memberMap).forEach(key => {
            if (key !== 'role') {
              member[this.memberMap[key].jsonKey] = workflow[this.workflowMember[workflowMemberIndex]][this.memberMap[key].jsonKey]
            } else {
              member['role'] = [this.workflowMember[workflowMemberIndex]]
            }
          })
          // console.log(member)
          this.members.push(member)
        }

        console.log(this.members)
      })
    },
    handleEdit(row) {
      this.dialogVisible = true
      this.selectedRow = row
    },
    handleDelete(row) {
      this.tableLoading = true
      if (row['epid'] !== undefined) {
        deleteMemberRole(row['epid']).then(response => {
          if (response.status === 200) {
            this.$message({ message: '删除成功', type: 'success' })
            this.members.splice(this.members.indexOf(row), 1)
            this.tableLoading = false
          }
        })
      }
      console.log(row)
    },
    validate(member) {
      for (let i = 0; i < member.role.length; i++) {
        if (member.role[i] === 'qa' || member.role[i] === 'epg' || member.role[i] === 'rd') { return false }
      }
      return true
    },
    onEditRole() {
      this.tableLoading = true
      const param = { 'roles': this.editRoleCheckList }
      editMemberRole(this.selectedRow.eid, this.pid, param).then(response => {
        if (response.status === 200) {
          this.$message({ message: '编辑职位成功', type: 'success' })
          this.selectedRow.role = this.editRoleCheckList
          this.tableLoading = false
        }
      })
      this.dialogVisible = false
    },
    onEditRoleCanceled() {
      this.editRoleCheckList = []
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
