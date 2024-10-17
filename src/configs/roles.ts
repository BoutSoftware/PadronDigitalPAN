export type TerritorialRole = "Admin" | "Staff" | "User" | null;
export type WhatsRole = "Admin" | "User" | "Sender" | null;

export type ModuleId = "visor" | "whats";

// What the server will send
export type UserRoles = {
  [key in ModuleId]: TerritorialRole | WhatsRole | null;
  // territorial: TerritorialRole;
  // whats: WhatsRole;
}

// List of modules and roles
export const modulesList: {id: ModuleId, name: string, icon: string, roles: (TerritorialRole | WhatsRole)[]}[] = [
  {
    id: "visor",
    name: "Territorial",
    icon: "map",
    roles: ["Admin", "Staff", "User", null] as TerritorialRole[]
  },
  {
    id: "whats",
    name: "Whatsapp",
    icon: "chat",
    roles: ["Admin", "User", "Sender", null] as WhatsRole[]
  },
] as const;