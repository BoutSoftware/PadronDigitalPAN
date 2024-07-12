"use client";
import { useEffect, useState } from "react";
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
  loadTeam: () => void
}

export function PointType({ team, teamId, loadTeam }: Props) {

  const [pointTypeKeys, setPointTypeKeys] = useState<Selection>(new Set());

  // TODO: End this

  useEffect(() => {
    const keys: Selection = new Set(team.TiposPunto.map(pointType => pointType.id));
    setPointTypeKeys(keys);
  }, [team.TiposPunto]);

  async function handleRemovePoint(id: string) {
    console.log("id: ", id);
    const pointIdArray: string[] = Array.from(pointTypeKeys).map(key => key.toString()).filter(key => key !== id);

    const resBody = await modifyPointType(pointIdArray);
    if (resBody.code !== "OK") {
      alert(resBody.message);
    }
  }

  async function handlePointTypeValue(keys: Selection) {
    console.log(keys);
    const pointIdArray: string[] = Array.from(keys).map(key => key.toString());

    const resBody = await modifyPointType(pointIdArray);
    if (!resBody) return;

    setPointTypeKeys(keys);
  }

  async function modifyPointType(pointIds: string[]) {
    const resBody = await fetch(`/dashboard/api/visor/teams/${teamId}/pointTypes`, {
      method: "PUT",
      body: JSON.stringify({ pointTypesIDs: pointIds })
    })
      .then(res => res.json())
      .catch(err => console.error(err));
    console.log(resBody);
    if (resBody.code !== "OK") {
      console.error(resBody.message);
      return;
    }
    await loadTeam();
    return resBody;
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
            selectionMode="multiple"
            onSelectionChange={(keys) => handlePointTypeValue(keys)}>
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
              <Button onPress={() => handleRemovePoint(id)}>Quitar</Button>
            </div>
          ))
        }
      </div>
    </div>
  );

}