"use client";

import Header from "@/components/Header";
import TeamsOfAStructure from "@/components/visor/teams/TeamsOfAStructure";
import { Button, Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, Input } from "@nextui-org/react";

export default function Teams() {
  return (
    <div className="p-4 flex flex-col gap-4 overflow-auto">
      <Header title="Equipos" />

      <div className="flex gap-4 items-end">
        <Input
          label="Busca un equipo"
          labelPlacement="outside"
          placeholder="Ingresa el nombre del equipo"
          fullWidth
        />
        <Button>Buscar</Button>
        <p className="">Filtrar por:</p>
        <Dropdown>
          <DropdownTrigger>
            <Button>Estructura</Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="Territorial">Territorial</DropdownItem>
            <DropdownItem key="Gubernamental">Gubernamental</DropdownItem>
            <DropdownItem key="DiaE">Dia E</DropdownItem>
            <DropdownItem key="Politico">Político</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="flex-1 flex-wrap">
        <TeamsOfAStructure structureName="Territorial" />
        <TeamsOfAStructure structureName="Dia D" />
        <TeamsOfAStructure structureName="Campaña" />
        <TeamsOfAStructure structureName="Gubernamental" />
      </div>
    </div>
  );
}