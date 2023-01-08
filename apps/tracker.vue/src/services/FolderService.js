import { http } from '../utils/http.js'

export const FolderService = {
  getFolder(id) {
    return http.get(`api/v1/folders/${id}`)
  },

  getFolders() {
    return http.get('api/v1/folders')
  },

  create(payload) {
    return http.post('api/v1/folders', payload)
  },

  update(id, payload) {
    return http.put(`api/v1/folders/${id}`, payload)
  },

  delete(id) {
    return http.delete(`api/v1/folders/${id}`)
  },
}
