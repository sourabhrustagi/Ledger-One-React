import { createContext } from 'react';

export interface AuthContextValue {
  isAuthenticated: boolean;
  signIn: (token: string) => void;
  /** Tells the server, then always drops the local session. */
  signOut: () => Promise<void>;
  /** Drops the local session only (e.g. the server rejected the token). */
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
