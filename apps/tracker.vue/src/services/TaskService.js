import { http } from '../utils/http.js'

export const TaskService = {
  show(id) {
    return http.get(`api/v1/tasks/${id}`)
  },

  create(payload) {
    return http.post('api/v1/tasks', payload)
  },

  delete(id) {
    return http.delete(`api/v1/tasks/${id}`)
  },

  update(id, payload) {
    return http.put(`api/v1/tasks/${id}`, payload)
  },

  getTasks() {
    return http.get('api/v1/tasks')
  },

  getTasksAuthor() {
    return http.get('api/v1/tasks-author')
  },

  getTasksExecutor() {
    return http.get('api/v1/tasks-executor')
  },

  getTasksIndefinite() {
    return http.get('api/v1/tasks-indefinite')
  },

  getFolderMeTasks() {
    return http.get('api/v1/folder-me/tasks')
  },

  getFolderSharedTasks() {
    return http.get('api/v1/folder-shared/tasks')
  },

  getFolderTasks(folderId) {
    return http.get(`api/v1/folder/${folderId}/tasks`)
  },

  /// ////////////////
  addFile(id, formData) {
    return http.post(`api/v1/tasks/${id}/add-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  downloadFile(id) {
    return http.get(`api/v1/task-file/${id}`)
  },

  removeFile(id) {
    return http.post(`api/v1/remove-task-file/${id}`)
  },
}
