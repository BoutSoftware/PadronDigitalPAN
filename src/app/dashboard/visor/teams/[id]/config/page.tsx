"use client";
import { Avatar, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface membersAndConfigState {
  structure: string
  members: {
    aux: string
    enlace: string
    members: {
      id: string
      name: string
      isActive: boolean
    }[]
  }
  geographicArea: {
    id: string
    name: string
    level: string
  }[]
  pointTypes: {
    id: string
    name: string
  }[]
}

export default function Page() {

  const [membersAndConfig, setMembersAndConfig] = useState<membersAndConfigState | null>(null);

  useEffect(() => {
    setMembersAndConfig({
      structure: "Territorial",
      members: {
        aux: "Javier Zamudio",
        enlace: "Noel Vázquez",
        members: [
          { id: "1", name: "Diego Martínez García", isActive: true },
          { id: "2", name: "Diego Martínez García", isActive: true },
          { id: "3", name: "Diego Martínez García", isActive: true },
          { id: "4", name: "Diego Martínez García", isActive: true },
          { id: "5", name: "Diego Martínez García", isActive: true }
        ]
      },
      geographicArea: [
        { id: "1", name: "Rancho largo", level: "Colonia" },
        { id: "2", name: "Rancho largo", level: "Colonia" },
        { id: "3", name: "Rancho largo", level: "Colonia" },
        { id: "4", name: "Rancho largo", level: "Colonia" },
        { id: "5", name: "Rancho largo", level: "Colonia" }
      ],
      pointTypes: [
        { id: "1", name: "Necesidad" },
        { id: "2", name: "Cruceros" }
      ]
    });
  }, []);

  return (
    <div className="p-4 flex gap-4">
      <div className="flex flex-col flex-1 gap-4">
        <h2 className="text-2xl text-foreground-600 ">Estructura perteneciente</h2>
        <Divider />
        <span className="text-foreground-400">{membersAndConfig?.structure}</span>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-foreground-600 ">Auxiliar de coordinación</h2>
          <Divider />
          <div className="flex items-center gap-2">
            <Avatar showFallback name={membersAndConfig?.members.aux} src="https://images.unsplash.com/broken" />
            <span>{membersAndConfig?.members.aux}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-foreground-600 ">Enlace del equipo</h2>
          <Divider />
          <div className="flex items-center gap-2">
            <Avatar showFallback name={membersAndConfig?.members.aux} src="https://images.unsplash.com/broken" />
            <p>{membersAndConfig?.members.enlace}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-foreground-600 ">
            Miembros
            <span className="text-base text-foreground-400"> {membersAndConfig?.members.members.length} miembros en el equipo</span>
          </h2>
          <Divider />
          <div className="flex flex-col gap-4">
            {
              membersAndConfig?.members.members.map(member => (
                <div key={member.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar showFallback name={member.name} src="https://images.unsplash.com/broken" />
                    <span className="">{member.name}</span>
                  </div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button>{member.isActive ? "Activo" : "Inactivo"}</Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem key="active">Activo</DropdownItem>
                      <DropdownItem key="inactive">Inactivo</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Área geográfica</h2>
            <div className="flex gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button>Nivel</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="Colonias">Colonias</DropdownItem>
                  <DropdownItem key="Colonias">Colonias</DropdownItem>
                  <DropdownItem key="Colonias">Colonias</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownTrigger>
                  <Button>Valores</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="Colonias">Valor</DropdownItem>
                  <DropdownItem key="Colonias">Valor</DropdownItem>
                  <DropdownItem key="Colonias">Valor</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <Divider />
          <div className="flex flex-col gap-4">
            {
              membersAndConfig?.geographicArea.map(config => (
                <div key={config.id} className="flex justify-between">
                  <div className="flex flex-col">
                    <span>{config.name}</span>
                    <span className="text-foreground-400">{config.level}</span>
                  </div>
                  <Button>Quitar</Button>
                </div>
              ))
            }
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="text-2xl">
              Tipos de punto
              <span className="text-foreground-400 text-base"> Marcando {membersAndConfig?.pointTypes.length} tipos de punto</span>
            </h2>
          </div>
          <Divider />
          <div className="flex flex-col gap-4">
            {
              membersAndConfig?.pointTypes.map(point => (
                <div key={point.id} className="flex justify-between items-center">
                  <span>{point.name}</span>
                  <Button>Quitar</Button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}