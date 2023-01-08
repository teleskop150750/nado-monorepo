import { useUserStore } from '../../store/user.js'

export default function guest({ next }) {
  const userStore = useUserStore()

  if (!userStore.check().value) {
    next()
  } else {
    next({ name: 'home' })
  }
}
