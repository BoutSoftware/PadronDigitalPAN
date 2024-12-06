"use client";
import React, { useState, useEffect, Key } from "react";
import { CONFIGURACIONES_GEOGRAFICAS } from "@/configs/catalogs/visorCatalog";
import { TeamInterface } from "@/utils/VisorInterfaces";
import {
  Autocomplete,
  AutocompleteItem,
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

interface GeographicValue {
  id: string
  name: string
}

interface Props {
  loadTeam: () => void
  team: TeamInterface
  teamId: string
}

export function GeoArea({ team, loadTeam, teamId }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [geographicValues, setGeographicValues] = useState<GeographicValue[]>([]);
  const [form, setForm] = useState({
    geoLevelId: team.geographicConf.geographicLevel.id,
    geoValues: team.geographicConf.values.map((geoValue) => geoValue.id)
  });

  async function handleSubmit() {
    const reqBody = {
      geographicLevel: form.geoLevelId,
      values: form.geoValues
    };

    const resBody = await fetch(`/dashboard/api/visor/teams/${team.id}/geoConf`, {
      method: "PUT",
      body: JSON.stringify(reqBody)
    })
      .then(res => res.json())
      .catch(err => console.error(err));

    if (resBody.code !== "OK")
      return alert("Error al Actualizar la Configuración Geografica");

    loadTeam();
    setIsModalOpen(false);
  }

  async function getGeographicValues() {
    const geoLevelId: string = team.geographicConf.geographicLevel.id;
    const municipios: string[] = team.Auxiliary.municipios;

    const resBody = await fetch(`/dashboard/api/visor/geographicConfiguration/?geographicLevel=${geoLevelId}&municipios=${municipios.join(",")}`)
      .then(res => res.json())
      .catch(err => console.error(err));

    if (resBody.code !== "OK") {
      console.log(resBody);
      return alert("Error obteniendo los niveles geograficos");
    }

    setGeographicValues(resBody.data);
  }

  function handleGeoValuesChange(key: Key | null) {
    if (!key) return;
    if (form.geoValues.includes(key as string)) return;

    setForm({ ...form, geoValues: [...form.geoValues, key as string] });
  }

  function handleGeoLevelChange(selection: Selection) {
    setForm({ geoLevelId: [...selection][0] as string, geoValues: [] });
  }

  useEffect(() => {
    getGeographicValues();
  }, [form.geoLevelId]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Área geográfica</h2>
        <Button onPress={() => setIsModalOpen(true)}>Modificar área geográfica</Button>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalContent>
            <ModalHeader>
              Modificando área geográfica
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Select
                  label="Nivel Geográfico"
                  placeholder="Selecciona el nivel geográfico"
                  isRequired
                  selectedKeys={[form.geoLevelId]}
                  onSelectionChange={handleGeoLevelChange}
                >
                  {CONFIGURACIONES_GEOGRAFICAS.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.nombre}
                    </SelectItem>
                  ))}
                </Select>
                <Autocomplete
                  label="Valores"
                  placeholder="Seleccione los valores geográficos"
                  isRequired
                  onSelectionChange={handleGeoValuesChange}
                >
                  {geographicValues.map((value) => (
                    <AutocompleteItem key={value.id} value={value.id}>
                      {value.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <div className={`${form.geoValues.length > 4 ? "overflow-y-scroll h-24" : ""} px-8 flex flex-col gap-2`}>
                  {form.geoValues.map((geoValueId) => (
                    <div key={geoValueId} className="flex justify-between items-center py-2 px-4 rounded-md bg-content2">
                      <span className="text-sm">{geographicValues.find((geoValue) => geoValue.id === geoValueId)?.name}</span>
                      <Button isIconOnly className="material-symbols-outlined bg-transparent hover:bg-accent hover:text-white" size="sm" onClick={() => setForm({ ...form, geoValues: form.geoValues.filter((geoValue) => geoValueId !== geoValue) })}>close</Button>
                    </div>
                  ))}
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