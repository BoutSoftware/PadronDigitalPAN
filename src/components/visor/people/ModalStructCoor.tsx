import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { fakeCoordinators, fakeStructures, fakeTechnicals } from "@/utils/Fake";

interface ModalStructCoorProps {
  coordinator?: {
    id: string
    name: string
    structureId: string
  }
}

interface FormOptions {
  coordinators: { id: string, name: string }[],
  structures: { id: string, name: string }[],
  technicals: { id: string, name: string }[],
}

export default function ModalStructCoor({ coordinator: currentCoordinator }: ModalStructCoorProps) {
  const isModifying = !!currentCoordinator;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formOptions, setFormOptions] = useState<FormOptions>({
    coordinators: [],
    structures: [],
    technicals: []
  });
  const [form, setForm] = useState({
    structCoor: "",
    struct: "",
    tecnical: "",
    attach: ""
  });

  useEffect(() => {
    // TODO: Get Selects Data from API
    setFormOptions({
      structures: fakeStructures,
      coordinators: fakeCoordinators,
      technicals: fakeTechnicals,
    });

    if (isModifying) {
      // TODO: Get coordinator info from the API
      const coordinatorData = {
        technical: {
          id: "1",
          name: "Julio"
        },
        attach: {
          id: "2",
          name: "Agosto"
        }
      };

      // Set Current Coordinator Info to formulary
      setForm({
        ...form,
        structCoor: currentCoordinator.id,
        struct: currentCoordinator.structureId,
        attach: coordinatorData.attach.id,
        tecnical: coordinatorData.technical.id
      });

      // Manually add current coor and tech to options
      setFormOptions((value) => {
        return {
          ...value,
          coordinators: [...value.coordinators, { id: currentCoordinator.id, name: currentCoordinator.name }],
          technicals: [...value.technicals, { id: coordinatorData.technical.id, name: coordinatorData.technical.name }, { id: coordinatorData.attach.id, name: coordinatorData.attach.name }],
        };
      });
    }
  }, [currentCoordinator, form, isModifying]);

  return (
    <>
      <Button
        onPress={() => setIsModalOpen(true)}
        color={!isModifying ? "primary" : "default"}
        variant={!isModifying ? "solid" : "light"}
      >
        {isModifying ? "Modificar" : "Agregar"}
      </Button>
      <Modal size="lg" isOpen={isModalOpen} isDismissable={true} onClose={() => setIsModalOpen(false)} >
        <ModalContent>
          <form>
            <ModalHeader>
              <h3>{isModifying ? "Modificar" : "Agregar"} Coordinador de estructura</h3>
            </ModalHeader>
            <ModalBody>
              <Autocomplete
                label="Coordinador de estructura"
                placeholder="Seleccione un coordinador de estructura"
                selectedKey={form.structCoor}
                onSelectionChange={(key) => {
                  setForm({ ...form, structCoor: key as string });
                }}
                isDisabled={isModifying}
                isRequired
              >
                {formOptions.coordinators.map((admin) => (
                  <AutocompleteItem key={admin.id}>{admin.name}</AutocompleteItem>
                ))}
              </Autocomplete>
              <Select
                label="Estructura"
                placeholder="Selecciona una estructura"
                selectedKeys={form.struct ? [form.struct] : []}
                onSelectionChange={(selection) => {
                  if (selection === "all") return;
                  setForm({ ...form, struct: [...selection][0] as string });
                }}
                isRequired
              >
                {formOptions.structures.map((structure) => (
                  <AutocompleteItem key={structure.id}>{structure.name}</AutocompleteItem>
                ))}
              </Select>
              <Autocomplete
                label="Técnico"
                placeholder="Selecciona un técnico"
                selectedKey={form.tecnical}
                onSelectionChange={(key) => {
                  setForm({ ...form, tecnical: key as string });
                }}
                isRequired
              >
                {formOptions.technicals.map((technical) => (
                  <AutocompleteItem key={technical.id}>{technical.name}</AutocompleteItem>
                ))}
              </Autocomplete>
              <Autocomplete
                label="Adjunto"
                placeholder="Selecciona un adjunto"
                selectedKey={form.attach}
                onSelectionChange={(key) => {
                  setForm({ ...form, attach: key as string });
                }}
                isRequired
              >
                {formOptions.technicals.map((technical) => (
                  <AutocompleteItem key={technical.id}>{technical.name}</AutocompleteItem>
                ))}
              </Autocomplete>
            </ModalBody>
            <ModalFooter className={`flex ${isModifying ? "justify-between" : "justify-end"}`}>
              <Button color="danger" className={`${!isModifying ? "hidden" : ""}`}>Eliminar</Button>
              <Button color="primary" type="submit">{isModifying ? "Modificar" : "Agregar"}</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}