"use client";
import { resBody_getSubcoordinatorid } from "@/app/dashboard/api/visor/subcoordinators/[id]/route";
import { ESTRUCTURAS, TIPOS_PUNTO } from "@/configs/catalogs/visorCatalog";
import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Selection } from "@nextui-org/react";
import { Visor_User } from "@prisma/client";
import { useEffect, useState } from "react";

interface ModalSubCoorProps {
  subCoordinatorId?: string;
  subCoordinatorName?: string;
}

interface values {
  subCoor: string
  struct: string
  technicalId: string
  pointTypes: string[]
}

export default function ModalSubCoor({ subCoordinatorId, subCoordinatorName }: ModalSubCoorProps) {
  const isModifying = !!subCoordinatorName;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<values>({
    subCoor: "",
    struct: "",
    technicalId: "",
    pointTypes: [],
  });


  const [subCoordinators, setsubCoordinators] = useState<Visor_User[]>([]);
  const [Technicals, setTechnicals] = useState<Visor_User[]>([]);

  const getSubCoors = async (onlyFree?: boolean) => {
    const url = onlyFree ? `/dashboard/api/visor/coordinators?onlyFree=${onlyFree}` : "/dashboard/api/visor/coordinators";
    const response = await fetch(url);
    const body = await response.json();
    return (body.data as Visor_User[]);
  };

  const getTechnicals = async (onlyFree?: boolean) => {
    const url = onlyFree ? `/dashboard/api/visor/technicals?onlyFree=${onlyFree}` : "/dashboard/api/visor/technicals";
    const response = await fetch(url);
    const body = await response.json();
    return (body.data as Visor_User[]);
  };

  const getSubCoordData = async () => {
    const subCoordinator = await (await fetch(`/dashboard/api/visor/subcoordinators/${subCoordinatorId}`)).json();
    return (subCoordinator.data as resBody_getSubcoordinatorid);
  };

  const getData = async () => {
    const subCoordinators = await getSubCoors(true);
    const Technicals = await getTechnicals(true);
    setsubCoordinators(subCoordinators);
    setTechnicals(Technicals);
  };

  const setData = async () => {
    await getData();
    const subCoordinator = await getSubCoordData();
    setFormValues({
      subCoor: subCoordinator.id,
      struct: subCoordinator.structureId,
      technicalId: subCoordinator.Technical.id,
      pointTypes: subCoordinator.pointTypesIDs
    });

    // add subCoordinator.technicalId to Technicals
    setTechnicals([...Technicals, subCoordinator.Technical]);
  };

  useEffect(() => {

    if (!isModifying) {
      getData();

    }

    if (isModifying) {
      setData();
    }


  }, []);

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
      setIsModalOpen(false);
    } else {
      alert("Error al agregar el subcoordinador");
    }

    getData();

  };

  useEffect(() => {
    console.log(formValues);
    // console.log(Technicals);

  }, [formValues]);

  return (
    <>
      <form>
        <Button
          onPress={() => setIsModalOpen(true)}
          color={!isModifying ? "primary" : "default"}
          variant={!isModifying ? "solid" : "light"}
        >{isModifying ? "Modificar" : "Agregar"}</Button>

        <Modal size="lg" isOpen={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)}>
          <ModalContent>
            <ModalHeader>
              <h3>{isModifying ? "Modificar" : "Agregar"} Subcoordinador</h3>
            </ModalHeader>
            <ModalBody>
              <Autocomplete
                label="Subcoordinador de estructura"
                placeholder="Seleccione un subcoordinador de estructura"
                onChange={(e) => {
                  setFormValues({ ...formValues, subCoor: e.target.value });
                }}
                value={formValues.subCoor}
                defaultSelectedKey={formValues.subCoor}
                isDisabled={isModifying}
                isRequired>
                {
                  isModifying ? (
                    <AutocompleteItem key={subCoordinatorId!}>{subCoordinatorName}</AutocompleteItem>
                  ) : (
                    subCoordinators.map((subCoor) => (
                      <AutocompleteItem key={subCoor.id}>{subCoor.fullname}</AutocompleteItem>
                    ))
                  )
                }
              </Autocomplete>
              <Select
                label="Estructura"
                placeholder="Selecciona una estructura"
                onChange={(e) => {
                  setFormValues({ ...formValues, struct: e.target.value, pointTypes: [] });
                }}
                selectedKeys={[formValues.struct]}
                isRequired>
                {
                  ESTRUCTURAS.map((struct) => (
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
                  TIPOS_PUNTO.filter((point) => point.estructuraId === formValues.struct).map((point) => (
                    <AutocompleteItem key={point.id}>{point.nombre}</AutocompleteItem>
                  ))
                }
              </Select>
            </ModalBody>
            <ModalFooter className={`flex ${isModifying ? "justify-between" : "justify-end"}`}>
              <Button color="danger" className={`${!isModifying ? "hidden" : ""}`}>Eliminar</Button>
              <Button color="primary" type="submit" onClick={handleSubmit}>{isModifying ? "Modificar" : "Agregar"}</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </form>
    </>
  );
}