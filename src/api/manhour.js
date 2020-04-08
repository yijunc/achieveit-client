import request from '@/utils/request'

// 获取自己所有的工时记录
export function getManhour(params) {
  return request({
    url: '/manhour/myManhour',
    method: 'get',
    params: params
  })
}

// 获取所有项目中下级的工时记录
export function getSubManhour(eid) {
  return request({
    url: `/manhour/subManhour/${eid}`,
    method: 'get'
  })
}

/**  保存一个工时
* @params 起止时间
*/
export function createManhour(eid, pid, aid, fid, data) {
  return request({
    url: `/manhour/${eid}/${pid}/${aid}/${fid}`,
    method: 'post',
    data
  })
}

// 修改一个工时
export function updateManhour(eid, mid, data) {
  return request({
    url: `/manhour/${eid}/${mid}`,
    method: 'put',
    data
  })
}

// 删除一个工时
export function deleteManhour(eid, mid) {
  return request({
    url: `/manhour/${eid}/${mid}`,
    method: 'delete'
  })
}

// 仅支持’unfilled’,’unchecked’,’checked’
export function manhourStatus() {
  return ({
    'unfilled': {
      value: 'unfilled',
      type: 'warning',
      text: '未审核'
    },
    'checked': {
      value: 'checked',
      type: 'success',
      text: '通过'
    },
    'unchecked': {
      value: 'unchecked',
      type: 'danger',
      text: '不通过'
    }
  })
}
