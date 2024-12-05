"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button, Divider, Image, Switch } from "@nextui-org/react";
import Roles from "@/components/Roles";
import { User, Person } from "@prisma/client";
import { UserRoles } from "@/configs/roles";
import ChangePasswordModal from "@/components/ChangePasswordModal";

export default function IndividualUserPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [user, setUser] = useState<User & { Person: Person, activeModules: number, roles: UserRoles } | null>(null);
  const fullName = `${user?.Person.name} ${user?.Person.fatherLastName} ${user?.Person.motherLastName}`;

  const getUser = async () => {
    const resBody = await (await fetch(`/dashboard/api/users/${id}`)).json();

    if (resBody.code !== "OK") {
      alert("Error al cargar el usuario");
    }
    setUser(resBody.data);
  };

  // Function to format phone number
  const formatPhone = (phone: string) => {
    const cleaned = ("" + phone).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return match[1] + " " + match[2] + " " + match[3];
    }
    return null;
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-grow flex-col p-8">
      {user &&
        <>
          <Header
            title={
              <>
                {fullName}
                {user && user.isSuperAdmin && (
                  <span className="material-symbols-outlined icon-filled text-warning-500 px-2 icon-lg">
                    star
                  </span>
                )}
              </>
            }
          />


          <main id="main" className="mt-4">
            <div id="userInfoContainer" className="flex flex-row mt-8 gap-8">
              <div id="image" className="w-48 h-48">
                {user.Person.photoURL ?
                  <Image src={user.Person.photoURL} alt="Foto de perfil" className="w-full object-cover aspect-square" />
                  : // If user has no photo, show initials
                  <div className="w-full h-full aspect-square bg-blue-200 flex items-center justify-center rounded-lg">
                    <span className="p-2 text-5xl">
                      {fullName.split(" ").map((word) => word[0]).join("").toUpperCase()}
                    </span>
                  </div>
                }
              </div>
              <div id="userInfo" className="flex flex-row gap-x-8">
                <div className="flex flex-col gap-4">
                  <p><strong>Nombre:</strong> {fullName} </p>
                  <p><strong>Número telefónico:</strong> {formatPhone(user.Person.phone?.number || "")}</p>
                  <p><strong>CURP:</strong> {user.Person.curp}</p>
                  <div className="mt-8">
                    <ChangePasswordModal userId={id} />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <p><strong>Modulos activos:</strong> {user.activeModules}</p>
                  <p><strong>Estado:</strong> {user.active ? "Activo" : "Inactivo"}</p>
                  <p><strong>Usuario:</strong> {user.username}</p>
                  <div className="mt-8">
                    {/* <Button
                      startContent={<span className="material-symbols-outlined">account_tree</span>}
                      className="bg-content1 drop-shadow-md"
                    >
                      Llevar a la activacion
                    </Button> */}

                    <SuperAdminSwitch isSuperAdmin={user.isSuperAdmin} setIsSuperAdmin={(value) => setUser({ ...user, isSuperAdmin: value })} userId={id} />
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-10 max-w-5xl" />

            <div id="roles" className="flex flex-col p-8 rounded-xl max-w-4xl border border-divider shadow-lg">
              <h1 className="text-4xl">Roles</h1>
              <div className="flex flex-col gap-6 mt-4">
                <Roles userRoles={user.roles} userId={id} />
              </div>
            </div>
          </main>
        </>
      }
    </div>

  );
}

function SuperAdminSwitch({ isSuperAdmin, setIsSuperAdmin, userId }: { isSuperAdmin: boolean, setIsSuperAdmin: (value: boolean) => void, userId: string }) {
  const [superAdmin, setSuperAdmin] = useState(isSuperAdmin);

  const toggleSuperAdmin = async () => {
    const resBody = await fetch(`/dashboard/api/users/${userId}/superadmin`, {
      method: "PATCH",
      body: JSON.stringify({ isSuperAdmin: !superAdmin }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (resBody.code !== "OK") {
      alert("Error al cambiar el estado del superadmin");
      return;
    }

    setSuperAdmin(!superAdmin);
    setIsSuperAdmin(!superAdmin);
  };

  return (
    <div className="flex items-center gap-4">
      <Switch isSelected={superAdmin} onClick={toggleSuperAdmin} color="warning" >
        {superAdmin ? "Quitar" : "Hacer"} Superadmin
      </Switch>
    </div >
  );
}