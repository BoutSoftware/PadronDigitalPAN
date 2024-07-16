"use client";
import TeamModal from "./TeamModal";
import TeamCard from "./TeamCard";
import { Divider } from "@nextui-org/react";
import { ESTRUCTURAS } from "@/configs/catalogs/visorCatalog";

interface TeamsOfAStructureProps {
  structureId: string
  teams?: Team[]
}

interface GeoConfig {
  geographicLevel: string
  values: string[]
}

interface Team {
  id: string
  name: string
  linkName: string
  pointTypesIDs: string[]
  geographicConf: GeoConfig
}

export default function TeamsOfAStructure({ structureId, teams }: TeamsOfAStructureProps) {
  const structureName = ESTRUCTURAS.find((str) => str.id === structureId)?.nombre;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Estructura {structureName}</h2>
        <TeamModal structureId={structureId} />
      </div>
      <Divider />
      <div className="grid grid-cols-2 xl:grid-cols-4 lg:grid-cols-2 justify-items-center gap-6 min-w-full">
        {
          teams && (
            teams.map((team, index) => (
              <TeamCard
                key={index}
                enlace={team.linkName}
                geographicConf={team.geographicConf}
                puntos={team.pointTypesIDs?.join(", ")}
                id={team.id}
                team={team.name} />
            ))
          )}
        {
          !teams && (<h4 className="text-foreground-400">No hay equipos para esta estructura</h4>)
        }
        {
          teams?.length == 0 && (<h4 className="text-foreground-400">Ninguna opción coincide con el elemento de busqueda</h4>)
        }
      </div>
    </div>
  );
}