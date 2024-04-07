import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { UserRoles, modulesList } from "@/configs/roles";

export default function Roles({ userRoles }: { userRoles: UserRoles }) {
  const [currentUserRoles, setCurrentUserRoles] = React.useState<UserRoles>(userRoles);
    
  const modules = modulesList;

  const handleRoleSelectionChange = (moduleId: string, role: string) => {
    setCurrentUserRoles({
      ...currentUserRoles,
      [moduleId]: role,
    });
  };

  return (
    <>
      {modules.map((module) => (
        <div key={module.id} className="flex flex-row justify-between items-center px-4">
          {/* Name of the module */}
          <h1>{`Modulo: ${module.name}`}</h1>
          {/* Select options for this specific module */}
          <Select
            key={module.id}
            aria-label="Select role"
            selectedKeys={[currentUserRoles[module.id] || "-"]}
            onChange={
              (e) => handleRoleSelectionChange(module.id, e.target.value)
            }
            className="max-w-28"
            disabledKeys={"-"}
          >
            {module.roles.map((role) => (
              <SelectItem key={role || "-"} value={role?.toString()}>
                {`${role || "-"}`}
              </SelectItem>
            ))}
          </Select>
        </div>
      ))}
    </>
  );
}