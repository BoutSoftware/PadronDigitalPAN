"use client";
import TeamModal from "./TeamModal";
import TeamCard from "./TeamCard";
import { useEffect, useState } from "react";
import { fakeTeams } from "@/utils/Fake";
import { Divider } from "@nextui-org/react";

interface TeamsOfAStructureProps {
  structureName: string
}

interface GeoConfig {
  level: string;
  values: string[];
}

interface Team {
  teamName: string;
  enlace: string;
  pointTypes: string[];
  geoConfig: GeoConfig
}

export default function TeamsOfAStructure({ structureName }: TeamsOfAStructureProps) {
  const [teams, setTeams] = useState<Team[] | null>(null);

  useEffect(() => {
    // Get the teams from the API
    setTeams(fakeTeams);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">{structureName}</h2>
        <TeamModal structureName={structureName} />
      </div>
      <Divider />
      <div className="flex flex-wrap gap-6">
        {
          teams?.map((team, index) => (
            <TeamCard
              key={index}
              enlace={team.enlace}
              geoConfig={team.geoConfig}
              puntos={team.pointTypes.join(", ")}
              id={index}
              team={team.teamName} />
          ))
        }
      </div>
    </div>
  );
}