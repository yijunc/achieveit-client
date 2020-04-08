import request from '@/utils/request'

export function fetchWorkflowTimeline(wid) {
  return request({
    url: 'workflow/timeline/' + wid,
    method: 'get'
  })
}

export function pushWorkflow(wid, eid, data) {
  return request({
    url: 'workflow/' + wid + '/' + eid,
    method: 'put',
    data
  })
}
