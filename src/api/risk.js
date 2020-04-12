import request from '@/utils/request'

export function getRiskByPid(pid) {
  return request({
    url: 'risk/getByPid/' + pid,
    method: 'get'
  })
}

export function getRiskTemplate() {
  return request({
    url: 'risk/getByTemplate',
    method: 'get'
  })
}

export function newRisk(eid, pid, data) {
  return request({
    url: 'risk/' + eid + '/' + pid,
    method: 'post',
    data
  })
}

export function updateRisk(eid, rid, data) {
  return request({
    url: 'risk/' + eid + '/' + rid,
    method: 'put',
    data
  })
}

export function deleteRisk(eid, rid) {
  return request({
    url: 'risk/' + eid + '/' + rid,
    method: 'delete'
  })
}
