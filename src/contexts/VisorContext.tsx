"use client";

import { createContext, useContext, useState } from "react";

import { VisorUserContext } from "@/app/dashboard/api/visor/users/userContext/route";

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