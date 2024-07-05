"use client";
import { ESTRUCTURAS, TIPOS_PUNTO } from "@/configs/catalogs/visorCatalog";
import { fakeModuleSubCoor, fakeModuleUsers, fakePointTypes } from "@/utils/Fake";
// import { getSubCoors, getTechnicals } from "@/utils/requests/people";
import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Selection } from "@nextui-org/react";
import { Visor_User } from "@prisma/client";
import { useEffect, useState } from "react";




interface ModalSubCoorProps {
  subCoordinatorName?: string;
}

interface formValues {
  subCoor: string
  struct: Selection,
  technicalId: string
  pointTypes: Selection
}

export default function ModalSubCoor({ subCoordinatorName }: ModalSubCoorProps) {
  const isModifying = !!subCoordinatorName;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<formValues>({
    subCoor: "",
    struct: new Set([]),
    technicalId: "",
    pointTypes: new Set([])
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

  const getData = async () => {
    const subCoordinators = await getSubCoors(true);
    const Technicals = await getTechnicals(true);
    setsubCoordinators(subCoordinators);
    setTechnicals(Technicals);
  };

  useEffect(() => {
    if (!isModifying) {
      getData();
    }

    if (subCoordinatorName) setFormValues({
      ...formValues,
      subCoor: subCoordinatorName
    });
  }, []);

  const handleSubmit = async () => {

    const formattedFormValues = {
      userId: formValues.subCoor,
      technicalId: formValues.technicalId,
      structureId: [...formValues.struct][0],
      pointTypesIDs: Array.from(formValues.pointTypes),
    };
    
    const response = await fetch("/dashboard/api/visor/subcoordinators", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedFormValues),
    });

    const body = await response.json();

    if (body.code === "OK") {
      alert("Subcoordinador agregado correctamente");
      setFormValues({
        subCoor: "",
        struct: new Set([]),
        technicalId: "",
        pointTypes: new Set([])
      });
      setIsModalOpen(false);
    } else {
      alert("Error al agregar el subcoordinador");
    }

    getData();

  };

  useEffect(() => {
    console.log(formValues);
  }, [formValues]);

  return (
    <>
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
              selectedKey={formValues.subCoor}
              onSelectionChange={(key) => {
                setFormValues({ ...formValues, subCoor: key as string });
              }}
              value={formValues.subCoor}
              isDisabled={isModifying}
              isRequired>
              {
                isModifying ? (
                  <AutocompleteItem key={subCoordinatorName!}>{subCoordinatorName}</AutocompleteItem>
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
              selectedKeys={formValues.struct}
              onSelectionChange={(key) => {
                setFormValues({ ...formValues, struct: key });
              }}
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
              selectedKey={formValues.technicalId}
              onSelectionChange={(key) => {
                setFormValues({ ...formValues, technicalId: key as string });
              }}
              value={formValues.technicalId}
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
              selectedKeys={formValues.pointTypes}
              multiple
              onSelectionChange={(selectedKeys) => setFormValues({ ...formValues, pointTypes: selectedKeys })}
              selectionMode="multiple"
              isDisabled={ Array.from(formValues.struct).length === 0 }
            >
              {
                TIPOS_PUNTO.filter((point) => point.estructuraId === Array.from(formValues.struct)[0]).map((point) => (
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
    </>
  );
}