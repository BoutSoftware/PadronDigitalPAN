export type VisRole = "Admin" | "User" | "Viewer" | undefined;
export type WhaRole = "Admin" | "User" | "Sender" | undefined;
export type SuperRole = "SuperAdmin" | undefined;

export interface UserRoles {
  // module: roleType
  vis: VisRole;
  wha: WhaRole;
  xd: "Admin" | "User" | "Viewer" | "Sender" | "SuperAdmin" | undefined;
  usu: "Admin" | "User" | undefined;
  sup?: SuperRole;
}

export type Modules = keyof UserRoles;

export const modulesList: { [key in keyof UserRoles]: string } = {
  vis: "Visor",
  wha: "Whatsapp",
  xd: "Xtreme Dashboard",
  usu: "Usuarios",
} as const;

export const rolesList: { [key in keyof UserRoles]: (UserRoles[key])[] } = {
  vis: ["Admin", "User", "Viewer", undefined],
  wha: ["Admin", "User", "Sender", undefined],
  xd: ["Admin", "User", "Viewer", "Sender", "SuperAdmin", undefined],
  usu: ["Admin", "User", undefined],
};