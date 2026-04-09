import { createContext, useMemo, useEffect } from 'react'
import { updatePushToken } from '../api/users'
import { auth } from '../services/auth'
import { useAuthState } from '../hooks/auth/useAuthState'
import type { UserMe } from '../types/user'
import type { GenericTag } from '../types/tag'

interface AuthContextData {
  user: UserMe | null
  isAuthenticated: boolean
  mapTags: Map<string, GenericTag>
  loading: boolean
  error: string | null
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [
    user,
    loading,
    error
  ] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const win = window as any;

      if (win.isMobileApp && win.expoPushToken) {
        if (!win.pushTokenSent) {

          // Chamando a nossa nova função da API
          updatePushToken(win.expoPushToken)
          .then(() => {
            console.log("Token do celular salvo com sucesso no banco!");
            win.pushTokenSent = true;
          })
          .catch((err: any) => {
            console.error("Erro ao salvar token de notificação:", err);
          });

        }
      }
    }
  }, [user]);

  const value = useMemo(() => {
    const map = new Map<string, GenericTag>()

    user?.userTags.forEach((tag) => {
      map.set(tag.id, tag)
    })

    return {
      user,
      isAuthenticated: !!user,
      mapTags: map,
      loading,
      error,
    }
  }, [user, loading, error])

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}