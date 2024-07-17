"use client";

import { ReactNode, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tabs, Tab } from "@nextui-org/react";
import Header from "@/components/Header";
import RoundsPage from "@/components/visor/teams/RoundsPage";

interface Team {
  id: string;
  name: string;
}

export default function LayoutTeam({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Team | null>(null);
  const { teamId } = useParams();

  useEffect(() => {
    if (teamId) {
      // Verificar si teamId es un array de strings y obtener el primer elemento
      const id = Array.isArray(teamId) ? teamId[0] : teamId;
      console.log("Setting team with teamId:", id);
      setTeam({
        id,
        name: "Nombre del equipo",
      });
    } else {
      console.log("teamId is undefined");
    }
  }, [teamId]);

  return (
    <div className="flex-col h-screen items-stretch overflow-y-auto flex-1">
      <div className="p-4">
        <Header title={team?.name} />
      </div>
      <TeamTabs teamId={team?.id} />
      {children}
    </div>
  );
}

interface TeamTabsProps {
  teamId?: string;
}

function TeamTabs({ teamId }: TeamTabsProps) {
  const [isCaminante, setIsCaminante] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsCaminante(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isCaminante || isMobile) {
    return null;
  }

  console.log("Rendering TeamTabs with teamId:", teamId); // Log para verificar el teamId

  return (
    <div className="flex w-full flex-col p-4">
      <Tabs aria-label="Options" classNames={{ panel: "mt-8" }}>
        <Tab key="Configuración" title="Configuración"></Tab>
        <Tab key="Tabla" title="Tabla"></Tab>
        <Tab key="Crear punto" title="Crear punto"></Tab>
        <Tab key="Visualizar mapa" title="Visualizar mapa"></Tab>
        <Tab key="Rondas" title="Rondas">
          {teamId && <RoundsPage teamId={teamId} />}
        </Tab>
        <Tab key="Carga en campo" title="Carga en campo"></Tab>
      </Tabs>
    </div>
  );
}
