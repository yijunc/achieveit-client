<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        placement="top"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.timestamp"
      >
        <el-card>
          <h4>{{ activity.content }}</h4>
          <p>曹老师 提交于 2019/4/12 20:46</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: 'Status',
  data() {
    return {
      activities: [{
        content: '创建项目',
        timestamp: '2019-04-02 20:46',
        size: 'large',
        type: 'primary',
        icon: 'el-icon-more'
      }, {
        content: '部门初审',
        timestamp: '2019-04-03 20:46',
        color: '#0bbd87'
      }, {
        content: '财务复核',
        timestamp: '2019-04-04 20:46',
        size: 'large'
      }, {
        content: '项目完成',
        timestamp: '2019-04-05 20:46'
      }]
    }
  }
}
</script>

<style scoped>

</style>
