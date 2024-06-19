"use client";

import Header from "@/components/Header";
import TeamsOfAStructure from "@/components/visor/teams/TeamsOfAStructure";
import { Button, Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, Input } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

export default function Teams() {
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const selectedValue = useMemo(() => (
    Array.from(selectedKeys).join(", ").replace("_", " ")
  ), [selectedKeys]);

  useEffect(() => {
    console.log(selectedValue);
  }, [selectedValue]);

  return (
    <div className="p-8 flex flex-col gap-4 overflow-auto">
      <Header title="Equipos" />

      <div className="flex gap-4 items-end">
        <Input
          label="Busca un equipo"
          labelPlacement="outside"
          placeholder="Ingresa el nombre del equipo"
          className="flex-1"
        />
        <div className="flex gap items-center gap-4">
          <p>Filtrar por:</p>
          <Dropdown>
            <DropdownTrigger>
              <Button>{Array.from(selectedKeys).length > 0 ? selectedValue : "Estructura"}</Button>
            </DropdownTrigger>
            <DropdownMenu
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              closeOnSelect={false}
            >
              <DropdownItem key="Territorial">Territorial</DropdownItem>
              <DropdownItem key="Gubernamental">Gubernamental</DropdownItem>
              <DropdownItem key="Dia_E">Dia E</DropdownItem>
              <DropdownItem key="Politico">Político</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <TeamsOfAStructure structureName="Territorial" />
        <TeamsOfAStructure structureName="Dia D" />
        <TeamsOfAStructure structureName="Campaña" />
        <TeamsOfAStructure structureName="Gubernamental" />
      </div>
    </div>
  );
}