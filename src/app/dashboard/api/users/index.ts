import { ModuleName, modulesList } from "@/configs/roles";

export function nAccesses(object: {
  visor: string | null;
  whats: string | null;
}) {
  return Object.values(object).filter((role) => role !== null).length;
}

export function nAccessesFront(roles: { module: string, role: string | null }[]) {
  return roles.filter((role) => role.role !== null).length;
}

export function parseUserRoles(roles: { module: string, role: string | null }[], isSuperAdmin: boolean = false) {
  const userRoles = {} as { [key in ModuleName]: string | null };

  modulesList.forEach((module) => {
    const moduleName = module.id;
    const role = isSuperAdmin ? "Admin" : roles.find((role) => role.module === moduleName)?.role || null;

    userRoles[moduleName] = role;
  });

  roles.forEach((module) => {
    const moduleName = module.module as ModuleName;
    const role = isSuperAdmin ? "Admin" : module.role;

    userRoles[moduleName] = role;
  });

  return userRoles;
}