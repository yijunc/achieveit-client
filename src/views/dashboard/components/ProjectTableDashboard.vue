<template>
  <el-table
    :data="projectList"
    stripe
    style="width: 100%;padding-top: 15px;"
    :default-sort="{prop: 'date', order: 'descending'}"
  >
    <el-table-column prop="id" sortable label="ID" min-width="20" align="center">
      <template slot-scope="scope">
        {{ scope.row.project_id }}
      </template>
    </el-table-column>
    <el-table-column label="项目名称" min-width="60">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>客户: {{ scope.row.project.client }}</p>
          <p>技术: {{ scope.row.project.technique }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.project.name | projectNameFilter }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="date" sortable label="项目截止" min-width="50" align="center">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        {{ scope.row.project.endtime }}
      </template>
    </el-table-column>
    <el-table-column label="项目领域" min-width="40" align="center">
      <template slot-scope="scope">
        {{ scope.row.project.domain }}
      </template>
    </el-table-column>
    <el-table-column label="项目状态" width="100" align="center">
      <template slot-scope="scope">
        <el-tag type="warning">
          正在进行
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作"  min-width="30">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="clickRow(scope.row.project_id)"
          type="primary"
          size="mini">
          查看项目详情
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    projectNameFilter(str) {
      return str.substring(0, 30)
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['projectList'],
  // data() {
  //   return {
  //
  //   }
  // },
  created() {

  },
  methods: {
    clickRow(pid) {
      this.$router.push('/project' + pid)
    }
  }
}
</script>
