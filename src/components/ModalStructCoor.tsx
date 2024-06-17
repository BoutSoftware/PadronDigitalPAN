import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { fakeModuleAdmins } from "@/utils/Fake";

interface ModalStructCoorProps {
  action: "Modificar" | "Agregar";
  coordinatorName?: string;
}

interface SelectedOptions {
  structCoor: string;
  struct: string;
  tecnical: string;
  attach: string;
}

export default function ModalStructCoor({ action, coordinatorName }: ModalStructCoorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    structCoor: "",
    struct: "",
    tecnical: "",
    attach: ""
  });

  useEffect(() => {
    if (coordinatorName) {
      setSelectedOptions({
        ...selectedOptions,
        structCoor: coordinatorName
      });
    }
  }, [coordinatorName]);

  return (
    <>
      <Button
        onPress={() => setIsModalOpen(true)}
        color={action === "Agregar" ? "primary" : "default"}
        variant={action === "Agregar" ? "solid" : "light"}
      >
        {action}
      </Button>
      <Modal size="lg" isOpen={isModalOpen} isDismissable={true} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <form action="">
            <ModalHeader>
              <h3>{action} Coordinador de estructura</h3>
            </ModalHeader>
            <ModalBody>
              <Autocomplete
                label="Coordinador de estructura"
                placeholder="Seleccione un coordinador de estructura"
                selectedKey={selectedOptions.structCoor}
                onSelectionChange={(key) => {
                  setSelectedOptions({ ...selectedOptions, structCoor: key as string });
                }}
                value={selectedOptions.structCoor}
                isDisabled={action === "Modificar"}
                isRequired
              >
                {action === "Modificar" ? (
                  <AutocompleteItem key={coordinatorName!}>{coordinatorName}</AutocompleteItem>
                ) : (
                  fakeModuleAdmins.map((admin) => (
                    <AutocompleteItem key={admin.name}>{admin.name}</AutocompleteItem>
                  ))
                )}
              </Autocomplete>
              <Select
                label="Estructura"
                placeholder="Selecciona una estructura"
                selectedKeys={selectedOptions.struct}
                onSelectionChange={(key) => {
                  setSelectedOptions({ ...selectedOptions, struct: key as string });
                }}
                isRequired
              >
                <SelectItem key="Politico">Política</SelectItem>
                <SelectItem key="Gubernamental">Gubernamental</SelectItem>
                <SelectItem key="OtraEstructura1">Dia E</SelectItem>
                <SelectItem key="OtraEstructura2">Campaña</SelectItem>
              </Select>
              <Autocomplete
                label="Técnico"
                placeholder="Selecciona un técnico"
                selectedKey={selectedOptions.tecnical}
                onSelectionChange={(key) => {
                  setSelectedOptions({ ...selectedOptions, tecnical: key as string });
                }}
                isRequired
              >
                {

                }
              </Autocomplete>
              <Autocomplete
                label="Adjunto"
                placeholder="Selecciona un adjunto"
                selectedKey={selectedOptions.attach}
                onSelectionChange={(key) => {
                  setSelectedOptions({ ...selectedOptions, attach: key as string });
                }}
                isRequired
              >
                <AutocompleteItem key="1">Nombre de prueba</AutocompleteItem>
                <AutocompleteItem key="2">Opción</AutocompleteItem>
                <AutocompleteItem key="3">Opción</AutocompleteItem>
                <AutocompleteItem key="4">Opción</AutocompleteItem>
                <AutocompleteItem key="5">Opción</AutocompleteItem>
              </Autocomplete>
            </ModalBody>
            <ModalFooter className={`flex ${action === "Modificar" ? "justify-between" : "justify-end"}`}>
              <Button color="danger" className={`${action === "Agregar" ? "hidden" : ""}`}>Eliminar</Button>
              <Button color="primary" type="submit">{action}</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}