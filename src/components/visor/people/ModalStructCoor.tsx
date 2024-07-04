import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select } from "@nextui-org/react";
import { FormEvent, useEffect, useState } from "react";
import { Visor_User, Visor_structureCoordinator } from "@prisma/client";
import { ESTRUCTURAS } from "@/configs/catalogs/visorCatalog";

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

  // get coordinators
  const getCoordinators = async () => {
    const resBody = await (await fetch("/dashboard/api/visor/coordinators?onlyFree=true")).json();

    if (resBody.code !== "OK") {
      console.error("Error getting coordinators");
      return;
    }

    setFormOptions((prevOptions) => ({
      ...prevOptions,
      coordinators: resBody.data.map((coordinator: Visor_User) => ({
        id: coordinator.id,
        name: coordinator.fullname
      }))
    }));
  };

  // get technicals
  const getTechnicals = async () => {
    const resBody = await (await fetch("/dashboard/api/visor/technicals?onlyFree=true")).json();

    if (resBody.code !== "OK") {
      console.error("Error getting technicals");
      return;
    }

    setFormOptions((prevOptions) => ({
      ...prevOptions,
      technicals: resBody.data.map((technical: Visor_User) => ({
        id: technical.id,
        name: technical.fullname
      }))
    }));
  };

  // get structures from catalogs
  const getStructures = () => {
    setFormOptions((prevOptions) => ({
      ...prevOptions,
      structures: ESTRUCTURAS.map((structure) => ({
        id: structure.id,
        name: structure.nombre
      }))
    }));
  };

  const getCurrentCoordinator = async (currentCoordinator: { id: string; name: string; structureId: string; }) => {
    const resBody = await (await fetch(`/dashboard/api/visor/structureCoordinators/${currentCoordinator.id}`)).json();

    if (resBody.code !== "OK") {
      console.error("Error getting current coordinator");
      return;
    }

    const coorInfo: Visor_structureCoordinator & { Attach: Visor_User, Technical: Visor_User } = resBody.data;

    const coordinatorData = {
      technical: {
        id: coorInfo.Technical.id,
        name: coorInfo.Technical.fullname
      },
      attach: {
        id: coorInfo.Attach.id,
        name: coorInfo.Attach.fullname
      }
    };

    setForm({
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
  };

  // create structure coordinator
  const createStructureCoordinator = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const reqBody = {
      coordinatorId: form.structCoor,
      structureId: form.struct,
      technicalId: form.tecnical,
      attachId: form.attach
    };

    const resBody = await fetch("/dashboard/api/visor/structureCoordinators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody)
    }).then((res) => res.json());

    if (resBody.code === "BAD_FIELDS") {
      return alert("El tecnico y el adjunto de coordinación no pueden ser el mismo usuario");
    }

    if (resBody.code !== "OK") {
      return alert("Error al crear el coordinador");
    }

    // TODO: Improve alerts
    alert("Coordinador creado correctamente");

    setForm({
      structCoor: "",
      struct: "",
      tecnical: "",
      attach: ""
    });

    setIsModalOpen(false);
  };

  // update structure coordinator
  const updateStructureCoordinator = async (e: FormEvent<HTMLFormElement>, currentCoordinatorId: string) => {
    e.preventDefault();

    const reqBody = {
      structureId: form.struct,
      technicalId: form.tecnical,
      attachId: form.attach
    };

    const resBody = await fetch(`/dashboard/api/visor/structureCoordinators/${currentCoordinatorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody)
    }).then((res) => res.json());

    if (resBody.code === "BAD_FIELDS") {
      return alert("El tecnico y el adjunto de coordinación no pueden ser el mismo usuario");
    }

    if (resBody.code !== "OK") {
      return alert("Error al modificar el coordinador");
    }

    alert("Coordinador modificado correctamente");

    setIsModalOpen(false);
  };

  // delete structure coordinator
  const deleteStructureCoordinator = async () => {
    const resBody = await fetch(`/dashboard/api/visor/structureCoordinators/${currentCoordinator?.id}`, {
      method: "DELETE"
    }).then((res) => res.json());

    if (resBody.code !== "OK") {
      return alert("Error al eliminar el coordinador");
    }

    alert("Coordinador eliminado correctamente");

    setIsModalOpen(false);

    // TODO: Actualizar la pantalla de personas cuando se elimine para que haga de nuevo el fetch de cooordinadores
  };

  useEffect(() => {
    // asegurar que cada vez que se abra el modal las opciones esten actualizadas
    if (isModalOpen) {
      getStructures();
      getCoordinators();
      getTechnicals();
      if (isModifying && currentCoordinator) {
        getCurrentCoordinator(currentCoordinator);
      }
    }
  }, [isModalOpen, isModifying, currentCoordinator]);

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
          <form onSubmit={isModifying ?
            (e) => updateStructureCoordinator(e, currentCoordinator.id) :
            createStructureCoordinator
          }>

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
              <Button color="danger" className={`${!isModifying ? "hidden" : ""}`}
                onPress={

                  () => {
                    if (confirm("¿Estás seguro que deseas eliminar este coordinador?")) {
                      deleteStructureCoordinator();
                    }
                  }
                }>

                Eliminar</Button>
              <Button color="primary" type="submit">{isModifying ? "Modificar" : "Agregar"}</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}