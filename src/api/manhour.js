import request from '@/utils/request'

//获取自己所有的工时记录
export function getManhour(params) {
  return request({
    url: '/manhour/myManhour',
    method: 'get',
    params: params
  })
}

/* 保存一个工时
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

//删除一个工时
export function deleteManhour(eid, mid) {
  return request({
    url: `/manhour/${eid}/${mid}`,
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
  })
}
