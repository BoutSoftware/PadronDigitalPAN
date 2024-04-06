import { ModuleName, modulesList } from "@/configs/roles";

export function nAccesses(roles: { module: string, role: string | null }[]) {
  return roles.filter((role) => role.role !== null).length;
}

export function parseUserRoles(roles: { module: string, role: string | null }[], isSuperAdmin: boolean = false) {
  const userRoles = {} as { [key in ModuleName]: string | null };

  modulesList.forEach((module) => {
    const moduleName = module.id;
    const role = roles.find((role) => role.module === moduleName)?.role || null;

    userRoles[moduleName] = isSuperAdmin ? "Admin" : role;
  });

  return userRoles;
}