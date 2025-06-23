// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
  user: {
    _id: number;
    name: string;
    email: string;
    role: string;
    phoneNo: number;
    country: string;
  };
}

interface AuthContextType {
  userInfo: User | null;
  isLoggedIn: boolean;
  loginCheck: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginCheck = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/users/me", {
        withCredentials: true,
      });

      setUserInfo(res.data);
      setIsLoggedIn(true);
    } catch (err) {
      setUserInfo(null);
      setIsLoggedIn(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:3000/api/v1/users/logout", {
        withCredentials: true,
      });
      setUserInfo(null);
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    loginCheck();
  }, []);

  console.log(userInfo);

  return (
    <AuthContext.Provider value={{ userInfo, isLoggedIn, loginCheck, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
