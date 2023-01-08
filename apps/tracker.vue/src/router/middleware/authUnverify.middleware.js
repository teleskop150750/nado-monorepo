import { storeToRefs } from 'pinia'

import { useUserStore } from '../../store/user.js'

export default function unverify({ next }) {
  const userStore = useUserStore()
  const { isVerify } = storeToRefs(userStore)

  if (!userStore.check().value) {
    next({ name: 'login' })
  } else if (isVerify.value) {
    next({ name: 'home' })
  } else {
    next()
  }
}
