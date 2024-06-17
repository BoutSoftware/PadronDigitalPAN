"use client";
import { fakeModuleAdmins, fakeModuleStructCoor, fakeModuleSubCoor, fakeModuleAux, fakeModuleUsers } from "@/utils/Fake";
import { Button, Divider, Avatar, Input } from "@nextui-org/react";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import ModalStructCoor from "@/components/ModalStructCoor";

interface admin {
  name: string
}
interface structCoordinator {
  name: string
  estructura: string
  tecnico: string
  adjunto: string
}
interface subCoordinator {
  name: string
  estructura: string
  tecnico: string
  tipoPunto: string[]
}

interface auxCoordinator {
  name: string
  estructura: string
  subCoor: string
  municipios: string[]
  tecnico: string
}

interface usersInterface {
  userSearched?: string
  admins: admin[];
  coors: structCoordinator[]
  subs: subCoordinator[]
  auxs: auxCoordinator[]
  users: admin[]
}

export default function Page() {
  const [users, setUsers] = useState<usersInterface>({ admins: [], coors: [], subs: [], auxs: [], users: [] });
  const [usersFiltered, setUsersFiltered] = useState<usersInterface>({ userSearched: "", admins: [], coors: [], subs: [], auxs: [], users: [] });

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

  useEffect(() => {
    // Make fetch to get people

    if (true) {
      // If all good, then set people

      setUsers({
        admins: fakeModuleAdmins,
        coors: fakeModuleStructCoor,
        subs: fakeModuleSubCoor,
        auxs: fakeModuleAux,
        users: fakeModuleUsers
      });

      setUsersFiltered({
        userSearched: "",
        admins: fakeModuleAdmins,
        coors: fakeModuleStructCoor,
        subs: fakeModuleSubCoor,
        auxs: fakeModuleAux,
        users: fakeModuleUsers
      });
    }
  }, []);

  return (
    <div className="p-4 w-full flex flex-col gap-4">
      <Header title="Personas" />
      <Input
        label="Integrante"
        placeholder="Busca un integrante"
        type="text"
        value={usersFiltered?.userSearched}
        onValueChange={(userSearched) => handleSearchUser(userSearched)}
      />
      <div className="flex gap-12">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl">Administradores de módulo</h2>
              <span className="text-zinc-400">{usersFiltered.admins.length}/{users.admins.length}</span>
            </div>
            {
              usersFiltered?.admins?.length > 0 ? (
                usersFiltered?.admins.map((admin, index, array) => (
                  <>
                    <div key={index} className="flex gap-2 items-center my-3">
                      <Avatar showFallback name={admin.name} />
                      <span className="font-light">{admin.name}</span>
                    </div>
                    {index !== (array.length - 1) && <Divider />}
                  </>
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
              <ModalStructCoor action="Agregar" />
            </div>
            {
              usersFiltered?.coors.length > 0 ? (
                usersFiltered?.coors.map((coor, index, array) => (
                  <>
                    <div key={index} className="flex gap-2 justify-between items-center my-3">
                      <div className="flex gap-2 items-center">
                        <Avatar showFallback name={coor.name} />
                        <div className="flex flex-col">
                          <span className="font-light">{coor.name}</span>
                          <span className="font-light text-zinc-400 text-sm">Estructura a cargo</span>
                        </div>
                      </div>
                      <ModalStructCoor action="Modificar" coordinatorName={coor.name} />
                    </div>
                    {index !== (array.length - 1) && <Divider />}
                  </>
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
              <Button color="primary">Agregar</Button>
            </div>
            {
              usersFiltered?.subs.length > 0 ? (
                usersFiltered?.subs.map((sub, index, array) => (
                  <>
                    <div key={index} className="flex gap-2 justify-between items-center my-3">
                      <div className="flex gap-2 items-center">
                        <Avatar showFallback name={sub.name} />
                        <div className="flex flex-col">
                          <span className="font-light">{sub.name}</span>
                          <span className="font-light text-zinc-400 text-sm">3 Tipos de puntos asignados</span>
                        </div>
                      </div>
                      <Button variant="light">Modificar</Button>
                    </div>
                    {index !== (array.length - 1) && <Divider />}
                  </>
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
              <Button color="primary">Agregar</Button>
            </div>
            {
              usersFiltered?.auxs.length > 0 ? (
                usersFiltered?.auxs.map((aux, index, array) => (
                  <>
                    <div key={index} className="flex gap-2 justify-between items-center my-3">
                      <div className="flex gap-2 items-center">
                        <Avatar showFallback name={aux.name} />
                        <div className="flex flex-col">
                          <span className="font-light">{aux.name}</span>
                          <span className="font-light text-zinc-400 text-sm">Querétaro, Corregidora, El Marqués</span>
                        </div>
                      </div>
                      <Button variant="light">Modificar</Button>
                    </div>
                    {index !== (array.length - 1) && <Divider />}
                  </>
                ))
              ) : (
                <p className="my-8 text-zinc-400">Ningún elemento coincide con la búsqueda realizada</p>
              )
            }
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div>
            <h2 className="text-xl mb-2">Usuarios del módulo</h2>
            <span>{usersFiltered.users.length}/{users.users.length}</span>
          </div>
          {
            usersFiltered?.users.length > 0 ? (
              usersFiltered?.users.map((user, index, array) => (
                <>
                  <div key={index} className="flex gap-2 items-center my-3">
                    <Avatar showFallback name={user.name} />
                    <span className="font-light">{user.name}</span>
                  </div>
                  {index !== (array.length - 1) && <Divider />}
                </>
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