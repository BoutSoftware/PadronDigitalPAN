"use client";

import { ThemeContext } from "@/contexts/ThemeProvider";
import { hasPermission } from "@/utils";
import { Button, CircularProgress, Switch } from "@nextui-org/react";
import { UserRoles, VisorRoles } from "@prisma/client";
import { useContext, useEffect, useState } from "react";

interface User {
  id: number;
  isSuperAdmin: boolean;
  username: string;
  name: string;
  roles: UserRoles;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const fetchUsers = async () => {
    const response = await fetch("/dashboard/api/users");
    const resBody = await response.json();

    if (resBody.code !== "OK")
      return alert("Error al obtener los usuarios");

    console.log(resBody);
    setUsers(resBody.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="flex-1 p-4">
      <h1 className="text-2xl font-bold">
        Pagina inicial para los Funcionarios
      </h1>

      <div className="mt-4">
        <h2 className="text-xl font-bold">Usuarios</h2>
        {users &&
          <ul>
            {users.map((user) => (
              <li key={user.id} className="p-4">
                <div className="flex items-center justify-start gap-1">
                  <span className="font-bold">{user.name} ({user.username})</span>

                  {user.isSuperAdmin && <span className="material-symbols-outlined text-amber-300 icon-filled icon-sm">star</span>}
                </div>

                <h3>Roles:</h3>
                <ul className="ml-4">
                  {Object.entries(user.roles).map(([key, value]) => (
                    <li key={key}>{key}: {value || "Sin Permiso"}</li>
                  ))}
                </ul>

                <h3>
                  Tiene Permiso Admin en Visor:

                  {hasPermission<VisorRoles>(user.roles.visor, ["Admin"]) ?
                    <span className="material-symbols-outlined text-green-300 icon-sm">check</span> :
                    <span className="material-symbols-outlined text-red-300 icon-sm h-full mt-1 ">close</span>
                  }
                </h3>

                <h3>
                  Tiene Permiso User en Visor:

                  {hasPermission<VisorRoles>(user.roles.visor, ["User",]) ?
                    <span className="material-symbols-outlined text-green-300 icon-sm">check</span> :
                    <span className="material-symbols-outlined text-red-300 icon-sm">close</span>
                  }
                </h3>

                <h3>
                  Tiene Permiso Viewer en Visor:

                  {hasPermission<VisorRoles>(user.roles.visor, ["Viewer"]) ?
                    <span className="material-symbols-outlined text-green-300 icon-sm">check</span> :
                    <span className="material-symbols-outlined text-red-300 icon-sm">close</span>
                  }
                </h3>

                <Button isDisabled={!hasPermission<VisorRoles>(user.roles.visor, ["Viewer"])} onPress={() => alert("Boton presionado")} className="bg-fuchsia-500">
                  Boton para Viewer
                </Button>
              </li>
            ))}
          </ul>
        }

        <Switch
          isSelected={theme === "dark"}
          // size="lg"
          onChange={toggleTheme}
          endContent={<span>dark_mode</span>}
          startContent={<span>light_mode</span>}
          classNames={{
            endContent: "flex items-center material-symbols-outlined icon-xs",
            startContent: "flex items-center material-symbols-outlined icon-xs",
            thumbIcon: "flex items-center material-symbols-outlined icon-xs",
            base: "fixed top-4 right-4",
          }}
        />

        {!users && <CircularProgress aria-label="Cargando usuarios" />}
      </div>
    </main>
  );
}