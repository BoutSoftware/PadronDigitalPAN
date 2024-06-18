"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { Card, Skeleton, Button } from "@nextui-org/react";
import TeamCard from "@/components/visor/teams/TeamCard";

const teams = [
  {
    id: 1,
    teamName: "Equipo A",
    enlaceName: "Andrea Martínez",
    puntos: "Necesidades, Cruceros",
    territorio: "Querétaro",
    geoConfig: { level: "Municipios", values: ["m1", "m2", "m3", "m4"] }
  },
  {
    id: 2,
    teamName: "Equipo B",
    enlaceName: "Juan Carlos Rodríguez",
    puntos: "Encuestas",
    territorio: "San Juan del Río",
    geoConfig: { level: "Colonias", values: ["C1", "C2"] }
  },
  {
    id: 3,
    teamName: "Equipo B",
    enlaceName: "Valentina Herrera",
    puntos: "Toques, Publicidad",
    territorio: "Corregidora",
    geoConfig: { level: "Secciones Electorales", values: ["S1", "S2"] }
  }
];

export default function BasePlatformWelcome() {
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleLoad = () => {
    setIsLoaded(!isLoaded);
  };

  return (
    <div className="flex flex-grow flex-col p-8">
      <Header title="Bienvenido" />

      {/* Welcome */}
      <section>
        <h2 className="py-4">Siguiente evento</h2>
        <Card className="w-[200px] space-y-5 p-4" radius="lg">
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>
      </section>

      {/* Next Events */}
      <section className="mt-12">
        <h2 className="">Proximos Eventos</h2>
        <div className="flex flex-row gap-8 mt-8">
          <Card className="w-[200px] space-y-5 p-4" radius="lg">
            <Skeleton isLoaded={isLoaded} className="rounded-lg">
              <div className="h-24 rounded-lg bg-secondary"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-300"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
              </Skeleton>
            </div>
            <div className="w-full text-right">
              <Button size="sm" variant="solid" color="secondary" onPress={toggleLoad} className="w-2/3">
                {isLoaded ? "Show" : "Hide"} Skeleton
              </Button>
            </div>
          </Card>
          <Card className="w-[200px] space-y-5 p-4" radius="lg">
            <Skeleton isLoaded={isLoaded} className="rounded-lg">
              <div className="h-24 rounded-lg bg-secondary"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-300"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
              </Skeleton>
            </div>
            <div className="w-full text-right">
              <Button size="sm" variant="solid" color="secondary" onPress={toggleLoad} className="w-2/3">
                {isLoaded ? "Show" : "Hide"} Skeleton
              </Button>
            </div>
          </Card>
          <Card className="w-[200px] space-y-5 p-4" radius="lg">
            <Skeleton isLoaded={isLoaded} className="rounded-lg">
              <div className="h-24 rounded-lg bg-secondary"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-300"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
              </Skeleton>
            </div>
            <div className="w-full text-right">
              <Button size="sm" variant="solid" color="secondary" onPress={toggleLoad} className="w-2/3">
                {isLoaded ? "Show" : "Hide"} Skeleton
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-24">
        <div className="grid grid-cols-4 gap-3">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              id={team.id}
              teamName={team.teamName}
              enlaceName={team.enlaceName}
              puntos={team.puntos}
              geoConfig={team.geoConfig}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
