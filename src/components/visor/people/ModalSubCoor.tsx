"use client";
import { fakeModuleSubCoor, fakeModuleUsers, fakePointTypes } from "@/utils/Fake";
import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Selection } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface ModalSubCoorProps {
  action: "Modificar" | "Agregar";
  subCoordinatorName?: string;
}

interface formValues {
  subCoor: string
  struct: string
  tecnical: string
  pointTypes: Selection
}

export default function ModalSubCoor({ action, subCoordinatorName }: ModalSubCoorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<formValues>({
    subCoor: "",
    struct: "",
    tecnical: "",
    pointTypes: new Set([])
  });

  useEffect(() => {
    if (subCoordinatorName) setFormValues({
      ...formValues,
      subCoor: subCoordinatorName
    });
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
            <h3>{action} Subcoordinador</h3>
          </ModalHeader>
          <ModalBody>
            <Autocomplete
              label="Coordinador de estructura"
              placeholder="Seleccione un coordinador de estructura"
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
            <Select
              label="Tipos de punto"
              placeholder="Selecciona los tipos de punto"
              selectedKeys={formValues.pointTypes}
              multiple
              onSelectionChange={(selectedKeys) => setFormValues({ ...formValues, pointTypes: selectedKeys })}
              selectionMode="multiple"
            >
              {
                fakePointTypes.map((point) => (
                  <AutocompleteItem key={point}>{point}</AutocompleteItem>
                ))
              }
            </Select>
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