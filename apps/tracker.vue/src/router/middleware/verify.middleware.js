import { storeToRefs } from 'pinia'

import { useUserStore } from '../../store/user.js'

export default function verify({ next }) {
  const userStore = useUserStore()

  userStore.getUser()
  const { isVerify } = storeToRefs(userStore)

  if (!isVerify.value) {
    next({ name: 'verification-notification' })
  } else {
    next()
  }
}
