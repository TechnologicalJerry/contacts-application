import type { User, LoginCredentials, RegisterCredentials, AuthTokens } from '~/types/user'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:5050'

  const accessToken = useCookie<string | null>('access_token', { maxAge: 60 * 60 * 24 * 7 })
  const refreshToken = useCookie<string | null>('refresh_token', { maxAge: 60 * 60 * 24 * 30 })
  const user = useState<User | null>('auth_user', () => null)
  const isAuthenticated = computed(() => !!accessToken.value)
  const authError = useState<string | null>('auth_error', () => null)

  const parseJwt = (token: string): any => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch {
      return null
    }
  }

  const initUserFromToken = () => {
    if (accessToken.value && !user.value) {
      const decoded = parseJwt(accessToken.value)
      if (decoded && decoded.email) {
        user.value = {
          _id: decoded._id || decoded.id,
          email: decoded.email,
          name: decoded.name || decoded.email.split('@')[0],
        }
      }
    }
  }

  const authFetch = async <T = any>(endpoint: string, options: any = {}): Promise<T> => {
    authError.value = null
    const headers: Record<string, string> = {
      ...(options.headers || {}),
    }

    if (accessToken.value) {
      headers['Authorization'] = `Bearer ${accessToken.value}`
    }
    if (refreshToken.value) {
      headers['x-refresh'] = refreshToken.value
    }

    try {
      const response = await $fetch.raw<T>(`${apiBase}${endpoint}`, {
        ...options,
        headers,
      })

      // Check if new access token was issued via header
      const newAccessToken = response.headers.get('x-access-token')
      if (newAccessToken) {
        accessToken.value = newAccessToken
      }

      return response._data as T
    } catch (err: any) {
      if (err?.status === 401 || err?.status === 403) {
        // Clear invalid tokens
        accessToken.value = null
        refreshToken.value = null
        user.value = null
        navigateTo('/login')
      }
      throw err
    }
  }

  const login = async (credentials: LoginCredentials) => {
    authError.value = null
    try {
      const res = await $fetch<AuthTokens>(`${apiBase}/api/sessions`, {
        method: 'POST',
        body: credentials,
      })

      accessToken.value = res.accessToken
      refreshToken.value = res.refreshToken

      const decoded = parseJwt(res.accessToken)
      if (decoded) {
        user.value = {
          _id: decoded._id || decoded.id,
          email: decoded.email || credentials.email,
          name: decoded.name || credentials.email.split('@')[0],
        }
      }

      return res
    } catch (err: any) {
      authError.value = err?.data?.message || err?.data || 'Invalid email or password'
      throw err
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    authError.value = null
    try {
      await $fetch(`${apiBase}/api/users`, {
        method: 'POST',
        body: credentials,
      })

      // Automatically login after successful registration
      return await login({
        email: credentials.email,
        password: credentials.password,
      })
    } catch (err: any) {
      authError.value = err?.data?.message || err?.data || 'Failed to register account'
      throw err
    }
  }

  const logout = async () => {
    try {
      if (accessToken.value) {
        await authFetch('/api/sessions', { method: 'DELETE' })
      }
    } catch {
      // Ignore logout API failure
    } finally {
      accessToken.value = null
      refreshToken.value = null
      user.value = null
      navigateTo('/login')
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    authError,
    initUserFromToken,
    authFetch,
    login,
    register,
    logout,
  }
}
