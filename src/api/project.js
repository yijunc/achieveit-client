import request from '@/utils/request'

export function fetchProjects(data) {
  return request({
    url: '/project/myProject',
    method: 'get',
    params: data
  })
}

export function fetchProjectByPid(pid) {
  return request({
    url: '/project/getByPid/' + pid,
    method: 'get'
  })
}

export function newProject(data) {
  return request({
    url: '/project/new',
    method: 'put',
    data
  })
}

// 项目管理里的项目状态时间线
export function fetchTimeline(wid) {
  return request({
    url: '/workflow/timeline/' + wid,
    method: 'get'
  })
}

