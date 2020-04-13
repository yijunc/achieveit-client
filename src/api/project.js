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
    url: `/project/getByPid/${pid}`,
    method: 'get'
  })
}

export function updateProject(pid, data) {
  return request({
    url: `/project/${pid}`,
    method: 'put',
    data
  })
}

export function newProject(data, eid) {
  return request({
    url: '/project/new/' + eid,
    method: 'post',
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

export function toManage() {
  return request({
    url: '/project/toManage',
    method: 'get'
  })
}

export function fetchMembersNotIn(pid) {
  return request({
    url: `/project/getNotInProject/${pid}`,
    method: 'get'
  })
}

export function editMemberRole(eid, pid, data) {
  return request({
    url: `/project/member/${eid}/${pid}`,
    method: 'post',
    data
  })
}

export function deleteMemberRole(epid) {
  return request({
    url: `/project/member/${epid}`,
    method: 'delete'
  })
}

export function fetchMilestone(pid) {
  return request({
    url: `/milestone/getByPid/${pid}`,
    method: 'get'
  })
}

export function addMilestone(pid, data) {
  return request({
    url: `/milestone/add/${pid}`,
    method: 'post',
    data
  })
}

export function editMilestone(mid, data) {
  return request({
    url: `/milestone/${mid}`,
    method: 'put',
    data
  })
}

export function delMilestone(mid) {
  return request({
    url: `/milestone/deleteByMid/${mid}`,
    method: 'delete'
  })
}
