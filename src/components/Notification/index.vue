<template>
  <div>
    <el-badge :is-dot="unreadMsgCount > 0" style="line-height: 25px;margin-top: -5px;" @click.native="dialogTableVisible=true">
      <svg-icon class-name="notification-icon" icon-class="notification" />
    </el-badge>

    <el-dialog :visible.sync="dialogTableVisible" width="80%" append-to-body>
      <div slot="title">
        <span style="padding-right: 10px;">消息提醒</span>
        <el-button size="mini" type="primary" icon="el-icon-check" @click="readAll">全标已读</el-button>
      </div>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%; padding-top: 5px; margin-bottom: 5px"
        :default-sort="{prop: 'time', order: 'descending'}"
        @row-click="handleRead"
      >
        <el-table-column prop="status" label="状态" min-width="10" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.unRead | statusTypeFilter ">
              {{ scope.row.unRead | statusFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="消息内容" min-width="80" align="">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="搜索消息内容"
            />
          </template>
          <template slot-scope="scope">
            <p> {{ scope.row.desc | descFilter }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="发送时间" min-width="20" align="center" sortable>
          <template slot-scope="scope">
            {{ scope.row.time }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        small
        background
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, jumper, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: '未读',
        false: '已读'
      }
      return statusMap[status]
    },
    statusTypeFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'warning'
      }
      return statusMap[status]
    },
    descFilter(str) {
      return str.substring(0, 60)
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      msgList: [],
      search: '',
      pageSize: 4,
      currentPage: 1
    }
  },
  computed: {
    unreadMsgCount: function() {
      return this.msgList.filter(data => data.unRead).length
    },
    tableData: function() {
      return this.msgList
        .filter(data => !this.search || data.desc.toLowerCase().includes(this.search.toLowerCase()))
        .slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    total: function() {
      return this.msgList
        .filter(data => !this.search || data.desc.toLowerCase().includes(this.search.toLowerCase())).length
    }
  },
  created() {
    this.msgList = this.$store.getters.notification
  },
  methods: {
    readAll() {
      for (const key in this.msgList) {
        this.msgList[key].unRead = false
      }
    },
    handleRead(row) {
      row.unRead = false
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    }
  }
}
</script>

<style scoped>
.notification-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: text-bottom;
  }

  .message-title {
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

.message-content {
    font-size: 16px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;
  }
</style>
