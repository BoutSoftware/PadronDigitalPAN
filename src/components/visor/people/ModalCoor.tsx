import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select } from "@nextui-org/react";
import { FormEvent, useEffect, useState } from "react";
import { Visor_User, Visor_structureCoordinator } from "@prisma/client";
import { ACTIVATIONS } from "@/configs/catalogs/visorCatalog";

interface ModalStructCoorProps {
  coordinator?: {
    id: string
    name: string
  }
}

interface FormOptions {
  staffs: { id: string, name: string }[],
  structures: { id: string, name: string }[],
}

export default function ModalCoor({ coordinator: currentCoordinator }: ModalStructCoorProps) {
  const isModifying = !!currentCoordinator;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formOptions, setFormOptions] = useState<FormOptions>({
    staffs: [],
    structures: [],
  });
  const [form, setForm] = useState({
    structCoor: "",
    struct: "",
  });

  // get coordinators
  const getStaffs = async () => {
    const resBody = await (await fetch("/dashboard/api/visor/coordinators?onlyFree=true")).json();

    if (resBody.code !== "OK") {
      if (resBody.code === "NOT_FOUND") {
        console.warn("No coordinators found");
      } else {
        console.error("Error getting coordinators");
      }

      console.log(resBody);
      return;
    }

    setFormOptions((prevOptions) => ({
      ...prevOptions,
      staffs: resBody.data.map((coordinator: Visor_User) => ({
        id: coordinator.id,
        name: coordinator.fullname
      }))
    }));
  };

  // get structures from catalogs
  const getStructures = () => {
    setFormOptions((prevOptions) => ({
      ...prevOptions,
      structures: ACTIVATIONS.map((structure) => ({
        id: structure.id,
        name: structure.nombre
      }))
    }));
  };

  const getCurrentCoordinator = async (currentCoordinator: { id: string; name: string; }) => {
    const resBody = await (await fetch(`/dashboard/api/visor/structureCoordinators/${currentCoordinator.id}`)).json();

    if (resBody.code !== "OK") {
      console.error("Error getting current coordinator");
      return;
    }

    const coorInfo: Visor_structureCoordinator = resBody.data;

    setForm({
      structCoor: currentCoordinator.id,
      struct: coorInfo.structureId,
    });

    // Manually add current coor and tech to options
    setFormOptions((value) => {
      return {
        ...value,
        staffs: [...value.staffs, { id: currentCoordinator.id, name: currentCoordinator.name }],
      };
    });
  };

  // create structure coordinator
  const createStructureCoordinator = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const reqBody = {
      coordinatorId: form.structCoor,
      structureId: form.struct,
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

    handleClose();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setForm({
      structCoor: "",
      struct: "",
    });
  };

  // update structure coordinator
  const updateStructureCoordinator = async (e: FormEvent<HTMLFormElement>, currentCoordinatorId: string) => {
    e.preventDefault();

    const reqBody = {
      structureId: form.struct,
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
      console.log(resBody);
      return alert("Error al modificar el coordinador");
    }

    alert("Coordinador modificado correctamente");

    handleClose();
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

    handleClose();

    // TODO: Actualizar la pantalla de personas cuando se elimine para que haga de nuevo el fetch de cooordinadores
  };

  useEffect(() => {
    // asegurar que cada vez que se abra el modal las opciones esten actualizadas
    if (isModalOpen) {
      getStructures();
      getStaffs();
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
      <Modal size="lg" isOpen={isModalOpen} isDismissable={true} onClose={handleClose} >
        <ModalContent>
          <form onSubmit={isModifying ?
            (e) => updateStructureCoordinator(e, currentCoordinator.id) :
            createStructureCoordinator
          }>

            <ModalHeader>
              <h3>{isModifying ? "Modificar" : "Agregar"} Coordinador de activacion</h3>
            </ModalHeader>
            <ModalBody>
              <Autocomplete
                label="Coordinador de activacion"
                placeholder="Seleccione un coordinador de activacion"
                selectedKey={form.structCoor}
                onSelectionChange={(key) => {
                  setForm({ ...form, structCoor: key as string });
                }}
                isDisabled={isModifying}
                isRequired
              >
                {formOptions.staffs.map((admin) => (
                  <AutocompleteItem key={admin.id}>{admin.name}</AutocompleteItem>
                ))}
              </Autocomplete>
              <Select
                label="Activacion"
                placeholder="Selecciona una activacion"
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
            </ModalBody>
            <ModalFooter className={`flex ${isModifying ? "justify-between" : "justify-end"}`}>
              <Button color="danger" className={`${!isModifying ? "hidden" : ""}`}
                onPress={() => {
                  if (confirm("¿Estás seguro que deseas eliminar este coordinador?")) {
                    deleteStructureCoordinator();
                  }
                }}
              >
                Eliminar
              </Button>
              <Button color="primary" type="submit">{isModifying ? "Modificar" : "Agregar"}</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}