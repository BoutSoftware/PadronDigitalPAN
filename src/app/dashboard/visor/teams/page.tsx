"use client";

import Header from "@/components/Header";
import TeamsOfAStructure, { fakeTeams } from "@/components/visor/teams/TeamsOfAStructure";
import { Button, Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, Input } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

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
interface TeamsByStructure {
  territorial: Team[]
  gubernamental: Team[]
  diaD: Team[]
  campaign: Team[]
}

export default function Teams() {
  const [teams, setTeams] = useState<TeamsByStructure | undefined>(undefined);
  const [filteredTeams, setFilteredTeams] = useState<TeamsByStructure | undefined>(undefined);
  const [teamSearched, setTeamSearched] = useState("");
  const [selectedStructuresKeys, setSelectedStructuresKeys] = useState(new Set([]));

  const selectedStructures = useMemo(() => ((Array.from(selectedStructuresKeys).join(", ").replace("_", " "))), [selectedStructuresKeys]);

  useEffect(() => {
    // TODO: Fetch a la API

    setTeams({
      territorial: fakeTeams,
      gubernamental: fakeTeams,
      diaD: fakeTeams,
      campaign: fakeTeams
    });
    setFilteredTeams({
      territorial: fakeTeams,
      gubernamental: fakeTeams,
      diaD: fakeTeams,
      campaign: fakeTeams
    });
  }, []);

  useEffect(() => {
    if (!teams) return;

    if (teamSearched == "") {
      setFilteredTeams(teams);
      return;
    }

    setFilteredTeams({
      territorial: teams.territorial.filter(team => team.teamName.includes(teamSearched)),
      campaign: teams.campaign.filter(team => team.teamName.includes(teamSearched)),
      diaD: teams.diaD.filter(team => team.teamName.includes(teamSearched)),
      gubernamental: teams.gubernamental.filter(team => team.teamName.includes(teamSearched))
    });
  }, [teamSearched]);

  return (
    <div className="p-8 flex flex-col gap-4 overflow-auto flex-1">
      <Header title="Equipos" />

      <div className="flex gap-4 items-end">
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
              onSelectionChange={setSelectedStructuresKeys}
              closeOnSelect={false}
            >
              <DropdownItem key="Territorial">Territorial</DropdownItem>
              <DropdownItem key="Gubernamental">Gubernamental</DropdownItem>
              <DropdownItem key="Dia_D">Dia D</DropdownItem>
              <DropdownItem key="Campaña">Campaña</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {
        filteredTeams ? (
          <div className="flex-1 flex flex-col gap-8">
            {(selectedStructures.includes("Territorial") || selectedStructures.length == 0) && <TeamsOfAStructure structureName="Territorial" teams={filteredTeams.territorial} />}
            {(selectedStructures.includes("Campaña") || selectedStructures.length == 0) && <TeamsOfAStructure structureName="Campaña" teams={filteredTeams.campaign} />}
            {(selectedStructures.includes("Gubernamental") || selectedStructures.length == 0) && <TeamsOfAStructure structureName="Gubernamental" teams={filteredTeams.gubernamental} />}
            {(selectedStructures.includes("Dia D") || selectedStructures.length == 0) && <TeamsOfAStructure structureName="Dia D" teams={filteredTeams.diaD} />}
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