"use client";

import { UserRoles } from "@/configs/roles";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserInfo {
  id: string;
  username: string;
  name: string;
  token: string;
  userRoles: UserRoles;
}

interface AuthContext {
  currentUser?: UserInfo;
  login: (token: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

const authContext = createContext<AuthContext>({
  currentUser: undefined,
  login: () => { },
  logout: () => { },
  isLoggedIn: () => false,
});

export const useAuth = () => useContext(authContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setUser] = useState<UserInfo>();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log(pathname);

    if (storedToken) {
      console.log("what");
      
      if (currentUser) {
        // Routes Protection
        if (pathname === "/dashboard/login") router.push("/dashboard/base");

        // TODO: Logic for reedirecting users based on their roles
      } else {
        login(storedToken);
      }
    } else {
      if (pathname !== "/dashboard/login") router.push("/dashboard/login");
    }
  }, [pathname, currentUser]);


  const login = async (token: string) => {
    const res = await fetch(`api/login?token=${token}`, { method: "GET" });
    const resBody = await res.json();

    if (resBody.code !== "OK") {
      return logout();
    }

    const { id, username, roles, Person } = resBody.data;
    setUser({
      id: id,
      username: username,
      userRoles: roles,
      name: Person.name,
      token,
    });
  };

  const logout = () => {
    setUser(undefined);
    localStorage.removeItem("token");
    router.push("/dashboard/login");
  };

  const isLoggedIn = () => {
    return !!currentUser;
  };

  return (
    <authContext.Provider value={{ currentUser, login, logout, isLoggedIn }}>
      {children}
    </authContext.Provider>
  );
};
