import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { logout as logoutRequest } from './authApi';
import { AuthContext } from './authContext';
import { clearStoredToken, getStoredToken, storeToken } from './session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getStoredToken);

  const signIn = useCallback((newToken: string) => {
    storeToken(newToken);
    setToken(newToken);
  }, []);

  const clearSession = useCallback(() => {
    clearStoredToken();
    setToken(null);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // The local session is dropped either way.
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({ isAuthenticated: token !== null, signIn, signOut, clearSession }),
    [token, signIn, signOut, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
