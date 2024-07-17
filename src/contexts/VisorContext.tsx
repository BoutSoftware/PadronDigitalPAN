"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { VisorUserContext } from "@/app/dashboard/api/visor/users/userContext/route";
import { usePathname, useRouter } from "next/navigation";
import { isAuxiliar, isSubcoordinadorWaterFall, isTeamMember } from "@/configs/userGroups/visorUserGroups";
import { authContext } from "./AuthContext";

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

// default team member path"/dashboard/visor/teams/:teamId";
const defaultTeamMemberPath = "/dashboard/visor/teams/:teamId";


export const useVisor = () => useContext(visorContext);

export const VisorProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentVisorUser, setCurrentVisorUser] = useState<VisorUserContext>();
  const router = useRouter();
  const pathname = usePathname();

  const { currentUser } = useContext(authContext);

  useEffect(() => {
    const storedToken = localStorage.getItem("visorUser");
    if (storedToken) {
      if (currentVisorUser) {
        // Routes Protection
        if (isSubcoordinadorWaterFall(currentVisorUser.title)) {
          console.log("pase aqui");
          router.push("/dashboard/visor/people");
        }
        else {
          if (isAuxiliar(currentVisorUser.title)) {
            router.push("/dashboard/visor/teams");
          }
          else if (isTeamMember(currentVisorUser.title)) {
            router.push(`/dashboard/visor/teams/${currentVisorUser.team?.id}`);
          }

          if (pathname.startsWith("/dashboard/visor/people") && !isSubcoordinadorWaterFall(currentVisorUser.title)) {
            if (isAuxiliar(currentVisorUser.title)) {
              router.push("/dashboard/visor/teams");
            } else {
              router.push(`/dashboard/visor/teams/${currentVisorUser.team?.id}`);
            }
          }

          if (pathname !== `/dashboard/visor/teams/${currentVisorUser.team?.id}` && isTeamMember(currentVisorUser.title)) {
            router.push(`/dashboard/visor/teams/${currentVisorUser.team?.id}`);
          }
        } 
      } else {
        if (currentUser && currentUser.id) {
          getData(currentUser.id);
        }
      }
    } else {
      if (currentUser && currentUser.id) {
        getData(currentUser.id);
      }
      if (pathname.startsWith("/dashboard/visor") && !storedToken) {
        router.push("/dashboard/base");
      }
    }
  }, [pathname, currentVisorUser, currentUser]);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("visorUser");
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        localStorage.removeItem("visorUser");
      });
    };
  }, []);

  const getData = async (padronID: string) => {
    const user = await fetch("/dashboard/api/visor/users/userContext", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: padronID }),
    });

    const userBody = await user.json();

    if (userBody.code !== "OK") {
      localStorage.removeItem("visorUser");
      return;
    }

    localStorage.setItem("visorUser", "true");
    setCurrentVisorUser(userBody.data as VisorUserContext);
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