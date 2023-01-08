import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const userId = computed(() => (user.value && user.value.id ? user.value.id : null))
  const isLogin = computed(() => !!user.value)
  const isVerify = computed(() => Boolean(user.value) && Boolean(user.value.verify))

  function getUser() {
    if (!user.value) {
      user.value = getUserFromLocalStorage()
    }

    return user
  }

  function id() {
    getUser()

    return userId
  }

  function check() {
    getUser()

    return isLogin
  }

  function login(newUser) {
    user.value = newUser
    saveUserInLocalStorage(newUser)
  }

  function logout() {
    deleteUserInLocalStorage()
    user.value = null
  }

  function verify() {
    if (user.value) {
      updateUser({ verify: true })
    }
  }

  function updateUser(payload) {
    user.value = { ...user.value, ...payload }
    saveUserInLocalStorage(user.value)
  }

  function saveUserInLocalStorage(newUser) {
    window.localStorage.setItem('user', JSON.stringify(newUser))
  }

  function deleteUserInLocalStorage() {
    window.localStorage.removeItem('user')
  }

  function getUserFromLocalStorage() {
    try {
      const data = window.localStorage.getItem('user') ?? null

      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  return {
    id,
    check,
    user,
    getUser,
    login,
    logout,
    isVerify,
    verify,
    updateUser,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
