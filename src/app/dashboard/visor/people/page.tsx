"use client";
import { fakeModuleAdmins, fakeStructCoors, fakeModuleSubCoor, fakeModuleAux, fakeModuleUsers } from "@/utils/Fake";
import { Button, Divider, Avatar, Input } from "@nextui-org/react";
import Header from "@/components/Header";
import React, { useState } from "react";
import ModalStructCoor from "@/components/visor/people/ModalStructCoor";

interface fakeData {
  name: string,
}

interface usersInterface {
  admins: fakeData[]
  coors: {
    name: string,
    id: string
    structureId: string
  }[]
  subs: fakeData[]
  auxs: fakeData[]
  users: fakeData[]
}

export default function Page() {
  const [users, setUsers] = useState<usersInterface>({
    admins: fakeModuleAdmins,
    coors: fakeStructCoors,
    subs: fakeModuleSubCoor,
    auxs: fakeModuleAux,
    users: fakeModuleUsers
  });

  return (
    <div className="p-4 w-full flex flex-col gap-4 overflow-y-auto">
      <Header title="Personas" />
      {/* <Input
        label="Integrante"
        placeholder="Busca un integrante"
        type="text"
      /> */}
      <div className="flex gap-16 p-4">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col">
            <h2 className="text-xl mb-2">Administradores de módulo</h2>
            {
              users?.admins.map((admin, index, array) => (
                <React.Fragment key={index}>
                  <div key={index} className="flex gap-2 items-center my-3">
                    <Avatar showFallback name={admin.name} />
                    <span className="font-light">{admin.name}</span>
                  </div>
                  {index !== (array.length - 1) && <Divider />}
                </React.Fragment>
              ))
            }
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <h2 className="text-xl mb-2">Coordinador de estructura</h2>
              <ModalStructCoor />
            </div>
            {
              users?.coors.map((coor, index, array) => (
                <React.Fragment key={index}>
                  <div key={index} className="flex gap-2 justify-between items-center my-3">
                    <div className="flex gap-2 items-center">
                      <Avatar showFallback name={coor.name} />
                      <div className="flex flex-col">
                        <span className="font-light">{coor.name}</span>
                        <span className="font-light text-zinc-400 text-sm">Estructura a cargo</span>
                      </div>
                    </div>
                    <ModalStructCoor coordinator={{ id: coor.id, name: coor.name, structureId: coor.structureId }} />
                  </div>
                  {index !== (array.length - 1) && <Divider />}
                </React.Fragment>
              ))
            }
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <h2 className="text-xl mb-2">Sub Coordinador</h2>
              <Button color="primary">Agregar</Button>
            </div>
            {
              users?.subs.map((sub, index, array) => (
                <React.Fragment key={index}>
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
                </React.Fragment>
              ))
            }
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <h2 className="text-xl mb-2">Auxiliar de coordinación</h2>
              <Button color="primary">Agregar</Button>
            </div>
            {
              users?.auxs.map((aux, index, array) => (
                <React.Fragment key={index}>
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
                </React.Fragment>
              ))
            }
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl mb-2">Usuarios del módulo</h2>
          {
            users?.users.map((user, index, array) => (
              <React.Fragment key={index}>
                <div key={index} className="flex gap-2 items-center my-3">
                  <Avatar showFallback name={user.name} />
                  <span className="font-light">{user.name}</span>
                </div>
                {index !== (array.length - 1) && <Divider />}
              </React.Fragment>
            ))
          }
        </div>
      </div>
    </div>
  );
}