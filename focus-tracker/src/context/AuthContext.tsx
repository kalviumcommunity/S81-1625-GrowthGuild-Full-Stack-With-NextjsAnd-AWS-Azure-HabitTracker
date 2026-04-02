"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  clearAccessToken,
  refreshAccessToken,
  setAccessToken,
  subscribeToTokenChanges,
} from "@/lib/tokenManager";

/**
 * User interface representing authenticated user data
 */
export interface User {
  id: number;
  email: string;
  role: string;
}

/**
 * AuthContext type definition
 */
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Pages that don't require authentication
const publicPaths = ["/", "/login", "/signup", "/about"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const parseToken = (rawToken: string) => {
    const payload = JSON.parse(atob(rawToken.split(".")[1]));
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      exp: payload.exp,
    };
  };

  // Sync React state with in-memory token manager
  useEffect(() => {
    const unsubscribe = subscribeToTokenChanges((nextToken) => {
      if (!nextToken) {
        setToken(null);
        setUser(null);
        return;
      }

      try {
        const payload = parseToken(nextToken);

        if (payload.exp * 1000 <= Date.now()) {
          clearAccessToken();
          return;
        }

        setToken(nextToken);
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role,
        });
      } catch (error) {
        console.error("Invalid token:", error);
        clearAccessToken();
      }
    });

    return unsubscribe;
  }, []);

  // Bootstrap session using refresh token cookie
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const newToken = await refreshAccessToken();
        if (mounted && newToken) {
          setAccessToken(newToken);
        }
      } catch (error) {
        console.error("Session bootstrap failed:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Protect routes
  useEffect(() => {
    if (!isLoading) {
      const isPublicPath = publicPaths.includes(pathname);
      
      if (!token && !isPublicPath) {
        // Not authenticated and trying to access protected route
        router.push("/login?redirect=" + encodeURIComponent(pathname));
      }
    }
  }, [token, pathname, isLoading, router]);

  const login = async (newToken: string) => {
    setAccessToken(newToken);

    try {
      const payload = parseToken(newToken);
      setUser({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    clearAccessToken();
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
