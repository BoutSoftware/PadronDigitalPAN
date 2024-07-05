"use client";
import { Caminante } from "@/components/visor/individualTeam/Caminante";
import { Input, Avatar, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Selection, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CONFIGURACIONES_GEOGRAFICAS, TIPOS_PUNTO } from "@/configs/catalogs/visorCatalog";
import { ModalModifyGeographicArea } from "@/components/visor/individualTeam/ModalModifyGeographicArea";

interface Structure {
  id: string
  nombre: string
}
interface Caminante {
  id: string
  name: string
  active: boolean
}
interface Link {
  id: string
  active: boolean
  name: string
}
interface Auxiliary {
  id: string
  active: boolean
  name: string
}
interface TipoPunto {
  id: string
  nombre: string
  icon: string
  estructuraId: string
}
interface GeographicLevel {
  id: string
  nombre: string
}
interface GeographicLevelValue {
  id: string
  name: string
}
interface TeamResponse {
  id: string
  name: string
  active: boolean
  Structure: Structure
  Caminantes: Caminante[]
  Link: Link
  Auxiliary: Auxiliary
  TiposPunto: TipoPunto[]
  geographicConf: {
    geographicLevel: GeographicLevel
    values: GeographicLevelValue[]
  }
}

interface TeamKeys {
  geographicLevelKey: Selection
  pointTypesKeys: Selection
}

