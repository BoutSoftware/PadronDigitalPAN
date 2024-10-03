import { Visor_User } from "@prisma/client";

export const getSubCoors = async (onlyFree?: boolean) => {
  const url = onlyFree ? `/dashboard/api/visor/coordinators?onlyFree=${onlyFree}` : "/dashboard/api/visor/coordinators";
  const response = await fetch(url);
  const body = await response.json();
  return (body.data as Visor_User[]);
};

export const getTechnicals = async (onlyFree?: boolean) => {
  const url = onlyFree ? `/dashboard/api/visor/technicals?onlyFree=${onlyFree}` : "/dashboard/api/visor/technicals";
  const response = await fetch(url);
  const body = await response.json();
  return (body.data as Visor_User[]);
};