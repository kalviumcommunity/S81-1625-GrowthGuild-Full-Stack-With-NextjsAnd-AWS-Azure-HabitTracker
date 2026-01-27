"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

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
  login: (token: string) => void;
  logout: () => void;
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

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        // Decode JWT to get user info (without verification - that's done server-side)
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        
        // Check if token is expired
        if (payload.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser({
            id: payload.id,
            email: payload.email,
            role: payload.role,
          });
        } else {
          // Token expired, clear it
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
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

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    
    try {
      const payload = JSON.parse(atob(newToken.split(".")[1]));
      setUser({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
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
