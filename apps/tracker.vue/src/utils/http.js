import axios from 'axios'

import { useUserStore } from '../store/user.js'

export const http = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  const userStore = useUserStore()

  if (userStore.check().value) {
    config.headers['user-id'] = userStore.id().value
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.response = {
        data: {},
      }
    }

    if (!error.response.data) {
      error.response.data = {}
    }

    return Promise.reject(error)
  },
)
