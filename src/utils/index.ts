export function hasIncompleteFields(object: object) {
  return Object.values(object).some((value) => value === undefined || value === null);
  // return Object.entries(object).filter(([, value]) => value === undefined || value === null);
}

export function hasPermission<Role>(currentRole: Role, rolesAllowed: Role[]) {
  return rolesAllowed.includes(currentRole) || currentRole === "SuperAdmin" || currentRole === "Admin";
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}