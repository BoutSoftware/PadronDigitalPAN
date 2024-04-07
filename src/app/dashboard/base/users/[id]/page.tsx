"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button, Divider, Image } from "@nextui-org/react";
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
  }, []);

  return (
    <div className="flex flex-grow flex-col p-8">
      {user &&
        <>
          <Header title={fullName} />

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
                    <ChangePasswordModal id={id} />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <p><strong>Modulos activos:</strong> {user.activeModules}</p>
                  <p><strong>Estado:</strong> {user.active ? "Activo" : "Inactivo"}</p>
                  <p><strong>Usuario:</strong> {user.username}</p>
                  <div className="mt-8">
                    <Button
                      startContent={<span className="material-symbols-outlined">account_tree</span>}
                      className="bg-content1 drop-shadow-md"
                    >
                      Llevar a la estructura
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-10 max-w-5xl" />

            <div id="roles" className="flex flex-col p-8 rounded-xl max-w-4xl border border-divider shadow-lg">
              <h1 className="text-4xl">Roles</h1>
              <div className="flex flex-col gap-6 mt-4">
                <Roles userRoles={user.roles} />
              </div>
            </div>
          </main>
        </>
      }
    </div>

  );
}
