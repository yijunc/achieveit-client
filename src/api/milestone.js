import request from '@/utils/request'

// 获取一个项目的里程碑
export function getMilestoneByPid(pid) {
  return request({
    url: `/milestone/getByPid/${pid}`,
    method: 'get'
  })
}

// 获取一个里程碑
export function getMilestoneByMid(mid) {
  return request({
    url: `/milestone/getByMid/${mid}`,
    method: 'get'
  })
}

/**  保存一个里程碑
 * @params 起止时间
 */
export function createMilestone(pid, data) {
  return request({
    url: `/milestone/add/${pid}`,
    method: 'post',
    data
  })
}

// 修改一个里程碑
export function updateMilestone(mid, data) {
  return request({
    url: `/milestone/${mid}`,
    method: 'put',
    data
  })
}

// 删除一个里程碑
export function deleteByMid(mid) {
  return request({
    url: `/milestone/deleteByMid/${mid}`,
    method: 'delete'
  })
}
