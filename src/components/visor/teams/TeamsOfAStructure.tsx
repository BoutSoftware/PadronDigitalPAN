"use client";
import TeamCreationModal from "./TeamCreationModal";
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
        <TeamCreationModal structureId={structureId} />
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


export const fakeTeams = [
  {
    teamName: "Equipo Alpha",
    enlace: "David Muñoz Castro",
    pointTypes: ["Necesidad", "Crucero"],
    geoConfig: {
      level: "Colonia",
      values: ["Colonia El Pedregal", "Colonia Centro"]
    }
  },
  {
    teamName: "Equipo Beta",
    enlace: "María González López",
    pointTypes: ["Exploración", "Avanzada"],
    geoConfig: {
      level: "Colonia",
      values: ["Colonia La Florida", "Colonia San Miguel"]
    }
  },
  {
    teamName: "Equipo Gamma",
    enlace: "Juan Pérez Martínez",
    pointTypes: ["Apoyo", "Seguridad"],
    geoConfig: {
      level: "Colonia",
      values: ["Colonia Las Palmas", "Colonia Del Valle"]
    }
  },
  {
    teamName: "Equipo Delta",
    enlace: "Ana Torres Sánchez",
    pointTypes: ["Intervención", "Rescate"],
    geoConfig: {
      level: "Colonia",
      values: ["Colonia Jardines", "Colonia Los Ángeles"]
    }
  },
  {
    teamName: "Equipo Épsilon",
    enlace: "Carlos Hernández Ruiz",
    pointTypes: ["Reconocimiento", "Vigilancia"],
    geoConfig: {
      level: "Colonia",
      values: ["Colonia La Primavera", "Colonia La Esperanza"]
    }
  },
  {
    teamName: "Equipo Zeta",
    enlace: "Laura Martínez Fernández",
    pointTypes: ["Logística", "Soporte"],
    geoConfig: {
      level: "Colonia",
      values: ["Colonia El Bosque", "Colonia El Sol"]
    }
  },
  {
    teamName: "Equipo Eta",
    enlace: "Pedro Jiménez Ríos",
    pointTypes: ["Estrategia", "Planificación"],
    geoConfig: {
      level: "Colonia",
      values: ["Colonia Las Fuentes", "Colonia Del Mar"]
    }
  },
  {
    teamName: "Equipo Theta",
    enlace: "Rosa López García",
    pointTypes: ["Comunicación", "Coordinación"],
    geoConfig: {
      level: "Colonia",
      values: ["Colonia La Loma", "Colonia San Juan"]
    }
  },
  {
    teamName: "Equipo Iota",
    enlace: "Miguel Ángel Romero",
    pointTypes: ["Análisis", "Informe"],
    geoConfig: {
      level: "Colonia",
      values: ["Colonia La Estrella", "Colonia El Faro"]
    }
  },
  {
    teamName: "Equipo Kappa",
    enlace: "Sofía Castillo Díaz",
    pointTypes: ["Evaluación", "Monitoreo"],
    geoConfig: {
      level: "Colonia",
      values: ["Colonia El Prado", "Colonia Santa María"]
    }
  },
  {
    teamName: "Equipo Lambda",
    enlace: "Diego Ortiz Pérez",
    pointTypes: ["Apoyo Técnico", "Mantenimiento"],
    geoConfig: {
      level: "Colonia",
      values: ["Colonia El Encanto", "Colonia Los Pinos"]
    }
  },
  {
    teamName: "Equipo Mu",
    enlace: "Carolina Vega Hernández",
    pointTypes: ["Capacitación", "Desarrollo"],
    geoConfig: {
      level: "Colonia",
      values: ["Colonia La Hacienda", "Colonia El Lago"]
    }
  },
];