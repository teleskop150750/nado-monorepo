import { http } from '../utils/http.js'

export const UserService = {
  sendNewEmail() {
    return http.post('api/v1/email/verification-notification')
  },

  forgotPassword(payload) {
    return http.post('api/v1/forgot-password', payload)
  },

  resetPassword(token, payload) {
    return http.post(`api/v1/reset-password/${token}`, payload)
  },

  verifyEmail(path) {
    return http.post(`api/v1/email/verify/${path.id}/${path.hash}`, null, {
      params: {
        signature: path.signature,
        expires: path.expires,
      },
    })
  },

  register(payload) {
    return http.post('api/v1/register', payload)
  },

  updateMe(payload) {
    return http.patch('api/v1/me', payload)
  },

  changePassword(payload) {
    return http.post('api/v1/change-password', payload)
  },

  login(payload) {
    return http.post('api/v1/login', payload)
  },

  getUsers(search = null) {
    return http.get('api/v1/users', {
      params: {
        search,
      },
    })
  },
}
