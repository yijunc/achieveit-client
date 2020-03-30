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

