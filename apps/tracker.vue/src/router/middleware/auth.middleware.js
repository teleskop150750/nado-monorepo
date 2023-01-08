import { useUserStore } from '../../store/user.js'

export default function auth({ next }) {
  const userStore = useUserStore()

  if (!userStore.check().value) {
    next({ name: 'login' })
  } else {
    next()
  }
}
