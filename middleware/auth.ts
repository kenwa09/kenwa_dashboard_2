export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.loggedIn) {
    const profile = await authStore.fetchProfile()
    if (!profile) {
      const redirect = encodeURIComponent(to.fullPath)
      return navigateTo(`/login?redirect=${redirect}`)
    }
  }
})
