"use client";
import { Caminante } from "@/components/visor/individualTeam/Caminante";
import { Avatar, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Selection } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CONFIGURACIONES_GEOGRAFICAS, TIPOS_PUNTO } from "@/configs/catalogs/visorCatalog";

interface Structure {
  id: string
  nombre: string
}
interface Caminante {
  id: string
  name: string
  active: boolean
}
interface Link {
  id: string
  active: boolean
  name: string
}
interface Auxiliary {
  id: string
  active: boolean
  name: string
}
interface TipoPunto {
  id: string
  nombre: string
  icon: string
  estructuraId: string
}
interface GeographicLevel {
  id: string
  nombre: string
}
interface GeographicLevelValue {
  id: string
  name: string
}
interface TeamResponse {
  id: string
  name: string
  active: boolean
  Structure: Structure
  Caminantes: Caminante[]
  Link: Link
  Auxiliary: Auxiliary
  TiposPunto: TipoPunto[]
  geographicConf: {
    geographicLevel: GeographicLevel
    values: GeographicLevelValue[]
  }
}

interface TeamKeys {
  geographicKeys: Selection
  pointTypesKeys: Selection
}

export default function Page() {

  const [membersAndConfig, setMembersAndConfig] = useState<TeamResponse | null>(null);
  const [geographicConfKeys, setGeographicConfKeys] = useState<TeamKeys>({
    geographicKeys: new Set([""]),
    pointTypesKeys: new Set([""])
  });
  const { id: teamId } = useParams();

  async function handlePointTypeValue(key: Selection) {

    const resBody = await fetch(`/dashboard/api/visor/teams/${teamId}/pointTypes`, {
      method: "PUT",
      body: JSON.stringify({ pointTypesIDs: Array.from(geographicConfKeys.pointTypesKeys) })
    })
      .then(res => res.json())
      .catch(err => console.error(err));

    console.log(resBody);
  }

  async function getAndSetTeamInfo() {

    const resBody = await fetch(`/dashboard/api/visor/teams/${teamId}`)
      .then(res => res.json())
      .catch(err => console.error(err));

    if (resBody.code !== "OK") {
      console.error(resBody.message);
      return;
    }

    const { data } = resBody;

    const initialGeographicConfKeys: TeamKeys = {
      geographicKeys: new Set(data.geographicConf.values.map((geoConf: GeographicLevelValue) => geoConf.id)),
      pointTypesKeys: new Set(data.TiposPunto.map((pointType: TipoPunto) => pointType.id))
    };

    setGeographicConfKeys(initialGeographicConfKeys);
    setMembersAndConfig(data);
  }

  useEffect(() => {
    getAndSetTeamInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 flex gap-4">
      <div className="flex flex-col flex-1 gap-4">
        <h2 className="text-2xl text-foreground-600 ">Estructura perteneciente</h2>
        <Divider />
        <span className="text-foreground-400">{membersAndConfig?.Structure.nombre}</span>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-foreground-600 ">Auxiliar de coordinación</h2>
          <Divider />
          <div className="flex items-center gap-2">
            <Avatar showFallback name={membersAndConfig?.Auxiliary.name} src="https://images.unsplash.com/broken" />
            <span>{membersAndConfig?.Auxiliary.name}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-foreground-600 ">Enlace del equipo</h2>
          <Divider />
          <div className="flex items-center gap-2">
            <Avatar showFallback name={membersAndConfig?.Link.name} src="https://images.unsplash.com/broken" />
            <p>{membersAndConfig?.Link.name}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-foreground-600 ">
            Miembros
            <span className="text-base text-foreground-400"> {membersAndConfig?.Caminantes.length} miembros en el equipo</span>
          </h2>
          <Divider />
          <div className="flex flex-col gap-4">
            {
              membersAndConfig?.Caminantes.map(({ id, active, name }) => (
                <Caminante key={id} id={id} active={active} name={name} />
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
                <DropdownMenu
                  aria-label="Configuración geográfica"
                >
                  {
                    CONFIGURACIONES_GEOGRAFICAS.map(conf => <DropdownItem key={conf.id}>{conf.nombre}</DropdownItem>)
                  }
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
              membersAndConfig?.geographicConf.values.map(({ id, name }) => (
                <div key={id} className="flex justify-between">
                  <div className="flex flex-col">
                    <span>{name}</span>
                    <span className="text-foreground-400">{name}</span>
                  </div>
                  <Button>Quitar</Button>
                </div>
              ))
            }
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="justify-between flex">
            <h2 className="text-2xl">
              Tipos de punto
            </h2>
            <Dropdown>
              <DropdownTrigger>
                <Button>{membersAndConfig?.TiposPunto.length} tipo{(membersAndConfig?.TiposPunto.length || 0) > 1 && "s"} de punto</Button>
                {/* Need to code "|| 2" in the line below by a typescript error */}
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Tipos de punto"
                selectedKeys={geographicConfKeys.pointTypesKeys}
                selectionMode="single"
                onSelectionChange={(key) => handlePointTypeValue(key)}>
                {
                  TIPOS_PUNTO
                    .filter(pointType => pointType.estructuraId == membersAndConfig?.Structure.id)
                    .map(pointType => (
                      <DropdownItem key={pointType.id}>{pointType.nombre}</DropdownItem>
                    ))
                }
                {/* Need to code " ? : " in the map below by a typescript error */}
              </DropdownMenu>
            </Dropdown>
          </div>
          <Divider />
          <div className="flex flex-col gap-4">
            {
              membersAndConfig?.TiposPunto.map(({ id, nombre }) => (
                <div key={id} className="flex justify-between items-center">
                  <span>{nombre}</span>
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