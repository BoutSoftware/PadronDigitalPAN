"use client";
import { ReactNode, useState, useEffect } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import RoundsPage from "@/components/visor/teams/RoundsPage";
import { useVisor } from "@/contexts/VisorContext";
import { VisGeoConf } from "@prisma/client";
import { isCaminante } from "@/configs/userGroups/visorUserGroups";
import { TITULOS } from "@/configs/catalogs/visorCatalog";

interface Team {
  id: string,
  name: string
}

export default function LayoutTeam({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Team>();
  const params = useParams<{ id: string }>();
  const { currentVisorUser } = useVisor();

  //get team
  const getTeam = async () => {
    const resBody = await (await fetch(`/dashboard/api/visor/teams/${params.id}`, { method: "GET" })).json();
    if (resBody.code !== "OK"){
      console.error("Error getting team");
      return;
    }
    setTeam(resBody.data);
    if (currentVisorUser){
      const data = resBody.data;
      const geographicConf: VisGeoConf = {
        geographicLevel: data.geographicConf.geographicLevel.id,
        values: data.geographicConf.values.map((value: { id: string }) => value.id)
      };
    
      const pointTypesIDs = data.TiposPunto.map((pointType: { id: string }) => pointType.id);
    
      currentVisorUser.team = {
        id: data.id,
        name: data.name,
        geographicConf: geographicConf,
        pointTypesIDs: pointTypesIDs
      };
    }
  };



  useEffect(() => {
    getTeam();

    console.log(currentVisorUser);
    //TODO: Unset team to the context (doubt)
    // return () => {
    //   // Unset the team from the Context
    //   if (currentVisorUser){
    //     currentVisorUser.team = undefined;
    //   }
    // };

  }, [params.id, currentVisorUser]);

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
  const [isCam, setIsCaminante] = useState(false);
  // Estado para gestionar si estamos en modo móvil
  const [isMobile, setIsMobile] = useState(false);
  const { currentVisorUser } = useVisor();

  // Simulación para establecer si el usuario es miembro (ejemplo, en un caso real esto vendría de props, contexto o una llamada API)
  useEffect(() => {
    // Aquí puedes implementar la lógica para determinar si el usuario es miembro.
    // Por ahora, lo establecemos estáticamente a `false`.
    setIsCaminante(
      isCaminante(currentVisorUser?.title as typeof TITULOS[number]["id"])
    );
  }, [currentVisorUser]);

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
  if (isCam || isMobile) {
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