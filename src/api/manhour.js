import request from '@/utils/request'

//获取自己所有的工时记录
export function getManhour(params) {
  return request({
    url: '/manhour/myManhour',
    method: 'get',
    params: params
  })
}

//todo获取一条工时
export function getManhourById(id) {
  return request({
    url: '/manhour/myManhour/' + id,
    method: 'get'
  })
}

// todo保存一个工时
export function saveManhour(data) {
  return request({
    url: '/manhour/myManhour',
    method: 'post',
    data
  })
}

// todo修改一个工时
export function updateManhour(data) {
  return request({
    url: '/manhour/myManhour',
    method: 'post',
    data
  })
}

//todo删除一个工时
export function deleteManhour(id) {
  return request({
    url: '/manhour/myManhour' + id,
    method: 'delete'
  })
}

//仅支持’unfilled’,’unchecked’,’checked’,’expired’
export function manhourStatus() {
  return ({
    CHECKED: {
      value: 'CHECKED',
      color: 'success',
      status: 'success',
      text: '已审核'
    },
    UNFILLED: {
      value: 'UNFILLED',
      color: 'warning',
      status: 'warning',
      text: '未完成'
    },
    UNCHECKED: {
      value: 'UNCHECKED',
      color: 'blue',
      status: 'success',
      text: '未审核'
    },
    EXPIRED: {
      value: 'EXPIRED',
      color: 'danger',
      status: 'error',
      text: '已过期'
    }
  })
}
