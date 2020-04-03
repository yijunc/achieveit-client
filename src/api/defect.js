import request from '@/utils/request'

// 获取我的缺陷列表
export function getDefects(params) {
  return request({
    url: '/defect/myDefect',
    method: 'get',
    params: params
  })
}

// 获取某个项目的缺陷列表
export function getDefectsByPid(pid) {
  return request({
    url: '/defect/getByPid' + pid,
    method: 'get'
  })
}

/* 新增一个缺陷
*/
export function createDefect(pid, param) {
  return request({
    url: '/defect/' + pid,
    method: 'post',
    params: param
  })
}

// 删除一个缺陷
export function deleteDefect(did) {
  return request({
    url: '/defect/' + did,
    method: 'delete'
  })
}

// 更新一个缺陷
export function updateDefect(did, param) {
  return request({
    url: '/defect/' + did,
    method: 'put',
    params: param
  })
}

// 缺陷状态，仅支持’bug’,’reopen’,’fixed’,’wontfix’,’feature’,’closed’
export function defectStatus() {
  return ({
    'fixed': {
      value: 'fixed',
      color: 'success',
      status: 'success',
      text: 'fixed'
    },
    'closed': {
      value: 'closed',
      color: 'success',
      status: 'success',
      text: 'closed'
    },
    'reopen': {
      value: 'reopen',
      color: 'warning',
      status: 'warning',
      text: 'reopen'
    },
    'wontfix': {
      value: 'wontfix',
      color: 'info',
      status: 'warning',
      text: 'wontfix'
    },
    'bug': {
      value: 'bug',
      color: 'danger',
      status: 'error',
      text: 'bug'
    },
    'feature': {
      value: 'feature',
      color: 'warning',
      status: 'success',
      text: 'feature'
    }
  })
}
