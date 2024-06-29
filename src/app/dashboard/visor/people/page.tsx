"use client";
import { fakeModuleAdmins, fakeStructCoors, fakeModuleSubCoor, fakeModuleAux, fakeModuleUsers } from "@/utils/Fake";
import { Divider, Avatar, Input } from "@nextui-org/react";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import ModalStructCoor from "@/components/visor/people/ModalStructCoor";
import ModalSubCoor from "@/components/visor/people/ModalSubCoor";
import ModalAuxCoor from "@/components/visor/people/ModalAuxCoor";

interface users {
  userSearched?: string
  admins: { name: string }[]
  coors: {
    Coordinators: null // No sé como viene la información
    active: boolean
    id: string
    rol: string
    title?: string
    userId: string
  }[]
  technicals: {
    Technicals: null // No sé como viene la información
    active: true
    id: string
    rol: string
    title?: string
    userId: string
  }[]
  caminantes: {
    User: {
      Person: {
        name: string
        fatherLastName: string
        motherLastName: string
      }
    }
    active: boolean
    id: string
    rol: string
    title?: string
    userId: string
  }
}

export default function Page() {
  const [users, setUsers] = useState<users>({ admins: [], coors: [], subs: [], auxs: [], users: [] });
  const [usersFiltered, setUsersFiltered] = useState<users>({ userSearched: "", admins: [], coors: [], subs: [], auxs: [], users: [] });

  function handleSearchUser(userSearched: string) {
    setUsersFiltered({
      ...usersFiltered,
      userSearched,
      admins: users?.admins.filter((admin) => admin.name.includes(userSearched)) || [],
      coors: users?.coors.filter((coor) => coor.name.includes(userSearched)) || [],
      subs: users?.subs.filter((sub) => sub.name.includes(userSearched)) || [],
      auxs: users?.auxs.filter((aux) => aux.name.includes(userSearched)) || [],
      users: users?.users.filter((user) => user.name.includes(userSearched)) || []
    });
  }

  async function getPeople() {
    const coordinatorsResponse = await fetch("/dashboard/api/visor/coordinators?onlyFree=true")
      .then(res => res.json())
      .catch(err => console.error(err));
    const technicalsResponse = await fetch("/dashboard/api/visor/technicals?onlyFree=true")
      .then(res => res.json())
      .catch(err => console.log(err));
    const caminantesResponse = await fetch("/dashboard/api/visor/caminantes?team=false")
      .then(res => res.json())
      .catch(err => console.error(err));
    console.log(coordinatorsResponse);
    console.log(technicalsResponse);
    console.log(caminantesResponse);


  }

  useEffect(() => {
    getPeople();
    setUsers({
      admins: fakeModuleAdmins,
      coors: fakeStructCoors,
      subs: fakeModuleSubCoor,
      auxs: fakeModuleAux,
      users: fakeModuleUsers
    });

    setUsersFiltered({
      userSearched: "",
      admins: fakeModuleAdmins,
      coors: fakeStructCoors,
      subs: fakeModuleSubCoor,
      auxs: fakeModuleAux,
      users: fakeModuleUsers
    });
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
              <span className="text-zinc-400">{usersFiltered.admins.length}/{users.admins.length}</span>
            </div>
            {
              usersFiltered?.admins?.length > 0 ? (
                usersFiltered?.admins.map((admin, index, array) => (
                  <React.Fragment key={index}>
                    <div className="flex gap-2 items-center my-3">
                      <Avatar showFallback name={admin.name} />
                      <span className="font-light">{admin.name}</span>
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
                <span className="text-zinc-400">{usersFiltered.coors.length}/{users.coors.length}</span>
              </div>
              <ModalStructCoor />
            </div>
            {
              usersFiltered?.coors.length > 0 ? (
                usersFiltered?.coors.map((coor, index, array) => (
                  <React.Fragment key={index}>
                    <div className="flex gap-2 justify-between items-center my-3">
                      <div className="flex gap-2 items-center">
                        <Avatar showFallback name={coor.name} />
                        <div className="flex flex-col">
                          <span className="font-light">{coor.name}</span>
                          <span className="font-light text-zinc-400 text-sm">Estructura a cargo</span>
                        </div>
                      </div>
                      <ModalStructCoor coordinator={coor} />
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
                <span className="text-zinc-400">{usersFiltered.subs.length}/{users.subs.length}</span>
              </div>
              <ModalSubCoor action="Agregar" />
            </div>
            {
              usersFiltered?.subs.length > 0 ? (
                usersFiltered?.subs.map((sub, index, array) => (
                  <React.Fragment key={index}>
                    <div className="flex gap-2 justify-between items-center my-3">
                      <div className="flex gap-2 items-center">
                        <Avatar showFallback name={sub.name} />
                        <div className="flex flex-col">
                          <span className="font-light">{sub.name}</span>
                          <span className="font-light text-zinc-400 text-sm">3 Tipos de puntos asignados</span>
                        </div>
                      </div>
                      <ModalSubCoor action="Modificar" subCoordinatorName={sub.name} />
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
                <span className="text-zinc-400">{usersFiltered.auxs.length}/{users.auxs.length}</span>
              </div>
              <ModalAuxCoor action="Agregar" />
            </div>
            {
              usersFiltered?.auxs.length > 0 ? (
                usersFiltered?.auxs.map((aux, index, array) => (
                  <React.Fragment key={index}>
                    <div key={index} className="flex gap-2 justify-between items-center my-3">
                      <div className="flex gap-2 items-center">
                        <Avatar showFallback name={aux.name} />
                        <div className="flex flex-col">
                          <span className="font-light">{aux.name}</span>
                          <span className="font-light text-zinc-400 text-sm">Querétaro, Corregidora, El Marqués</span>
                        </div>
                      </div>
                      <ModalAuxCoor action="Modificar" auxCoordinatorName={aux.name} />
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
            <span className="text-zinc-400">{usersFiltered.users.length}/{users.users.length}</span>
          </div>
          {
            usersFiltered?.users.length > 0 ? (
              usersFiltered?.users.map((user, index, array) => (
                <React.Fragment key={index}>
                  <div key={index} className="flex gap-2 items-center my-3">
                    <Avatar showFallback name={user.name} />
                    <span className="font-light">{user.name}</span>
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