import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select } from "@nextui-org/react";
import { Key, useEffect, useState } from "react";
import { fakeCoordinators, fakeStrctures, fakeTechnicals } from "@/utils/Fake";

interface ModalAuxiliareCoorProps {
  auxCoordinator?: {
    id: string
    name: string
    structureId: string
  };
  subCoordinators?: {
    id: string
    name: string
    structureId: string
  }
}

interface FormOptions {
  auxCoordinators: { id: string, name: string }[],
  structures: { id: string, name: string }[],
  subCoordinators: { id: string, name: string }[],
  municipios: { id: string, name: string }[],
  technicals: { id: string, name: string }[],
}

export default function AuxiliaresModal({ auxCoordinator: currentAuxCoordinator }: ModalAuxiliareCoorProps) {
  const isModifying = !!currentAuxCoordinator
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formOptions, setFormOptions] = useState<FormOptions>({
    auxCoordinators: [],
    subCoordinators: [],
    structures: [],
    technicals: [],
    municipios: [],
  })
  const [form, setForm] = useState({
    auxStructCoor: "",
    subStructCoor: "",
    struct: "",
    tecnical: "",
    municipio: ""
  });

  useEffect(() => {
    // Get Selects Data from API
    setFormOptions({
      auxCoordinators: fakeCoordinators,
      subCoordinators: fakeCoordinators,
      structures: fakeStrctures,
      technicals: fakeTechnicals,
      municipios: fakeTechnicals,
    })

    if (isModifying && currentAuxCoordinator) {
      // Get coordinator info from the API
      const coordinatorData = {
        technical: {
          id: "1",
          name: "Julio"
        },
        attach: {
          id: "2",
          name: "Agosto"
        }
      }

      // Set Current Coordinator Info to form
      setForm({
        auxStructCoor: currentAuxCoordinator.id,
        subStructCoor: currentAuxCoordinator.id,
        struct: currentAuxCoordinator.structureId,
        municipio: coordinatorData.attach.id,
        tecnical: coordinatorData.technical.id
      });

      // Manually add current coordinator and tech to options
      setFormOptions((value) => {
        return {
          ...value,
          auxCoordinators: [...value.auxCoordinators, { id: currentAuxCoordinator.id, name: currentAuxCoordinator.name }],
          subCoordinators: [...value.subCoordinators, { id: currentAuxCoordinator.id, name: currentAuxCoordinator.name }],
          technicals: [...value.technicals, { id: coordinatorData.technical.id, name: coordinatorData.technical.name }, { id: coordinatorData.attach.id, name: coordinatorData.attach.name }],
        }
      })
    }
  }, [currentAuxCoordinator]);

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
              <h3>{isModifying ? "Modificar" : "Agregar"} Auxiliar de coordinación</h3>
            </ModalHeader>
            <ModalBody>
              <Autocomplete
                label="Auxiliar de coordinación"
                placeholder="Seleccione un auxiliar de coordinación"
                selectedKey={form.auxStructCoor}
                onSelectionChange={(key) => {
                  setForm({ ...form, auxStructCoor: key as string });
                }}
                isDisabled={isModifying}
                isRequired
              >
                {formOptions.auxCoordinators.map((admin) => (
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
                label="Sub coordinador"
                placeholder="Ingrese el sub coordinador"
                selectedKey={form.subStructCoor}
                onSelectionChange={(key) => {
                  setForm({ ...form, subStructCoor: key as string });
                }}
                isDisabled={isModifying}
                isRequired
              >
                {formOptions.subCoordinators.map((admin) => (
                  <AutocompleteItem key={admin.id}>{admin.name}</AutocompleteItem>
                ))}
              </Autocomplete>
              <Autocomplete
                label="Municipios"
                placeholder="Seleccione los municipios"
                selectedKey={form.municipio}
                onSelectionChange={(key) => {
                  setForm({ ...form, municipio: key as string });
                }}
                isRequired
              >
                {formOptions.municipios.map((municipio) => (
                  <AutocompleteItem key={municipio.id}>{municipio.name}</AutocompleteItem>
                ))}
              </Autocomplete>
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
