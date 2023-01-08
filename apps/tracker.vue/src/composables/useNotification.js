import { ElNotification } from 'element-plus'

export const useNotification = () => {
  const open = (payload) => {
    ElNotification(payload)
  }

  return { open }
}
