import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { UserRoles, modulesList } from "@/configs/roles";

export default function Roles({ userRoles, userId }: { userRoles: UserRoles, userId: string }) {
  const [currentUserRoles, setCurrentUserRoles] = React.useState<UserRoles>(userRoles);

  const modules = modulesList;

  const handleRoleSelectionChange = async (moduleId: string, role: string | null) => {
    setCurrentUserRoles({
      ...currentUserRoles,
      [moduleId]: role,
    });

    // if roles is "-", send null to the server
    if (role === "-") {
      role = null;
    }

    // Send the new roles to the server
    const resBody = await fetch(`/dashboard/api/users/${userId}/roles`, {
      method: "PATCH",
      body: JSON.stringify({
        module: moduleId,
        role,
      }),
    }).then((res) => res.json());

    if (resBody.code !== "OK") {
      alert("Error al modificar los roles");
      console.error({ reqBody: { module: moduleId, role }, resBody });
      // Revert the changes in case of error
      setCurrentUserRoles(userRoles);
      return;
    }
    alert("Roles modificados correctamente");
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