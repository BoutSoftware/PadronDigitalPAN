"use client";

import Header from "@/components/Header";
import TeamsOfAStructure, { fakeTeams } from "@/components/visor/teams/TeamsOfAStructure";
import { ESTRUCTURAS } from "@/configs/catalogs/visorCatalog";
import { Button, Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, Input } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

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

// Interfaz para almacenar los equipos por estructura, utilizando IDs dinámicos
interface TeamsByStructure {
  [key: string]: Team[]
}

interface Structure {
  structureId: string
  structureType: string
  teams: Team[]
}

export default function Teams() {
  // Estado para almacenar los equipos por estructura
  const [teams, setTeams] = useState<TeamsByStructure | undefined>(undefined);
  // Estado para almacenar los equipos filtrados por estructura
  const [filteredTeams, setFilteredTeams] = useState<TeamsByStructure | undefined>(undefined);
  // Estado para el término de búsqueda del equipo
  const [teamSearched, setTeamSearched] = useState("");
  // Estado para las claves de las estructuras seleccionadas
  const [selectedStructuresKeys, setSelectedStructuresKeys] = useState<string[]>([]);

  // Mapeo de los nombres de las estructuras seleccionadas a partir de sus claves
  const selectedStructures = useMemo(() => (
    selectedStructuresKeys.map(key => ESTRUCTURAS.find(str => str.id === key)?.nombre || "").join(", ")
  ), [selectedStructuresKeys]);

  // Función para obtener los equipos desde el servidor y configurarlos en el estado
  async function handleGetTeamsAndSetThem() {
    const resBody = await fetch("/dashboard/api/visor/teams")
      .then(res => res.json())
      .catch(err => console.log(err));

    const teamsByStructure: TeamsByStructure = {};
    resBody.data.forEach((structure: Structure) => {
      teamsByStructure[structure.structureId] = structure.teams;
    });

    setTeams(teamsByStructure);
    setFilteredTeams(teamsByStructure);
  }

  // useEffect para obtener los equipos al cargar el componente
  useEffect(() => {
    handleGetTeamsAndSetThem();
  }, []);

  // useEffect para filtrar los equipos según el término de búsqueda
  useEffect(() => {
    if (!teams) return;

    if (teamSearched === "") {
      setFilteredTeams(teams);
      return;
    }

    const newFilteredTeams: TeamsByStructure = {};
    for (const key in teams) {
      newFilteredTeams[key] = teams[key].filter(team => team.name.toLowerCase().includes(teamSearched.toLowerCase()));
    }

    setFilteredTeams(newFilteredTeams);
  }, [teamSearched, teams]);

  return (
    <div className="p-8 flex flex-col gap-4 overflow-auto flex-1">
      <Header title="Equipos" />

      <div className="flex gap-4 items-end my-4">
        <Input
          label="Busca un equipo"
          labelPlacement="outside"
          placeholder="Ingresa el nombre del equipo"
          className="flex-1"
          value={teamSearched}
          onValueChange={setTeamSearched}
        />
        <div className="flex gap items-center gap-4">
          <p>Filtrar por:</p>
          <Dropdown>
            <DropdownTrigger>
              <Button>{Array.from(selectedStructuresKeys).length > 0 ? selectedStructures : "Estructura"}</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Estructuras a filtrar"
              selectionMode="multiple"
              selectedKeys={selectedStructuresKeys}
              onSelectionChange={(value) => setSelectedStructuresKeys([...(value as Set<string>)])}
              closeOnSelect={false}
            >
              {ESTRUCTURAS.map((str) => {
                return <DropdownItem key={str.id}>{str.nombre}</DropdownItem>;
              })}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {
        filteredTeams ? (
          <div className="flex-1 flex flex-col gap-8">
            {/* Mapeo y renderizado de las estructuras seleccionadas */}
            {ESTRUCTURAS.map((str) => {
              if (selectedStructuresKeys.length === 0 || selectedStructuresKeys.includes(str.id)) {
                return (
                  <TeamsOfAStructure key={str.id} structureId={str.id} teams={filteredTeams[str.id]} />
                );
              }
              return null;
            })}
          </div>
        ) : (
          <div className="flex flex-1 justify-center items-center">
            <h4 className="text-3xl">Obteniendo equipos...</h4>
          </div>
        )
      }
    </div>
  );
}
