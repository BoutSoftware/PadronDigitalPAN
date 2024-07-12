"use client";
import React, { useState, useEffect, Key } from "react";
import { CONFIGURACIONES_GEOGRAFICAS } from "@/configs/catalogs/visorCatalog";
import { TeamInterface } from "@/utils/VisorInterfaces";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Selection,
  SelectItem,
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
  const [valueSearched, setValueSearched] = useState("");
  const [geographicValuesIds, setGeographicValuesIds] = useState<string[]>(team.geographicConf.values.map(val => val.id));

  useEffect(() => {
    getGeographicValues();
  }, []);

  async function handleSubmit() {
    const geographicLevelId = Array.from(geoLevelKey)[0];

    const modifiedData = await updateTeamGeographicConfig(geographicLevelId.toString(), geographicValuesIds);
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

    if (newGeographicLevelId == team.geographicConf.geographicLevel.id) {
      setGeographicValuesIds(team.geographicConf.values.map(val => val.id));
    } else {
      setGeographicValuesIds([]);
    }

    setValueSearched("");
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
    console.log(resBody);
    if (resBody.code !== "OK") return;

    return resBody.data;
  }


  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Área geográfica</h2>
        <Button onPress={() => setIsModalOpen(true)}>Modificar área geográfica</Button>

        <Modal isOpen={isModalOpen}>
          <ModalContent>
            <ModalHeader>
              Modificando área geográfica
            </ModalHeader>
            <ModalBody>
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
                <Input
                  label="Valor geográfico"
                  placeholder="Busca un valor geográfico"
                  value={valueSearched}
                  onValueChange={setValueSearched}
                />
                <CheckboxGroup
                  label="Valores geográficos"
                  value={geographicValuesIds}
                  onValueChange={setGeographicValuesIds}
                  className="min-h-[150px] max-h-[250px] overflow-auto"
                >
                  {geographicValues.values.filter((val) => val.name.toUpperCase().includes(valueSearched.toUpperCase())).map(({ id, name }) => <Checkbox key={id} value={id}>{name}</Checkbox>)}
                </CheckboxGroup>
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