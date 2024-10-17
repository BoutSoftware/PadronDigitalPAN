"use client";
import { Divider, Avatar, Input, Button } from "@nextui-org/react";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import ModalCoor from "@/components/visor/people/ModalStructCoor";
import ModalResp from "@/components/visor/people/ModalSubCoor";
import ModalAux from "@/components/visor/people/ModalAuxCoor";

interface TerritorialUser {
  id: string;
  rol: string;
  active: boolean;
  title: null | string;
  fullname: string;
  VisorUser?: TerritorialUser;
  User?: TerritorialUser;
}

interface UserList {
  userSearched?: string
  coordinators: TerritorialUser[];
  subcoordinators: TerritorialUser[];
  auxiliaries: TerritorialUser[];
  users: TerritorialUser[];
  admins: TerritorialUser[];
}

export default function Page() {
  const [userList, setUserList] = useState<UserList>();
  const [filteredUsers, setFilteredUsers] = useState<UserList>();

  function handleSearchUser(searchedUser: string) {
    searchedUser = searchedUser.trim().toLowerCase();

    setFilteredUsers({
      ...filteredUsers,
      userSearched: searchedUser,
      admins: userList?.admins.filter((admin) => admin.fullname.toLowerCase().includes(searchedUser)) || [],
      coordinators: userList?.coordinators.filter((coor) => coor.VisorUser?.fullname.toLowerCase().includes(searchedUser)) || [],
      subcoordinators: userList?.subcoordinators.filter((sub) => sub.User?.fullname.toLowerCase().includes(searchedUser)) || [],
      auxiliaries: userList?.auxiliaries.filter((aux) => aux.User?.fullname.toLowerCase().includes(searchedUser)) || [],
      users: userList?.users.filter((user) => user.fullname.toLowerCase().includes(searchedUser)) || []
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
    const formattedData: UserList = {
      admins: data.admins,
      coordinators: data.structureCoordinators,
      subcoordinators: data.subCoordinators,
      auxiliaries: data.auxiliaries,
      users: data.users
    };

    setUserList(formattedData);
    setFilteredUsers({ ...formattedData, userSearched: "" });
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
        value={filteredUsers?.userSearched || ""}
        onValueChange={(userSearched) => handleSearchUser(userSearched)}
      />
      <div className="flex gap-20 px-4 w-full">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl">Administradores de módulo</h2>
              <span className="text-zinc-400">{filteredUsers?.admins.length}/{userList?.admins.length}</span>
            </div>
            {
              filteredUsers?.admins ? (
                filteredUsers.admins.map((admin, index, array) => (
                  <React.Fragment key={index}>
                    <div className="flex gap-2 items-center my-3">
                      <Avatar showFallback name={admin.fullname} />
                      <span className="font-light">{admin.fullname}</span>
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
                <h2 className="text-xl">Coordinadores</h2>
                <span className="text-zinc-400">{filteredUsers?.coordinators.length}/{userList?.coordinators.length}</span>
              </div>
              <ModalCoor />
            </div>
            {
              filteredUsers?.coordinators ? (
                filteredUsers.coordinators.map((coor, index, array) => (
                  <React.Fragment key={index}>
                    <div className="flex gap-2 justify-between items-center my-3">
                      <div className="flex gap-2 items-center">
                        <Avatar showFallback name={coor.VisorUser?.fullname || "Error"} />
                        <div className="flex flex-col">
                          <span className="font-light">{coor.VisorUser?.fullname || "Error"}</span>
                          <span className="font-light text-zinc-400 text-sm">Activacion a cargo</span>
                        </div>
                      </div>
                      <ModalCoor coordinator={{ id: coor.id, name: coor.VisorUser?.fullname || "Error" }} />
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
                <h2 className="text-xl">Responsables</h2>
                <span className="text-zinc-400">{filteredUsers?.subcoordinators.length}/{userList?.subcoordinators.length}</span>
              </div>
              <ModalResp />
            </div>
            {
              filteredUsers?.subcoordinators ? (
                filteredUsers.subcoordinators.map((sub, index, array) => (
                  <React.Fragment key={index}>
                    <div className="flex gap-2 justify-between items-center my-3">
                      <div className="flex gap-2 items-center">
                        <Avatar showFallback name={sub.User?.fullname || "Error"} />
                        <div className="flex flex-col">
                          <span className="font-light">{sub.User?.fullname || "Error"}</span>
                          <span className="font-light text-zinc-400 text-sm">3 Tipos de puntos asignados</span>
                        </div>
                      </div>
                      <ModalResp subCoordinatorId={sub.id} />
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
                <h2 className="text-xl">Auxiliares</h2>
                <span className="text-zinc-400">{filteredUsers?.auxiliaries.length}/{userList?.auxiliaries.length}</span>
              </div>
              <ModalAux />
            </div>
            {
              filteredUsers?.auxiliaries ? (
                filteredUsers.auxiliaries.map((aux, index, array) => (
                  <React.Fragment key={index}>
                    <div key={index} className="flex gap-2 justify-between items-center my-3">
                      <div className="flex gap-2 items-center">
                        <Avatar showFallback name={aux.User?.fullname || "Error"} />
                        <div className="flex flex-col">
                          <span className="font-light">{aux.User?.fullname || "Error"}</span>
                          <span className="font-light text-zinc-400 text-sm">Querétaro, Corregidora, El Marqués</span>
                        </div>
                      </div>
                      <ModalAux auxiliary={{ id: aux.id, name: aux.User?.fullname || "Error" }} />

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
            <h2 className="text-xl mb-2">Usuarios Base</h2>
            <span className="text-zinc-400">{filteredUsers?.users.length}/{userList?.users.length}</span>
          </div>
          {
            filteredUsers?.users ? (
              filteredUsers?.users.map((user, index, array) => (
                <React.Fragment key={index}>
                  <div key={index} className="flex gap-2 items-center my-3">
                    <Avatar showFallback name={user.fullname || "Error"} />
                    <span className="font-light">{user.fullname || "Error"}</span>
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