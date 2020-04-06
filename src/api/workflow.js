import request from '@/utils/request'

export function fetchWorkflowTimeline(wid) {
  return request({
    url: 'workflow/timeline/' + wid,
    method: 'get'
  })
}
