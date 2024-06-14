import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

interface ModalStructCoorProps {
  action: "Modificar" | "Agregar"
  coordinatorName?: string
}

export default function ModalStructCoor({ action, coordinatorName }: ModalStructCoorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onPress={() => setIsModalOpen(true)}
        color={action == "Agregar" ? "primary" : "default"}
        variant={action == "Agregar" ? "solid" : "light"}>{action}</Button>
      <Modal size="lg" isOpen={isModalOpen} isDismissable={true}>
        <ModalContent>
          <ModalHeader>
            <h3>{action} Coordinador de estructura</h3>
          </ModalHeader>
          <ModalBody>
            <Autocomplete
              label="Coorindador de estructura"
              placeholder="Seleccine un coordinador de estructura"
              selectedKey={1}
              value={action == "Modificar" ? coordinatorName : ""}
              isDisabled={action == "Modificar" ? true : false}
              contentEditable={action == "Agregar" ? true : false}
              isRequired
            >
              <AutocompleteItem key={1}>{"Nombre de prueba"}</AutocompleteItem>
              <AutocompleteItem key={2}>Opcion</AutocompleteItem>
              <AutocompleteItem key={3}>Opcion</AutocompleteItem>
              <AutocompleteItem key={4}>Opcion</AutocompleteItem>
              <AutocompleteItem key={5}>Opcion</AutocompleteItem>
            </Autocomplete>
            <Select
              label="Estructura"
              placeholder="Selecciona una estructura"
              isRequired
            >
              <SelectItem key="Politico">Política</SelectItem>
              <SelectItem key="Gubernamental">Gubernamental</SelectItem>
              <SelectItem key="OtraEstructura1">Otra estructura</SelectItem>
              <SelectItem key="OtraEstructura2">Otra estructura</SelectItem>
            </Select>
            <Autocomplete
              label="Técnico"
              placeholder="Selecciona un técnico"
              isRequired
            >
              <AutocompleteItem key={1}>{"Nombre de prueba"}</AutocompleteItem>
              <AutocompleteItem key={2}>Opcion</AutocompleteItem>
              <AutocompleteItem key={3}>Opcion</AutocompleteItem>
              <AutocompleteItem key={4}>Opcion</AutocompleteItem>
              <AutocompleteItem key={5}>Opcion</AutocompleteItem>
            </Autocomplete>
            <Autocomplete
              label="Adjunto"
              placeholder="Selecciona un adjunto"
              isRequired
            >
              <AutocompleteItem key={1}>{"Nombre de prueba"}</AutocompleteItem>
              <AutocompleteItem key={2}>Opcion</AutocompleteItem>
              <AutocompleteItem key={3}>Opcion</AutocompleteItem>
              <AutocompleteItem key={4}>Opcion</AutocompleteItem>
              <AutocompleteItem key={5}>Opcion</AutocompleteItem>
            </Autocomplete>
          </ModalBody>
          <ModalFooter className={`flex ${action == "Modificar" ? "justify-between" : "justify-end"}`}>
            <Button color="danger" className={`${action == "Agregar" ? "hidden" : ""}`}>Eliminar</Button>
            <Button color="primary">Agregar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}