export type VisorRole = "Admin" | "User" | "Viewer" | null;
export type WhatsRole = "Admin" | "User" | "Sender" | null;

// What the server will send
export type UserRoles = {
  visor: VisorRole;
  whats: WhatsRole;
}

export type ModuleName = keyof UserRoles;

// List of modules and roles
export const modulesList: { id: ModuleName, name: string, roles: (UserRoles[ModuleName])[] }[] = [
  {
    id: "visor",
    name: "Visor",
    roles: ["Admin", "User", "Viewer", null]
  },
  {
    id: "whats",
    name: "Whatsapp",
    roles: ["Admin", "User", "Sender", null]
  },
];

export const rolesList: { [key in ModuleName]: (UserRoles[key])[] } = {
  visor: ["Admin", "User", "Viewer", null],
  whats: ["Admin", "User", "Sender", null],
};