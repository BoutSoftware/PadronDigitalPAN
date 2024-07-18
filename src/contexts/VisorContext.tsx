"use client";
// "use server";

import { createContext, useContext, useEffect, useState } from "react";

import { VisorUserContext } from "@/app/dashboard/api/visor/users/userContext/route";
import { usePathname, useRouter } from "next/navigation";
import { isAuxiliar, isSubcoordinadorWaterFall, isTeamMember, isAuxiliarWaterFall } from "@/configs/userGroups/visorUserGroups";
import { authContext } from "./AuthContext";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookies";

interface VisorContext {
  currentVisorUser?: VisorUserContext;
  isAdmin?: boolean;
  getData: (padronID: string) => void;
}

export const visorContext = createContext<VisorContext>({
  currentVisorUser: undefined,
  isAdmin: false,
  getData: () => { },
});

// create array of paths that require admin access
const defaultAdminPath = "/dashboard/visor/people";
const adminPaths = [
  /\/dashboard\/visor/,
];

// default coordinator patfh
const defaultCoordinatorPath = "/dashboard/visor/people";
const coordinatorPaths = [
  /\/dashboard\/visor/,
];

// default auxiliar path
const defaultAuxiliarPath = "/dashboard/visor/teams";
const auxiliarPaths = [
  /\/dashboard\/visor\/teams/,
  /\/dashboard\/visor\/table/,
  /\/dashboard\/visor\/map/,
];

const defaultTeamMemberPath = (teamId: string) => `/dashboard/visor/teams/${teamId}`;
const teamMemberPaths = [
  /\/dashboard\/visor\/teams\/[a-zA-Z0-9]+/,
];


export const useVisor = () => useContext(visorContext);

export const VisorProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentVisorUser, setCurrentVisorUser] = useState<VisorUserContext>();
  const router = useRouter();
  const pathname = usePathname();

  const { currentUser } = useContext(authContext);

  useEffect(() => {
    const storedToken = localStorage.getItem("visorToken");
    if (storedToken && currentVisorUser) {
      
      // Routes Protection
      if (currentVisorUser.isAdmin) {
        if (!adminPaths.some((path) => pathname.match(path))){
          router.push(defaultAdminPath);
        }
        return;
      } else if (isAuxiliar(currentVisorUser.title) && !auxiliarPaths.some((path) => pathname.match(path))) {
        router.push(defaultAuxiliarPath);
      } else if (isSubcoordinadorWaterFall(currentVisorUser.title) && !coordinatorPaths.some((path) => pathname.match(path))) {
        router.push(defaultCoordinatorPath);
      } else if (isTeamMember(currentVisorUser.title) && currentVisorUser.team && !teamMemberPaths.some((path) => pathname.match(path))) {
        router.push(defaultTeamMemberPath(currentVisorUser.team.id));
      }
    } else if (currentUser && currentUser.id) {
      getData(currentUser.id);
    }
  }, [pathname, currentVisorUser]);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      deleteCookie("visorToken");
      localStorage.removeItem("visorToken");
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        deleteCookie("visorToken");
        localStorage.removeItem("visorToken");
      });
    };
  }, []);

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