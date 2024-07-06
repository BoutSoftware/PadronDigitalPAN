"use client";
import { useState } from "react";
import { TIPOS_PUNTO } from "@/configs/catalogs/visorCatalog";
import { TeamInterface } from "@/utils/VisorInterfaces";
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection
} from "@nextui-org/react";

interface Props {
  team: TeamInterface
  teamId: string
}

export function PointType({ team, teamId }: Props) {

  const [pointTypeKeys, setPointTypeKeys] = useState<Selection>(new Set([""]));

  async function handlePointTypeValue() {
    const resBody = await fetch(`/dashboard/api/visor/teams/${teamId}/pointTypes`, {
      method: "PUT",
      body: JSON.stringify({ pointTypesIDs: Array.from(pointTypeKeys) })
    })
      .then(res => res.json())
      .catch(err => console.error(err));
    if (resBody.code !== "OK") {
      console.error(resBody.message);
      return;
    }
    console.log(resBody);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="justify-between flex">
        <h2 className="text-2xl">
          Tipos de punto
        </h2>
        <Dropdown>
          <DropdownTrigger>
            <Button>{team?.TiposPunto.length} tipo{(team?.TiposPunto.length || 0) > 1 && "s"} de punto</Button>
            {/* Need to code "|| 0" in the line below by a typescript error */}
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Tipos de punto"
            selectedKeys={pointTypeKeys}
            selectionMode="single"
            onSelectionChange={handlePointTypeValue}>
            {
              TIPOS_PUNTO
                .filter(pointType => pointType.estructuraId == team?.Structure.id)
                .map(pointType => (
                  <DropdownItem key={pointType.id}>{pointType.nombre}</DropdownItem>
                ))
            }
          </DropdownMenu>
        </Dropdown>
      </div>
      <Divider />
      <div className="flex flex-col gap-4">
        {
          team?.TiposPunto.map(({ id, nombre }) => (
            <div key={id} className="flex justify-between items-center">
              <span>{nombre}</span>
              <Button>Quitar</Button>
            </div>
          ))
        }
      </div>
    </div>
  );

}