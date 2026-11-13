'use client';

import React from 'react';
import { LoginResponse } from '../../schemas/sigin-schemas';
import { AuthService } from '../connection/AuthService';
import { useResources } from './resource-providers';

type AuthContextProps = {
  currentUser: LoginResponse | null;
  logout: () => Promise<void>;
  authenticate: boolean;
};

type AuthProviderProps = React.PropsWithChildren;

const AuthContext = React.createContext<AuthContextProps | undefined>(
  undefined,
);

export default function AuthProvider({ children }: AuthProviderProps) {
  const { resources } = useResources();
  const [currentUser, setCurrentUser] = React.useState<LoginResponse | null>(
    null,
  );
  const [authenticate, setAuthenticate] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      if (resources.length === 0) return;

      const authResource = resources.find(
        (r) =>
          r.name === 'credentials' &&
          r.method.includes('GET') &&
          r.endpoint.includes('me'),
      );

      if (!authResource) {
        setCurrentUser(null);
        setAuthenticate(false);
        return;
      }
      try {
        const authService = new AuthService(authResource.endpoint);
        const response = await authService.me();
        setCurrentUser(response.dados ?? null);
        setAuthenticate(true);
      } catch (error) {
        console.error(error);
        setCurrentUser(null);
        setAuthenticate(false);
      }
    })();
  }, [resources]);

  const logout = async () => {
    const authResource = resources.find(
      (r) => r.name === 'credentials' && r.method.includes('DELETE'),
    );
    if (!authResource) {
      setCurrentUser(null);
      setAuthenticate(false);
      return;
    }
    try {
      const authService = new AuthService(authResource.endpoint);
      await authService.logout();
      setCurrentUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
      setCurrentUser(null);
      setAuthenticate(false);
    }
  };
  return (
    <AuthContext.Provider value={{ currentUser, logout, authenticate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used inside of a AuthProvider');
  }

  return context;
}
