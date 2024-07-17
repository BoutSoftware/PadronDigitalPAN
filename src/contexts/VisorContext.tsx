"use client";
// "use server";

import { createContext, useContext, useEffect, useState } from "react";

import { VisorUserContext } from "@/app/dashboard/api/visor/users/userContext/route";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookies";
import { authContext } from "./AuthContext";
import { isAuxiliarWaterFall } from "@/configs/userGroups/visorUserGroups";

interface VisorContext {
  currentVisorUser?: VisorUserContext;
  isAdmin?: boolean;
  getData: (padronID: string) => void;
}

export const visorContext = createContext<VisorContext>({
  currentVisorUser: undefined,
  isAdmin: false,
  getData: () => {},
});

export const useVisor = () => useContext(visorContext);

export const VisorProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentVisorUser, setCurrentVisorUser] = useState<VisorUserContext>();
  const { currentUser } = useContext(authContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {

    console.log("pathname: ", pathname);
    
    const storedToken = localStorage.getItem("visorToken");

    if (storedToken) {
      if (currentVisorUser) {
        // Aqui se esta protegiendo /dashboard/visor/people
        if (pathname === "/dashboard/visor/people") {
          if (!isAuxiliarWaterFall(currentVisorUser.title)) router.push("/visor/base") ;
        }

      } else {
        getData(currentUser?.id as string);
      }
    } else {
      getData(currentUser?.id as string);
    }
  }, [pathname]);

  const getData = async (padronID: string) => {
    console.log("getting data for: ", padronID);
    
    const user = await fetch("/dashboard/api/visor/users/userContext", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: padronID }),
    });

    const userBody = await user.json();

    if (userBody.code !== "OK") {
      console.log("Error getting user: ", userBody.message);
      
      // localStorage.removeItem("visorUser");
      // cookies().delete("visorUser");
      deleteCookie("visorToken");
      localStorage.removeItem("visorToken");

      router.push("/dashboard/");
      return;
    }

    setCookie("visorToken", userBody.data.token);
    localStorage.setItem("visorToken", userBody.data.token);
    setCurrentVisorUser(userBody.data as VisorUserContext);
    console.log("Current user: ", userBody.data);
  };

  return (
    <visorContext.Provider
      value={{
        currentVisorUser,
        isAdmin: currentVisorUser?.isAdmin,
        getData,
      }}
    >
      {children}
    </visorContext.Provider>
  );
};