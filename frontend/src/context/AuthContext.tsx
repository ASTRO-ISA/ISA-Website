import React, { createContext, useContext, useMemo } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface User {
  user: {
    _id: number;
    name: string;
    email: string;
    role: string;
    phoneNo: number;
    country: string;
    avatar: string;
    createdAt: string;
  };
}

interface AuthContextType {
  userInfo: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  refetchUser: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchCurrentUser = async (): Promise<User> => {
  const res = await axios.get("http://localhost:3000/api/v1/users/me", {
    withCredentials: true,
  });
  return res.data;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  const {
    data: userInfo,
    isSuccess,
    refetch,
  } = useQuery<User>({
    queryKey: ["user-info"],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  const logout = async () => {
    try {
      await axios.get("http://localhost:3000/api/v1/users/logout", {
        withCredentials: true,
      });
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const contextValue = useMemo(
    () => ({
      userInfo: userInfo ?? null,
      isLoggedIn: isSuccess && !!userInfo,
      isAdmin: userInfo?.user.role === "admin",
      refetchUser: refetch,
      logout,
    }),
    [userInfo, isSuccess, refetch]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
