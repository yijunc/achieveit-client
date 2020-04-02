import request from '@/utils/request'

// 获取缺陷列表
export function getDefects(params) {
  return request({
    url: '/defect/myDefect',
    method: 'get',
    params: params
  })
}

//获取一个缺陷
export function getDefect(id) {
  return request({
    url: '/defect/myDefect/' + id,
    method: 'get'
  })
}

// 保存一个缺陷
export function saveDefect(data) {
  return request({
    url: '/defect/myDefect',
    method: 'post',
    data
  })
}

//删除一个缺陷
export function deleteDefect(id) {
  return request({
    url: '/defect/myDefect/' + id,
    method: 'delete'
  })
}

//缺陷状态，仅支持’bug’,’reopen’,’fixed’,’wontfix’,’feature’,’closed’
export function defectStatus() {
  return ({
    FIXED: {
      value: 'FIXED',
      color: 'success',
      status: 'success',
      text: 'fixed'
    },
    CLOSED: {
      value: 'CLOSED',
      color: 'success',
      status: 'success',
      text: 'closed'
    },
    REOPEN: {
      value: 'REOPEN',
      color: 'warning',
      status: 'warning',
      text: 'reopen'
    },
    WONTFIX: {
      value: 'WONTFIX',
      color: 'info',
      status: 'warning',
      text: 'wontfix'
    },
    BUG: {
      value: 'BUG',
      color: 'danger',
      status: 'error',
      text: 'bug'
    },
    FEATURE: {
      value: 'FEATURE',
      color: 'blue',
      status: 'success',
      text: 'feature'
    }
  })
}
