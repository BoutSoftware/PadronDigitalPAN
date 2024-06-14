export type VisorRole = "Admin" | "User" | "Viewer" | null;
export type WhatsRole = "Admin" | "User" | "Sender" | null;

export type ModuleName = "visor" | "whats";

// What the server will send
export type UserRoles = {
  // [key in ModuleName]: VisorRole | WhatsRole;
  visor: VisorRole;
  whats: WhatsRole;
}

// List of modules and roles
export const modulesList: { id: ModuleName, name: string, roles: (UserRoles[ModuleName])[] }[] = [
  {
    id: "visor",
    name: "Visor",
    roles: ["Admin", "User", "Viewer", null] as VisorRole[]
  },
  {
    id: "whats",
    name: "Whatsapp",
    roles: ["Admin", "User", "Sender", null] as WhatsRole[]
  },
];