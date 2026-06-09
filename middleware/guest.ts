export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (!authStore.loggedIn) {
    await authStore.fetchProfile()
  }

  if (authStore.loggedIn) {
    return navigateTo('/admin')
  }
})
