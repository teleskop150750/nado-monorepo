import { ElLoading } from 'element-plus'

export const useLoading = () => {
  let loading = null

  const open = () => {
    if (!loading) {
      loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'hsl(234deg 46% 7% / 27%)',
      })
    }
  }

  const close = () => {
    if (loading) {
      loading.close()
      loading = null
    }
  }

  return {
    open,
    close,
  }
}