export default function Page() {

  const [membersAndConfig, setMembersAndConfig] = useState<TeamResponse | null>(null);
  const [teamKeys, setTeamKeys] = useState<TeamKeys>({
    geographicLevelKey: new Set(""),
    pointTypesKeys: new Set([""])
  });
  const [geographicValues, setGeographicValues] = useState({
    values: [],
    selectedValues: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id: teamId } = useParams();

  async function handlePointTypeValue(key: Selection) {

    const resBody = await fetch(`/dashboard/api/visor/teams/${teamId}/pointTypes`, {
      method: "PUT",
      body: JSON.stringify({ pointTypesIDs: Array.from(teamKeys.pointTypesKeys) })
    })
      .then(res => res.json())
      .catch(err => console.error(err));

    console.log(resBody);
  }

  async function getAndSetTeamInfo() {

    // TODO: Refactor this

    // Get team information
    const teamResBody = await fetch(`/dashboard/api/visor/teams/${teamId}`)
      .then(res => res.json())
      .catch(err => console.error(err));
    if (teamResBody.code !== "OK") {
      console.error(teamResBody.message);
      return;
    }
    const { data: teamData } = teamResBody;
    console.log(teamData);

    // Get geographic level values
    const geographicLevelId = teamData.geographicConf.geographicLevel.id; // Argument for function
    const municipios = teamData.Auxiliary.municipios; // Argument for function
    const geographicLevelData = await getGeographicLevelValues(geographicLevelId, municipios);
    console.log(geographicLevelData);
    setGeographicValues({
      values: geographicLevelData,
      selectedValues: teamData.geographicConf.values
    });

    // Setting keys state
    const initialGeographicConfKeys: TeamKeys = {
      geographicLevelKey: new Set([geographicLevelId]),
      pointTypesKeys: new Set(teamData.TiposPunto.map((pointType: TipoPunto) => pointType.id))
    };
    setTeamKeys(initialGeographicConfKeys);
    setMembersAndConfig(teamData);
  }

  async function getGeographicLevelValues(geographicLevelId: string, municipios: string[]) {
    const params = `geographicLevel=${geographicLevelId}&municipios=${municipios.join(",")}`;
    const resBody = await fetch(`/dashboard/api/visor/geographicConfiguration/?${params}`)
      .then(res => res.json())
      .catch(err => console.error(err));

    if (resBody.code !== "OK") {
      console.error(resBody.message);
      return;
    }
    return resBody.data;
  }

  async function handleGeographicValueChange(key: Selection) {

    const geographicLevelId = Array.from(key)[0];
    if (!geographicLevelId) return;

    const municipios = membersAndConfig?.Auxiliary.municipios;
    const newGeographicValues = await getGeographicLevelValues(geographicLevelId.toString(), municipios);

    // setGeographicValues();
  }

  useEffect(() => {
    console.log(teamKeys.geographicLevelKey);
  }, [teamKeys.geographicLevelKey]);

  useEffect(() => {
    getAndSetTeamInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 flex gap-4">
      <div className="flex flex-col flex-1 gap-4">
        <h2 className="text-2xl text-foreground-600 ">Estructura perteneciente</h2>
        <Divider />
        <span className="text-foreground-400">{membersAndConfig?.Structure.nombre}</span>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-foreground-600 ">Auxiliar de coordinación</h2>
          <Divider />
          <div className="flex items-center gap-2">
            <Avatar showFallback name={membersAndConfig?.Auxiliary.name} src="https://images.unsplash.com/broken" />
            <span>{membersAndConfig?.Auxiliary.name}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-foreground-600 ">Enlace del equipo</h2>
          <Divider />
          <div className="flex items-center gap-2">
            <Avatar showFallback name={membersAndConfig?.Link.name} src="https://images.unsplash.com/broken" />
            <p>{membersAndConfig?.Link.name}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-foreground-600 ">
            Miembros
            <span className="text-base text-foreground-400"> {membersAndConfig?.Caminantes.length} miembros en el equipo</span>
          </h2>
          <Divider />
          <div className="flex flex-col gap-4">
            {
              membersAndConfig?.Caminantes.map(({ id, active, name }) => (
                <Caminante key={id} id={id} active={active} name={name} />
              ))
            }
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Área geográfica</h2>
            <Button onPress={() => setIsModalOpen(true)}>Modificar área geográfica</Button>

            <Modal isOpen={isModalOpen} size="5xl">
              <ModalContent>
                <ModalHeader>
                  Modificando área geográfica
                </ModalHeader>
                <ModalBody>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-4">
                      <Select
                        label="Selecciona un nivel geográfico"
                        selectedKeys={teamKeys.geographicLevelKey}
                        onSelectionChange={handleGeographicValueChange}
                        selectionMode="single"
                      >
                        {
                          CONFIGURACIONES_GEOGRAFICAS.map(conf => <SelectItem key={conf.id}>{conf.nombre}</SelectItem>)
                        }
                      </Select>
                      <Autocomplete
                        label="Agrega valores"
                        shouldCloseOnBlur
                        menuTrigger="input"
                      >
                        {
                          geographicValues.values.map((value) => (
                            <AutocompleteItem
                              key={value.id}
                              onPress={() => setGeographicValues({
                                ...geographicValues,
                                selectedValues: [...geographicValues.selectedValues, value]
                              })}
                            >
                              {value.name}
                            </AutocompleteItem>
                          ))
                        }
                      </Autocomplete>
                    </div>
                    <div className="flex flex-col flex-1 max-h-[400px] overflow-auto">
                      <h4 className="text-xl text-foreground-700">Valores actuales</h4>
                      {
                        geographicValues.selectedValues.map((selectedValue: { id: string, name: string }, index) => (
                          <React.Fragment key={selectedValue.id}>
                            <div className="flex justify-between items-center w-full p-4">
                              <span>{selectedValue.name}</span>
                              <Button
                                size="sm"
                                radius="full"
                                variant="light"
                                isIconOnly
                                onPress={() => setGeographicValues({
                                  ...geographicValues,
                                  selectedValues: geographicValues.selectedValues.filter(val => val.id != selectedValue.id)
                                })}>
                                <span className="material-symbols-outlined">close</span>
                              </Button>
                            </div>
                            {(index + 1) !== geographicValues.selectedValues.length && <Divider />}
                          </React.Fragment>
                        ))
                      }
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button color="primary" onPress={() => { }}>Modificar</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
          <Divider />
          <div className="flex flex-col gap-4">
            {
              membersAndConfig?.geographicConf.values.map(({ id, name }) => (
                <div key={id} className="flex justify-between">
                  <div className="flex flex-col">
                    <span>{name}</span>
                    <span className="text-foreground-400">{name}</span>
                  </div>
                  <Button>Quitar</Button>
                </div>
              ))
            }
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="justify-between flex">
            <h2 className="text-2xl">
              Tipos de punto
            </h2>
            <Dropdown>
              <DropdownTrigger>
                <Button>{membersAndConfig?.TiposPunto.length} tipo{(membersAndConfig?.TiposPunto.length || 0) > 1 && "s"} de punto</Button>
                {/* Need to code "|| 0" in the line below by a typescript error */}
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Tipos de punto"
                selectedKeys={teamKeys.pointTypesKeys}
                selectionMode="single"
                onSelectionChange={(key) => handlePointTypeValue(key)}>
                {
                  TIPOS_PUNTO
                    .filter(pointType => pointType.estructuraId == membersAndConfig?.Structure.id)
                    .map(pointType => (
                      <DropdownItem key={pointType.id}>{pointType.nombre}</DropdownItem>
                    ))
                }
              </DropdownMenu>
            </Dropdown>
          </div>
          <Divider />
          <div className="flex flex-col gap-4">
            {
              membersAndConfig?.TiposPunto.map(({ id, nombre }) => (
                <div key={id} className="flex justify-between items-center">
                  <span>{nombre}</span>
                  <Button>Quitar</Button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}