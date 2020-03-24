import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/employee/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/employee/get',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
