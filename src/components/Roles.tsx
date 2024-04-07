import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { UserRoles, modulesList } from "@/configs/roles";
// import { parseUserRoles } from "@/app/dashboard/api/users";

export default function Roles({ userRoles }: { userRoles: UserRoles }) {
  const [currentUserRoles, setCurrentUserRoles] = React.useState<UserRoles>(userRoles);
    
  const modules = modulesList;

  const handleRoleSelectionChange = async (moduleId: string, role: string) => {
    setCurrentUserRoles({
      ...currentUserRoles,
      [moduleId]: role,
    });

    // Send the new roles to the server
    // const resBody = await fetch(`/dashboard/api/users/${userId}/roles`, {
    //   method: "PATCH",
    //   body: JSON.stringify({
    //     module: moduleId,
    //     role,
    //   }),
    // }).then((res) => res.json());

    // if (resBody.code !== "OK") {
    //   alert("Error al modificar los roles");
    //   // Revert the changes in case of error
    //   setCurrentUserRoles(userRoles);
    //   return;
    // }
    // alert("Roles modificados correctamente");
    // // Update the user roles
    // setCurrentUserRoles(parseUserRoles(resBody.data) as UserRoles);
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