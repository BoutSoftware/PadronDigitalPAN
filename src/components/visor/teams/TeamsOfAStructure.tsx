"use client";
import TeamCreationModal from "./TeamCreationModal";
import TeamCard from "./TeamCard";
import { Divider } from "@nextui-org/react";
import { ACTIVATIONS } from "@/configs/catalogs/visorCatalog";

interface ProjectsOfActivationProps {
  structureId: string
  projects?: Project[]
}

interface GeoConfig {
  geographicLevel: string
  values: string[]
}

interface Project {
  id: string
  name: string
  linkName: string
  pointTypesIDs: string[]
  geographicConf: GeoConfig
}

export default function ProjectsOfActivation({ structureId, projects: teams }: ProjectsOfActivationProps) {
  const activationName = ACTIVATIONS.find((str) => str.id === structureId)?.nombre;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Activacion: {activationName}</h2>
        <TeamCreationModal structureId={structureId} />
      </div>
      <Divider />
      <div className="grid grid-cols-2 xl:grid-cols-4 lg:grid-cols-2 justify-items-center gap-6 min-w-full">
        {teams && (
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
        {!teams && (<h4 className="text-foreground-400">No hay Proyectos para esta activacion</h4>)}
        {teams?.length == 0 && (<h4 className="text-foreground-400">Ninguna opción coincide con el elemento de busqueda</h4>)}
      </div>
    </div>
  );
}