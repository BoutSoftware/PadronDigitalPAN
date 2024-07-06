"use client";
import { Caminante } from "@/components/visor/individualTeam/Caminante";
import { Avatar, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Selection, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CONFIGURACIONES_GEOGRAFICAS, TIPOS_PUNTO } from "@/configs/catalogs/visorCatalog";

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
  municipios: string[]
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
interface GeographicValue {
  id: string
  name: string
}
interface Team {
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
    values: GeographicValue[]
  }
}
interface InputKeys {
  geographicLevelKey: Selection
  pointTypesKeys: Selection
}
interface GeographicValues {
  values: GeographicValue[]
  selectedValues: GeographicValue[]
}

export default function Page() {

  const [team, setTeam] = useState<Team | null>(null);

  const [inputKeys, setInputKeys] = useState<InputKeys>({ geographicLevelKey: new Set(""), pointTypesKeys: new Set([""]) });
  const [geographicValues, setGeographicValues] = useState<GeographicValues>({ values: [], selectedValues: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id: teamId } = useParams();

  useEffect(() => {
    getAndSetTeamInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log({ inputKeys: inputKeys });
    console.log({ geographicValues: geographicValues });
    console.log({ team: team });
  }, [inputKeys, geographicValues, team]);

  async function getAndSetTeamInfo() {

    // General team info
    const teamData = await getTeamInfo();
    setTeam(teamData);

    // Get geographic level values
    const geoLevelId: string = teamData.geographicConf.geographicLevel.id; // Argument for function
    const municipios: string[] = teamData.Auxiliary.municipios; // Argument for function

    const geoLevelValues = await getGeographicLevelValues(geoLevelId, municipios);
    if (geoLevelValues) {
      setGeographicValues({
        values: geoLevelValues,
        selectedValues: teamData.geographicConf.values
      });
    }

    // Setting inputs keys
    const initialInputKeys: InputKeys = {
      geographicLevelKey: new Set([geoLevelId]),
      pointTypesKeys: new Set(teamData.TiposPunto.map((pointType: TipoPunto) => pointType.id))
    };
    setInputKeys(initialInputKeys);
  }

  async function getTeamInfo() {
    const resBody = await fetch(`/dashboard/api/visor/teams/${teamId}`)
      .then(res => res.json())
      .catch(err => console.error(err));
    if (resBody.code !== "OK") {
      console.error(resBody.message);
      return;
    }
    return resBody.data;
  }

  async function handlePointTypeValue(key: Selection) {
    const resBody = await fetch(`/dashboard/api/visor/teams/${teamId}/pointTypes`, {
      method: "PUT",
      body: JSON.stringify({ pointTypesIDs: Array.from(inputKeys.pointTypesKeys) })
    })
      .then(res => res.json())
      .catch(err => console.error(err));
    if (resBody.code !== "OK") {
      console.error(resBody.message);
      return;
    }
    console.log(resBody);
  }

  async function getGeographicLevelValues(geographicLevelId: string, municipios: string[]): Promise<void | GeographicValue[]> {
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

    const municipios = team?.Auxiliary.municipios;
    if (!municipios) return;
    const newGeographicValues = await getGeographicLevelValues(geographicLevelId.toString(), municipios);

    if (!newGeographicValues) return;

    setGeographicValues({ ...geographicValues, values: newGeographicValues });
  }

  return (
    <div className="p-4 flex gap-4">
      <div className="flex flex-col flex-1 gap-4">
        <h2 className="text-2xl text-foreground-600 ">Estructura perteneciente</h2>
        <Divider />
        <span className="text-foreground-400">{team?.Structure.nombre}</span>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-foreground-600 ">Auxiliar de coordinación</h2>
          <Divider />
          <div className="flex items-center gap-2">
            <Avatar showFallback name={team?.Auxiliary.name} src="https://images.unsplash.com/broken" />
            <span>{team?.Auxiliary.name}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-foreground-600 ">Enlace del equipo</h2>
          <Divider />
          <div className="flex items-center gap-2">
            <Avatar showFallback name={team?.Link.name} src="https://images.unsplash.com/broken" />
            <p>{team?.Link.name}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-foreground-600 ">
            Miembros
            <span className="text-base text-foreground-400"> {team?.Caminantes.length} miembros en el equipo</span>
          </h2>
          <Divider />
          <div className="flex flex-col gap-4">
            {
              team?.Caminantes.map(({ id, active, name }) => (
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
                        selectedKeys={inputKeys.geographicLevelKey}
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
                        defaultItems={geographicValues.values}
                        disabledKeys={geographicValues.selectedValues.map(val => val.id)}
                      >
                        {
                          ((item) => (
                            <AutocompleteItem
                              key={item.id}
                              onPress={() => setGeographicValues({
                                ...geographicValues,
                                selectedValues: [...geographicValues.selectedValues, item]
                              })}
                            >
                              {item.name}
                            </AutocompleteItem>
                          ))
                        }
                      </Autocomplete>
                    </div>
                    <div className="flex flex-col flex-1 max-h-[400px] overflow-auto">
                      <h4 className="text-xl text-foreground-700">Valores actuales</h4>
                      {
                        geographicValues.selectedValues.map((selectedValue, index) => (
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
              team?.geographicConf.values.map(({ id, name }) => (
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
                <Button>{team?.TiposPunto.length} tipo{(team?.TiposPunto.length || 0) > 1 && "s"} de punto</Button>
                {/* Need to code "|| 0" in the line below by a typescript error */}
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Tipos de punto"
                selectedKeys={inputKeys.pointTypesKeys}
                selectionMode="single"
                onSelectionChange={(key) => handlePointTypeValue(key)}>
                {
                  TIPOS_PUNTO
                    .filter(pointType => pointType.estructuraId == team?.Structure.id)
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
              team?.TiposPunto.map(({ id, nombre }) => (
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