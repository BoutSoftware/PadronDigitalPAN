"use client";

import { UserRoles } from "@/configs/roles";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface TeamInfo {
  geoConf: object
  name: string
}

interface UserInfo {
  role: string;
  title: string;
  isAdmin: boolean;
  team?: TeamInfo;
}

interface VisorContext {
  currentVisorUser?: UserInfo;
}

export const visorContext = createContext<VisorContext>({
  currentVisorUser: undefined,
});

export const useAuth = () => useContext(visorContext);

export const VisorProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentVisorUser, setVisorUser] = useState<UserInfo>();
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token");

  //   if (storedToken) {
  //     if (currentVisorUser) {
  //       // Routes Protection
  //       if (pathname === "/dashboard/login") router.push("/dashboard/base");

  //       // TODO: Logic for reedirecting users based on their roles
  //     } else {
  //       login(storedToken);
  //     }
  //   } else {
  //     if (pathname !== "/dashboard/login") router.push("/dashboard/login");
  //   }
  // }, [pathname, currentVisorUser]);

  // TODO: useEffect con petición al servidor de la información del usuario actual, según el authContext

  // TODO: Listener de cambios al state, para actualizar las cookies.

  // TODO: Listener de Desmonte, para eliminar las cookies al salir del navegador

  const login = async (token: string) => {
    const res = await fetch(`/dashboard/api/login?token=${token}`, { method: "GET" });
    const resBody = await res.json();

    console.log(resBody);

    if (resBody.code !== "OK") {
      return logout();
    }

    const { id, username, roles, Person, isSuperAdmin, profilePicture } = resBody.data;
    localStorage.setItem("token", token);
    // setVisorUser({
    //   id: id,
    //   username: username,
    //   userRoles: roles,
    //   name: Person.name,
    //   profilePicture: profilePicture,
    //   isSuperAdmin: isSuperAdmin,
    //   token,
    // });
  };

  const logout = () => {
    setVisorUser(undefined);
    localStorage.removeItem("token");
    router.push("/dashboard/login");
  };

  const isLoggedIn = !!currentVisorUser;

  return (
    <visorContext.Provider value={{ currentVisorUser: currentVisorUser }}>
      {children}
    </visorContext.Provider>
  );
};
