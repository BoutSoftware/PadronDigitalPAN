"use client";
import { ReactNode, useState, useEffect } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import RoundsPage from "@/components/visor/teams/RoundsPage";

interface Team {
  id: string,
  name: string
}

export default function LayoutTeam({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Team>();
  const params = useParams<{ id: string }>();

  useEffect(() => {

    // fetch(params.id)

    setTeam({
      id: params.id,
      name: "Nombre del Proyecto"
    });

  }, [params.id]);

  return (
    <div className="flex flex-col w-full">
      <div className="p-4">
        <Header title={team?.name} />
      </div>

      <TeamTabs />

      {children}
    </div>
  );
}

function TeamTabs() {
  // Estado para gestionar si el usuario es miembro
  const [isCaminante, setIsCaminante] = useState(false);
  // Estado para gestionar si estamos en modo móvil
  const [isMobile, setIsMobile] = useState(false);

  // Simulación para establecer si el usuario es miembro (ejemplo, en un caso real esto vendría de props, contexto o una llamada API)
  useEffect(() => {
    // Aquí puedes implementar la lógica para determinar si el usuario es miembro.
    // Por ahora, lo establecemos estáticamente a `false`.
    setIsCaminante(false);
  }, []);

  // Lógica para detectar si estamos en modo móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Establecer el estado inicial
    handleResize();
    // Añadir event listener para el resize
    window.addEventListener("resize", handleResize);

    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Si el usuario es miembro o estamos en modo móvil, no mostrar las tabs
  if (isCaminante || isMobile) {
    return null;
  }

  return (
    <div className="flex w-full flex-col p-4">
      <Tabs aria-label="Options" classNames={{ panel: "mt-8" }}>
        <Tab key="Configuración" title="Configuración" href="config"></Tab>
        <Tab key="Tabla" title="Tabla" href="table"></Tab>
        <Tab key="Crear punto" title="Crear punto" href="createPoint"></Tab>
        <Tab key="Visualizar mapa" title="Visualizar mapa" href="map"></Tab>
        <Tab key="Rondas" title="Rondas" href="rounds"></Tab>
        <Tab key="Carga en campo" title="Carga en campo" href="field"></Tab>
      </Tabs>
    </div>
  );
}