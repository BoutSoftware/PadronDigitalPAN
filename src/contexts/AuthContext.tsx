"use client";

import { UserRoles } from "@/configs/roles";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserInfo {
  id: string;
  username: string;
  name: string;
  token: string;
  // TODO: Add "profilePicture: string;" to the UserInfo interface, and implement it
  userRoles: UserRoles;
}

interface AuthContext {
  currentUser?: UserInfo;
  login: (token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

export const authContext = createContext<AuthContext>({
  currentUser: undefined,
  login: () => { },
  logout: () => { },
  isLoggedIn: false,
});

export const useAuth = () => useContext(authContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setUser] = useState<UserInfo>();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
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
    const res = await fetch(`/dashboard/api/login?token=${token}`, { method: "GET" });
    const resBody = await res.json();

    console.log(resBody);

    if (resBody.code !== "OK") {
      return logout();
    }

    const { id, username, roles, Person } = resBody.data;
    localStorage.setItem("token", token);
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

  const isLoggedIn = !!currentUser;

  return (
    <authContext.Provider value={{ currentUser, login, logout, isLoggedIn }}>
      {children}
    </authContext.Provider>
  );
};
