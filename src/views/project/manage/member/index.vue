<template>
  <div>
    <div style="margin: 10px">人员管理
      <el-button style="margin: 0 10px" type="primary" plain size="mini" @click="">新增</el-button>
    </div>
    <el-table :data="members" style="width: 100%">
      <el-table-column
        v-for="col in memberMap"
        :key="col.jsonKey"
        :prop="col.jsonKey"
        :label="col.text"
        :width="col.width?col.width:'auto'"
        align="center"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchProjectByPid } from '@/api/project'

export default {
  name: 'Member',
  props: { pid: String },
  data() {
    return {
      memberMap: {
        id: { text: 'ID', jsonKey: 'eid', width: '70px' },
        name: { text: '姓名', jsonKey: 'name', width: '100px' },
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
        'pm': { priority: 3, editable: false },
        'rd_leader': { priority: 2, editable: false },
        'qa_leader': { priority: 2, editable: false },
        'sup': { priority: 5, editable: false },
        'configurer': { priority: 4, editable: false },
        'epgleader': { priority: 4, editable: false },
        'qamanager': { priority: 4, editable: false },
        'rd': { priority: 1, editable: false },
        'qa': { priority: 1, editable: false },
        'epg': { priority: 1, editable: false }
      }
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
          console.log(employee)
          if (employee !== undefined) {
            const member = {}
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
    handleClick(row) {
      console.log(row)
    },
    handleDelete(row) {
      console.log(row)
    }
  }
}
</script>

<style scoped>

</style>
