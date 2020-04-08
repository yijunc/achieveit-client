import request from '@/utils/request'

// 获取公司的所有资产
export function getProperties() {
  return request({
    url: '/property',
    method: 'get'
  })
}

// 获取某个资产
export function getPropertyByPropertyId(property_id) {
  return request({
    url: `/propert/${property_id}`,
    method: 'get'
  })
}

// 租借一个设备
export function occupy(employee_id, project_id, property_id, data) {
  return request({
    url: `/property/occupy/${employee_id}/${project_id}/${property_id}`,
    method: 'post',
    data
  })
}

// 更新一个租借
export function updateOccupy(poid, data) {
  return request({
    url: `/property/occupy/${poid}`,
    method: 'put',
    data
  })
}

// 获取员工所租借的资产
export function getPropertyByEmployeeId(eid) {
  return request({
    url: `/property/occupy/employee/${eid}`,
    method: 'get'
  })
}

// 获取项目下所有员工租借的资产
export function getPropertyByProjectId(pid) {
  return request({
    url: `/property/occupy/project/${pid}`,
    method: 'get'
  })
}

export function getIntactStatus() {
  return ({
    'true': {
      value: true,
      type: 'success',
      text: '完好'
    },
    'false': {
      value: false,
      type: 'danger',
      text: '有损坏'
    }
  })
}

export function getExpireStatus() {
  return ({
    'true': {
      value: true,
      type: 'danger',
      text: '已到期'
    },
    'false': {
      value: false,
      type: 'success',
      text: '未到期'
    }
  })
}
