"use client";
import { Divider, Avatar, Input, Button } from "@nextui-org/react";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import ModalStructCoor from "@/components/visor/people/ModalStructCoor";
import ModalSubCoor from "@/components/visor/people/ModalSubCoor";
import ModalAuxCoor from "@/components/visor/people/ModalAuxCoor";

export interface Person {
  name: string;
  fatherLastName: string;
  motherLastName: string;
}
interface User {
  id: string;
  rol: string;
  active: boolean;
  title: null | string;
  User: {
    Person: Person
  };
}

interface users {
  userSearched?: string
  coordinators: User[];
  subcoordinators: User[];
  auxiliaries: User[];
  users: User[];
  admins: User[];
}

export default function Page() {
  const [users, setUsers] = useState<users | null>(null);
  const [usersFiltered, setUsersFiltered] = useState<users | null>();

  function handleSearchUser(userSearched: string) {
    setUsersFiltered({
      ...usersFiltered,
      userSearched,
      admins: users?.admins.filter((admin) => admin.User.Person.name.includes(userSearched)) || [],
      coordinators: users?.coordinators.filter((coor) => coor.User.Person.name.includes(userSearched)) || [],
      subcoordinators: users?.subcoordinators.filter((sub) => sub.User.Person.name.includes(userSearched)) || [],
      auxiliaries: users?.auxiliaries.filter((aux) => aux.User.Person.name.includes(userSearched)) || [],
      users: users?.users.filter((user) => user.User.Person.name.includes(userSearched)) || []
    });
  }

  async function getVisorPeople() {
    const resBody = await fetch("/dashboard/api/visor/users")
      .then(res => res.json())
      .catch(err => console.error(err));

    if (resBody.code !== "OK") {
      console.error(resBody.message);

      return;
    }

    const { data } = resBody;
    const formattedData: users = {
      admins: data.Admins,
      coordinators: data.Coordinators.filter((coor: User) => coor.title === "Coordinador de Estructura"),
      subcoordinators: data.Coordinators.filter((coor: User) => coor.title === "Subcoordinador"),
      auxiliaries: data.Coordinators.filter((coor: User) => coor.title === "Auxiliar de Coordinacion"),
      users: data.Users
    };

    setUsers(formattedData);
    setUsersFiltered(formattedData);
  }

  useEffect(() => {
    getVisorPeople();
  }, []);

  return (
    <div className="p-8 w-full flex flex-col gap-4 overflow-y-auto">
      <Header title="Personas" />
      <Input
        label="Integrante"
        placeholder="Busca un integrante"
        type="text"
        value={usersFiltered?.userSearched}
        onValueChange={(userSearched) => handleSearchUser(userSearched)}
      />
      <div className="flex gap-20 px-4 w-full">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl">Administradores de módulo</h2>
              <span className="text-zinc-400">{usersFiltered?.admins.length}/{users?.admins.length}</span>
            </div>
            {
              usersFiltered?.admins ? (
                usersFiltered.admins.map((admin, index, array) => (
                  <React.Fragment key={index}>
                    <div className="flex gap-2 items-center my-3">
                      <Avatar showFallback name={admin.User.Person.name} />
                      <span className="font-light">{admin.User.Person.name}</span>
                    </div>
                    {index !== (array.length - 1) && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <p className="my-8 text-zinc-400">Ningún elemento coincide con la búsqueda realizada</p>
              )
            }
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl">Coordinador de estructura</h2>
                <span className="text-zinc-400">{usersFiltered?.coordinators.length}/{users?.coordinators.length}</span>
              </div>
              <ModalStructCoor />
            </div>
            {
              usersFiltered?.coordinators ? (
                usersFiltered.coordinators.map((coor, index, array) => (
                  <React.Fragment key={index}>
                    <div className="flex gap-2 justify-between items-center my-3">
                      <div className="flex gap-2 items-center">
                        <Avatar showFallback name={coor.User.Person.name} />
                        <div className="flex flex-col">
                          <span className="font-light">{coor.User.Person.name}</span>
                          <span className="font-light text-zinc-400 text-sm">Estructura a cargo</span>
                        </div>
                      </div>
                      {/* TODO: Preguntar de donde saco la estructura */}
                      <ModalStructCoor coordinator={{ id: coor.id, name: coor.User.Person.name, structureId: "" }} />
                    </div>
                    {index !== (array.length - 1) && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <p className="my-8 text-zinc-400">Ningún elemento coincide con la búsqueda realizada</p>
              )
            }
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl">Sub Coordinador</h2>
                <span className="text-zinc-400">{usersFiltered?.subcoordinators.length}/{users?.subcoordinators.length}</span>
              </div>
              <ModalSubCoor />
            </div>
            {
              usersFiltered?.subcoordinators ? (
                usersFiltered.subcoordinators.map((sub, index, array) => (
                  <React.Fragment key={index}>
                    <div className="flex gap-2 justify-between items-center my-3">
                      <div className="flex gap-2 items-center">
                        <Avatar showFallback name={sub.User.Person.name} />
                        <div className="flex flex-col">
                          <span className="font-light">{sub.User.Person.name}</span>
                          <span className="font-light text-zinc-400 text-sm">3 Tipos de puntos asignados</span>
                        </div>
                      </div>
                      <ModalSubCoor subCoordinatorId={sub.id} />
                    </div>
                    {index !== (array.length - 1) && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <p className="my-8 text-zinc-400">Ningún elemento coincide con la búsqueda realizada</p>
              )
            }
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl">Auxiliar de coordinación</h2>
                <span className="text-zinc-400">{usersFiltered?.auxiliaries.length}/{users?.auxiliaries.length}</span>
              </div>
              <ModalAuxCoor />
            </div>
            {
              usersFiltered?.auxiliaries ? (
                usersFiltered.auxiliaries.map((aux, index, array) => (
                  <React.Fragment key={index}>
                    <div key={index} className="flex gap-2 justify-between items-center my-3">
                      <div className="flex gap-2 items-center">
                        <Avatar showFallback name={aux.User.Person.name} />
                        <div className="flex flex-col">
                          <span className="font-light">{aux.User.Person.name}</span>
                          <span className="font-light text-zinc-400 text-sm">Querétaro, Corregidora, El Marqués</span>
                        </div>
                      </div>
                      <ModalAuxCoor auxiliary={{ id: aux.id, name: aux.User.Person.name }} />

                    </div>
                    {index !== (array.length - 1) && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <p className="my-8 text-zinc-400">Ningún elemento coincide con la búsqueda realizada</p>
              )
            }
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-xl mb-2">Usuarios del módulo</h2>
            <span className="text-zinc-400">{usersFiltered?.users.length}/{users?.users.length}</span>
          </div>
          {
            usersFiltered?.users ? (
              usersFiltered?.users.map((user, index, array) => (
                <React.Fragment key={index}>
                  <div key={index} className="flex gap-2 items-center my-3">
                    <Avatar showFallback name={user.User.Person.name} />
                    <span className="font-light">{user.User.Person.name}</span>
                  </div>
                  {index !== (array.length - 1) && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <p className="my-8 text-zinc-400">Ningún elemento coincide con la búsqueda realizada</p>
            )
          }
        </div>
      </div>
    </div>
  );
}