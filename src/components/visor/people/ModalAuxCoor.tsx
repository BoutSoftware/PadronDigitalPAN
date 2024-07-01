"use client";
import { fakeModuleSubCoor, fakeModuleUsers, fakePointTypes } from "@/utils/Fake";
import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Selection } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface ModalAuxCoorProps {
  action: "Modificar" | "Agregar";
  auxCoordinatorName?: string;
  subCoordinatorName?: string,
}

interface formValues {
  auxCoor: string
  struct: string
  subCoor: string
  municipios: string
  tecnical: string
}

export default function ModalAuxCoor({ action, auxCoordinatorName, subCoordinatorName }: ModalAuxCoorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<formValues>({
    auxCoor: "",
    struct: "",
    subCoor: "",
    municipios: "",
    tecnical: "",
  });

  useEffect(() => {
    if (auxCoordinatorName) setFormValues({
      ...formValues,
      auxCoor: auxCoordinatorName
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(formValues);
  }, [formValues]);

  return (
    <>
      <Button
        onPress={() => setIsModalOpen(true)}
        color={action === "Agregar" ? "primary" : "default"}
        variant={action === "Agregar" ? "solid" : "light"}
      >{action}</Button>

      <Modal size="lg" isOpen={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)}>
        <ModalContent>
          <ModalHeader>
            <h3>{action} auxiliar de coordinación</h3>
          </ModalHeader>
          <ModalBody>
            <Autocomplete
              label="Auxiliar de coordinación"
              placeholder="Seleccione un auxiliar de coordinación"
              selectedKey={formValues.auxCoor}
              onSelectionChange={(key) => {
                setFormValues({ ...formValues, auxCoor: key as string });
              }}
              value={formValues.auxCoor}
              isDisabled={action === "Modificar"}
              isRequired>
              {
                action == "Modificar" ? (
                  <AutocompleteItem key={auxCoordinatorName!}>{auxCoordinatorName}</AutocompleteItem>
                ) : (
                  fakeModuleSubCoor.map((subCoor) => (
                    <AutocompleteItem key={subCoor.name}>{subCoor.name}</AutocompleteItem>
                  ))
                )
              }
            </Autocomplete>
            <Select
              label="Estructura"
              placeholder="Selecciona una estructura"
              selectedKeys={formValues.struct}
              onSelectionChange={(key) => {
                setFormValues({ ...formValues, struct: key as string });
              }}
              isRequired>
              <SelectItem key="Politico">Política</SelectItem>
              <SelectItem key="Gubernamental">Gubernamental</SelectItem>
              <SelectItem key="DiaE">Dia E</SelectItem>
              <SelectItem key="Camapaña">Campaña</SelectItem>
            </Select>
            <Autocomplete
              label="Sub-Coordinador"
              placeholder="Ingrese el sub coordinador"
              selectedKey={formValues.subCoor}
              onSelectionChange={(key) => {
                setFormValues({ ...formValues, subCoor: key as string });
              }}
              value={formValues.subCoor}
              isDisabled={action === "Modificar"}
              isRequired>
              {
                action == "Modificar" ? (
                  <AutocompleteItem key={subCoordinatorName!}>{subCoordinatorName}</AutocompleteItem>
                ) : (
                  fakeModuleSubCoor.map((subCoor) => (
                    <AutocompleteItem key={subCoor.name}>{subCoor.name}</AutocompleteItem>
                  ))
                )
              }
            </Autocomplete>
            <Select
              label="Municipios"
              placeholder="Seleccione los municipios"
              selectionMode="multiple"
              selectedKeys={formValues.municipios}
              onSelectionChange={(key) => {
                setFormValues({ ...formValues, municipios: key as string });
              }}
              isRequired>
              <SelectItem key="Politico">Querétaro</SelectItem>
              <SelectItem key="Gubernamental">San Juan del Río</SelectItem>
              <SelectItem key="DiaE">El Marqués</SelectItem>
              <SelectItem key="Camapaña">Tequisquiapan</SelectItem>
            </Select>
            <Autocomplete
              label="Técnico"
              placeholder="Seleccione un técnico"
              selectedKey={formValues.tecnical}
              onSelectionChange={(key) => {
                setFormValues({ ...formValues, tecnical: key as string });
              }}
              value={formValues.tecnical}
              isRequired>
              {
                fakeModuleUsers.map((user) => (
                  <AutocompleteItem key={user.name}>{user.name}</AutocompleteItem>
                ))
              }
            </Autocomplete>
          </ModalBody>
          <ModalFooter className={`flex ${action === "Modificar" ? "justify-between" : "justify-end"}`}>
            <Button color="danger" className={`${action === "Agregar" ? "hidden" : ""}`}>Eliminar</Button>
            <Button color="primary" type="submit">{action}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}