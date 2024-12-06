"use client";
import { resBody_getSubcoordinatorid } from "@/app/dashboard/api/visor/subcoordinators/[id]/route";
import { ACTIVATIONS, TIPOS_PUNTO } from "@/configs/catalogs/visorCatalog";
import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Selection } from "@nextui-org/react";
import { Visor_User } from "@prisma/client";
import { useEffect, useState } from "react";

interface ModalSubCoorProps {
  subCoordinatorId?: string;
}

interface values {
  subCoor: string
  struct: string
  technicalId: string
  pointTypes: string[]
}

export default function ModalResp({ subCoordinatorId }: ModalSubCoorProps) {
  const isModifying = !!subCoordinatorId;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subCoordinators, setSubCoordinators] = useState<Visor_User[]>([]);
  const [Technicals, setTechnicals] = useState<Visor_User[]>([]);
  const [formValues, setFormValues] = useState<values>({
    subCoor: "",
    struct: "",
    technicalId: "",
    pointTypes: [],
  });

  const getSubCoors = async () => {
    const resBody = await fetch("/dashboard/api/visor/coordinators?onlyFree=true").then(res => res.json());

    if (resBody.code !== "OK") {
      if (resBody.code === "NOT_FOUND") {
        console.warn("No coordinators found");
      } else {
        console.error("Error getting coordinators");
        alert("Error al obtener Coordinadores");
      }

      return;
    }

    setSubCoordinators(resBody.data);
  };

  const getTechnicals = async () => {
    const resBody = await fetch("/dashboard/api/visor/technicals?onlyFree=true").then(res => res.json());

    if (resBody.code !== "OK") {
      if (resBody.code === "NOT_FOUND") {
        console.warn("No technicals found");
      } else {
        alert("Error al obtener Tecnicos");
        console.error("Error getting technicals");
        console.log(resBody);
      }

      return;
    }

    setTechnicals(resBody.data);
  };

  const getSubCoordData = async () => {
    const resBody = await (await fetch(`/dashboard/api/visor/subcoordinators/${subCoordinatorId}`)).json();

    if (resBody.code !== "OK")
      return alert("Error al obtener el Coordinador");

    const subCoordinator = resBody.data;

    setFormValues({
      subCoor: subCoordinator.id,
      struct: subCoordinator.structureId,
      technicalId: subCoordinator.Technical.id,
      pointTypes: subCoordinator.pointTypesIDs
    });

    setSubCoordinators(prev => [
      ...prev,
      {
        ...subCoordinator,
        id: subCoordinatorId,
        fullname: subCoordinator.fullName,
      }
    ]);

    setTechnicals(prev => [
      ...prev,
      {
        ...subCoordinator.Technical,
        id: subCoordinator.Technical.id,
        name: subCoordinator.Technical.fullname,
      }
    ]);
  };

  const handleSubmit = async () => {

    if (!formValues.subCoor || !formValues.technicalId || !formValues.struct) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const request: RequestInit = {
      method: isModifying ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    };

    const url = isModifying
      ? `/dashboard/api/visor/subcoordinators/${subCoordinatorId}`
      : "/dashboard/api/visor/subcoordinators";

    const response = await fetch(url, request);

    const body = await response.json();

    if (body.code === "OK") {
      alert("Subcoordinador agregado correctamente");
      setFormValues({
        subCoor: "",
        struct: "",
        technicalId: "",
        pointTypes: []
      });

      handleClose();
    } else {
      alert("Error al agregar el subcoordinador");
    }
  };

  const deleteSubcoordinator = async () => {
    const resBody = await fetch(`/dashboard/api/visor/subcoordinators/${subCoordinatorId}`, {
      method: "DELETE"
    }).then((res) => res.json());

    if (resBody.code !== "OK") {
      return alert("Error al eliminar el subcoordinador");
    }

    alert("Subcoordinador eliminado correctamente");

    handleClose();
    window.location.reload();

    // TODO: Actualizar la pantalla de personas cuando se elimine para que haga de nuevo el fetch de subcooordinadores
  };

  const handleClose = () => {
    setIsModalOpen(false);

    setFormValues({
      subCoor: "",
      struct: "",
      technicalId: "",
      pointTypes: [],
    });
  };

  useEffect(() => {
    if (isModalOpen) {
      getSubCoors();
      getTechnicals();

      if (isModifying) {
        getSubCoordData();
      }
    }
  }, [isModalOpen, isModifying]);

  return (
    <form>
      <Button
        onPress={() => setIsModalOpen(true)}
        color={!isModifying ? "primary" : "default"}
        variant={!isModifying ? "solid" : "light"}
      >
        {isModifying ? "Modificar" : "Agregar"}
      </Button>

      <Modal size="lg" isOpen={isModalOpen} onClose={handleClose}>
        <ModalContent>
          <ModalHeader>
            <h3>{isModifying ? "Modificar" : "Agregar"} Subcoordinador</h3>
          </ModalHeader>
          <ModalBody>
            <Autocomplete
              label="Subcoordinador de activacion"
              placeholder="Seleccione un subcoordinador de activacion"
              onChange={(e) => {
                setFormValues({ ...formValues, subCoor: e.target.value });
              }}
              selectedKey={formValues.subCoor}
              // isDisabled={isModifying}
              isRequired
            >
              {subCoordinators.map((subCoor) => (
                <AutocompleteItem key={subCoor.id}>{subCoor.fullname}</AutocompleteItem>
              ))}
            </Autocomplete>
            <Select
              label="Activacion"
              placeholder="Selecciona una activacion"
              onChange={(e) => {
                setFormValues({ ...formValues, struct: e.target.value, pointTypes: [] });
              }}
              selectedKeys={formValues.struct ? [formValues.struct] : []}
              isRequired>
              {
                ACTIVATIONS.map((struct) => (
                  <SelectItem key={struct.id}>{struct.nombre}</SelectItem>
                ))
              }
            </Select>
            <Autocomplete
              label="Técnico"
              placeholder="Seleccione un técnico"
              onChange={(e) => {
                setFormValues({ ...formValues, technicalId: e.target.value });
              }}
              selectedKey={formValues.technicalId}
              isRequired>
              {
                Technicals.map((user) => (
                  <AutocompleteItem key={user.id}>{user.fullname}</AutocompleteItem>
                ))
              }
            </Autocomplete>
            <Select
              label="Tipos de punto"
              placeholder="Selecciona los tipos de punto"
              multiple
              onChange={(e) => {
                setFormValues({ ...formValues, pointTypes: Array.from(e.target.value.split(",")) });
              }}
              selectedKeys={formValues.pointTypes}
              selectionMode="multiple"
              isDisabled={formValues.struct.length === 0}
            >
              {
                TIPOS_PUNTO.filter((point) => point.activacionId === formValues.struct).map((point) => (
                  <AutocompleteItem key={point.id}>{point.nombre}</AutocompleteItem>
                ))
              }
            </Select>
          </ModalBody>
          <ModalFooter className={`flex ${isModifying ? "justify-between" : "justify-end"}`}>
            <Button
              color="danger"
              className={`${!isModifying ? "hidden" : ""}`}
              onPress={
                () => {
                  if (confirm("¿Estás seguro de que deseas eliminar este subcoordinador?")) {
                    deleteSubcoordinator();
                  }
                }
              }
            >
              Eliminar
            </Button>
            <Button color="primary" type="submit" onClick={handleSubmit}>{isModifying ? "Modificar" : "Agregar"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  );
}