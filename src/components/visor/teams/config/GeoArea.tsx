"use client";
import React, { useState, useEffect } from "react";
import { CONFIGURACIONES_GEOGRAFICAS } from "@/configs/catalogs/visorCatalog";
import { TeamInterface } from "@/utils/VisorInterfaces";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Selection
} from "@nextui-org/react";

interface GeographicValues {
  values: {
    id: string
    name: string
  }[]
  selectedValues: {
    id: string
    name: string
  }[]
}

interface Props {
  loadTeam: () => void
  team: TeamInterface
  teamId: string
}

export function GeoArea({ team, loadTeam, teamId }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [geographicValues, setGeographicValues] = useState<GeographicValues>({ values: [], selectedValues: [] });
  const [geoLevelKey, setGeoLevelKey] = useState<Selection>(new Set([team.geographicConf.geographicLevel.id]));

  useEffect(() => {
    getGeographicValues();
  }, []);

  useEffect(() => {
    console.log(geographicValues);
  }, [geographicValues]);

  async function handleSubmit() {
    const geographicLevelId = Array.from(geoLevelKey)[0];
    const geographicValuesId = geographicValues.selectedValues.map(selectedValue => selectedValue.id);

    const modifiedData = await updateTeamGeographicConfig(geographicLevelId.toString(), geographicValuesId);
    if (!modifiedData) return;

    await loadTeam();
    setIsModalOpen(false);
  }


  async function handleGeographicLevelChange(key: Selection) {
    const newGeographicLevelId = Array.from(key)[0];
    if (!newGeographicLevelId) return;

    const municipios = team?.Auxiliary.municipios;
    if (!municipios) return;

    const newGeographicValues = await getGeographicLevelValues(newGeographicLevelId.toString(), municipios);
    if (!newGeographicValues) return;

    setGeoLevelKey(key);
    setGeographicValues({ ...geographicValues, values: newGeographicValues, selectedValues: [] });
  }


  async function getGeographicValues() {
    const geoLevelId: string = team.geographicConf.geographicLevel.id;
    const municipios: string[] = team.Auxiliary.municipios;
    const selectedGeoLevelValues = await getGeographicLevelValues(geoLevelId, municipios);
    if (selectedGeoLevelValues) {
      setGeographicValues({
        values: selectedGeoLevelValues,
        selectedValues: team.geographicConf.values
      });
    }
  }


  async function getGeographicLevelValues(geographicLevelId: string, municipios: string[]): Promise<void | { id: string, name: string }[]> {
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


  async function updateTeamGeographicConfig(geoLevel: string, geoValues: string[]) {
    const reqBody = { geographicLevel: geoLevel, values: geoValues };
    const resBody = await fetch("/dashboard/api/visor/teams/667ef0fe356c04cf3b02af11/geoConf", {
      method: "PUT",
      body: JSON.stringify(reqBody)
    })
      .then(res => res.json())
      .catch(err => console.error(err));

    if (resBody.code !== "OK") return;

    return resBody.data;
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


  return (
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
                    selectedKeys={geoLevelKey}
                    onSelectionChange={handleGeographicLevelChange}
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
                          onPress={() => setGeographicValues(previousValues => ({
                            ...previousValues,
                            selectedValues: [...geographicValues.selectedValues, item]
                          }))}
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
              <Button color="primary" onPress={handleSubmit}>Modificar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <Divider />
      <div className="flex flex-col gap-4">
        {
          team?.geographicConf.values.map(({ id, name }) => (
            <div key={id} className="flex flex-col">
              <span>{name}</span>
              <span className="text-foreground-400">{name}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}