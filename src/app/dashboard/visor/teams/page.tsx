"use client";

import Header from "@/components/Header";
import ProjectsOfActivation from "@/components/visor/teams/TeamsOfAStructure";
import { ACTIVATIONS } from "@/configs/catalogs/visorCatalog";
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

// Interfaz para almacenar los Proyectos por activacion, utilizando IDs dinámicos
interface ProjectsByActivation {
  [key: string]: Team[]
}

interface Structure {
  structureId: string
  structureType: string
  teams: Team[]
}

export default function Teams() {
  // Estado para almacenar los Proyectos por activacion
  const [projects, setProjects] = useState<ProjectsByActivation | undefined>(undefined);
  // Estado para almacenar los Proyectos filtrados por activacion
  const [filteredProjects, setFilteredProjects] = useState<ProjectsByActivation | undefined>(undefined);
  // Estado para el término de búsqueda del Proyecto
  const [projectSearched, setProjectSearched] = useState("");
  // Estado para las claves de las activaciones seleccionadas
  const [selectedActivationKeys, setSelectedActivationKeys] = useState<string[]>([]);

  // Mapeo de los nombres de las activaciones seleccionadas a partir de sus claves
  const selectedStructures = useMemo(() => (
    selectedActivationKeys.map(key => ACTIVATIONS.find(str => str.id === key)?.nombre || "").join(", ")
  ), [selectedActivationKeys]);

  // Función para obtener los Proyectos desde el servidor y configurarlos en el estado
  async function fetchProjects() {
    const resBody = await fetch("/dashboard/api/visor/teams")
      .then(res => res.json())
      .catch(err => console.log(err));

    if (resBody.code !== "OK") {
      alert("Error al obtener Proyectos");
      return;
    }

    const projectsByActivation: ProjectsByActivation = {};

    ACTIVATIONS.forEach((activation) => {
      projectsByActivation[activation.id] = resBody.data
        .filter((structure: Structure) => structure.structureId === activation.id)
        .map((structure: Structure) => structure.teams)[0];
    });


    setProjects(projectsByActivation);
    setFilteredProjects(projectsByActivation);

  }

  // useEffect para obtener los Proyectos al cargar el componente
  useEffect(() => {
    fetchProjects();
  }, []);

  // useEffect para filtrar los Proyectos según el término de búsqueda
  useEffect(() => {
    if (!projects) return;

    if (projectSearched === "") {
      setFilteredProjects(projects);
      return;
    }

    const newFilteredTeams: ProjectsByActivation = {};
    for (const key in projects) {
      if (!projects[key]) continue;
      newFilteredTeams[key] = projects[key].filter(team => team.name.toLowerCase().includes(projectSearched.toLowerCase()));
    }

    setFilteredProjects(newFilteredTeams);
  }, [projectSearched, projects]);

  return (
    <div className="p-8 flex flex-col gap-4 overflow-auto flex-1">
      <Header title="Proyectos" />

      <div className="flex gap-4 items-end my-4">
        <Input
          label="Busca un proyecto"
          labelPlacement="outside"
          placeholder="Ingresa el nombre del proyecto"
          className="flex-1"
          value={projectSearched}
          onValueChange={setProjectSearched}
        />
        <div className="flex gap items-center gap-4">
          <p>Filtrar por:</p>
          <Dropdown>
            <DropdownTrigger>
              <Button>{Array.from(selectedActivationKeys).length > 0 ? selectedStructures : "Activacion"}</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Activaciones a filtrar"
              selectionMode="multiple"
              selectedKeys={selectedActivationKeys}
              onSelectionChange={(value) => setSelectedActivationKeys([...(value as Set<string>)])}
              closeOnSelect={false}
            >
              {ACTIVATIONS.map((str) => {
                return <DropdownItem key={str.id}>{str.nombre}</DropdownItem>;
              })}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {filteredProjects ? (
        <div className="flex-1 flex flex-col gap-8">
          {/* Mapeo y renderizado de las activaciones seleccionadas */}
          {ACTIVATIONS.map((activation) => {
            if (selectedActivationKeys.length === 0 || selectedActivationKeys.includes(activation.id)) {
              return (
                <ProjectsOfActivation key={activation.id} structureId={activation.id} projects={filteredProjects[activation.id]} />
              );
            }
            return null;
          })}
        </div>
      ) : (
        <div className="flex flex-1 justify-center items-center">
          <h4 className="text-3xl">Obteniendo Proyectos...</h4>
        </div>
      )}
    </div>
  );
}
