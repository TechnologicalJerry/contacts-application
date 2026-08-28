export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, initUserFromToken } = useAuth()
  initUserFromToken()

  if (!isAuthenticated.value && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
