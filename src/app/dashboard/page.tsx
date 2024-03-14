"use client";

import { UserRoles, VisRole } from "@/configs/roles";
import { hasPermission } from "@/utils";
import { Button, CircularProgress } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface User {
  id: number;
  isSuperAdmin: boolean;
  username: string;
  name: string;
  // roles: { [key: string]: string };
  roles: UserRoles; // { vis: "Admin", wha: "User" }
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[] | null>(null);

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
                  <span className="font-bold">{user.username}</span>

                  {user.isSuperAdmin && <span className="material-symbols-outlined text-amber-300 filled small">star</span>}
                </div>

                <h3>Roles:</h3>
                <ul className="ml-4">
                  {Object.entries(user.roles).map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                  ))}
                </ul>

                <h3>
                  Tiene Permiso Admin en Visor:

                  {hasPermission<VisRole>(user.roles.vis, ["Admin"]) ?
                    <span className="material-symbols-outlined text-green-300 small">check</span> :
                    <span className="material-symbols-outlined text-red-300 small">close</span>
                  }
                </h3>

                <h3>
                  Tiene Permiso User en Visor:

                  {hasPermission<VisRole>(user.roles.vis, ["User"]) ?
                    <span className="material-symbols-outlined text-green-300 small">check</span> :
                    <span className="material-symbols-outlined text-red-300 small">close</span>
                  }
                </h3>

                <h3>
                  Tiene Permiso Viewer en Visor:

                  {hasPermission<VisRole>(user.roles.vis, ["Viewer"]) ?
                    <span className="material-symbols-outlined text-green-300 small">check</span> :
                    <span className="material-symbols-outlined text-red-300 small">close</span>
                  }
                  <Button isDisabled={hasPermission<VisRole>(user.roles.vis, ["Viewer"])}>Boton</Button>
                </h3>
              </li>
            ))}
          </ul>
        }

        {!users && <CircularProgress aria-label="Cargando usuarios" />}
      </div>
    </main>
  );
}