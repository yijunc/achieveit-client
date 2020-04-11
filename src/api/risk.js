import request from '@/utils/request'

export function getRiskByPid(pid) {
  return request({
    url: 'risk/getByPid/' + pid,
    method: 'get'
  })
}
