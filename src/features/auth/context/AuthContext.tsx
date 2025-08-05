"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { UserDetail } from "../types/auth";
import { getMe, loginApi } from "../services/authService";

type AuthContextType = {
  user: UserDetail | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDetail | null>(null);

  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      const res = await loginApi(email, password);
      if (res) {
        await fetchUser();
      }
    
    } catch (err: any) {
      console.log("get Error", err)
      throw err.response
    }
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("expiryTime");
    setUser(null);
    router.push("/signin")
  };

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res);
    
    } catch (err: any) {
      setUser(null);
      throw err;
    }
  };

  useEffect(() => {
    if (!Cookies.get("accessToken")) return
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
