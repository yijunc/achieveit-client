<template>
  <div class="app-container">
    <div class="filter-wrap mb-2">
      <el-row style="width: 100%">
        <el-col :xs="24" :sm="24" :md="12" :lg="3">
          <el-select v-model="queryParam.status" placeholder="缺陷状态" @change="handleFilter">
            <el-option label="all" value="" />
            <el-option
              v-for="status in Object.keys(defectStatus)"
              :key="status"
              :label="defectStatus[status].text"
              :value="defectStatus[status].value"
            />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="7" style="margin-left: 10px">
          <el-input
            v-model.trim="queryParam.title"
            placeholder="搜索项目名称"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="1" style="margin-left: 10px">
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="1" style="margin-left: 600px">
          <el-button
            v-permission="'/defect/myDefect/create'"
            type="primary"
            icon="el-icon-document-add"
            @click="handleNew"
          >新增缺陷
          </el-button>
        </el-col>
      </el-row>

    </div>

    <el-table
      :data="defectList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="70" align="center" />
      <el-table-column prop="title" label="缺陷描述" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-link
            :href="row.frontUrl"
            target="_blank"
            type="primary"
          >{{ row.title }}
          </el-link>
        </template>
      </el-table-column>
      
      <el-table-column prop="projectName" label="项目名称" width="150" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.projectName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" width="85" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag
            :type="defectStatus[row.status].color"
            disable-transitions
            effect="plain"
          >{{ defectStatus[row.status].text }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建日期" width="150" show-overflow-tooltip align="center">
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="修改日期" width="150" show-overflow-tooltip align="center">
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.updateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template slot-scope="{row}">
          <el-button
            v-permission="'/defect/myDefect/edit'"
            size="small"
            @click="handleEdit(row.id)"
          >编辑
          </el-button>
          <el-button
            v-permission="'/defect/myDefect/delete'"
            size="small"
            type="danger"
            @click="handleDelete(row.id)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="queryParam.total>0"
      :total="queryParam.total"
      :page.sync="queryParam.pageNum"
      :limit.sync="queryParam.pageSize"
      @pagination="handleFilter"
    /> -->

  </div>
</template>

<script type="text/ecmascript-6">

// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import * as defectApi from '@/api/defect'

const dayjs = require('dayjs');

export default {
  components: {
    // Pagination,
  },
  data: function() {
    return {
      defectStatus: defectApi.defectStatus(),
      defectList: [
          {
            id: 111,
            title: "家穷",
            projectName: "肥宅养成计划",
            createTime: dayjs().format('YYYY-MM-DD HH:mm'),
            updateTime: dayjs().format('YYYY-MM-DD HH:mm'),
            status : "BUG"
          },
          {
            id: 222,
            title: "人丑",
            projectName: "肥宅养成计划",
            createTime: dayjs().format('YYYY-MM-DD HH:mm'),
            updateTime: dayjs().format('YYYY-MM-DD HH:mm'),
            status: "FEATURE"
          },
          {
            id: 333,
            title: "一米四九",
            projectName: "肥宅养成计划",
            createTime: dayjs().format('YYYY-MM-DD HH:mm'),
            updateTime: dayjs().format('YYYY-MM-DD HH:mm'),
            status: "FIXED"
          },
          {
            id: 444,
            title: "全部是卧底",
            projectName: "拯救琴酒!!",
            createTime: dayjs().format('YYYY-MM-DD HH:mm'),
            updateTime: dayjs().format('YYYY-MM-DD HH:mm'),
            status : "REOPEN"
          },
          {
            id: 555,
            title: "队友二五仔",
            projectName: "拯救琴酒!!",
            createTime: dayjs().format('YYYY-MM-DD HH:mm'),
            updateTime: dayjs().format('YYYY-MM-DD HH:mm'),
            status: "WONTFIX"
          },
          {
            id: 666,
            title: "手下是废物",
            projectName: "拯救琴酒!!",
            createTime: dayjs().format('YYYY-MM-DD HH:mm'),
            updateTime: dayjs().format('YYYY-MM-DD HH:mm'),
            status: "CLOSED"
          },
        ],
      queryParam: {
        desc: '',
        page: 0,
        length: 20,
      }
    }
  },
  mounted() {
    // this.queryParam.page = Number(this.$route.query.page) || 1
    this.handleFilter()
  },
  methods: {
    handleNew() {
      this.$router.push('/defect/myDefect/create')
    },
    handleEdit(id) {
      this.$router.push('/defect/myDefect/edit/' + id)
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该缺陷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.deleteDefect(id)
      }).catch(() => {
      })
    },
    // todo
    initDefectData(defects) {
      // this.defectList = []
      for (const key in defects) {
        const data = defects[key]
        const defect = {
          id: data.id,
          title: data.title,
          projectName: data.projectName,
          //todo: frontUrl
          // frontUrl: this.$serverConfig.frontUrl + 'defect/myDefect/defectDetail' + data.id,
          frontUrl:"#",
          createTime: this.$dayjs(data.updateTime).format('YYYY-MM-DD HH:mm'),
          updateTime: this.$dayjs(data.updateTime).format('YYYY-MM-DD HH:mm'),
          status: data.status,
        }
        this.defectList.push(defect)
      }
    },
    deleteDefect(id) {
      defectApi.deleteDefect(id).then(() => {
        this.$message('删除成功!')
        this.handleFilter()
      })
    },
    handleFilter() {
      defectApi.getDefects(this.queryParam).then(response => {
        // console.log("defect: "+ response.responseMap.Defect);
        this.initDefectData(response.responseMap.Defect)
      })
    },
  }
}
</script>
