"use client";
import { useEffect, useState, FormEvent } from "react";
import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { ESTRUCTURAS } from "@/configs/catalogs/visorCatalog";

interface ModalAuxCoorProps {
  action: "Modificar" | "Agregar";
  auxCoordinatorName?: string;
  subCoordinatorName?: string;
}

interface FormValues {
  auxCoor: string;
  struct: string;
  subCoor: string;
  municipios: string[];
  tecnical: string;
}

interface SubCoordinator {
  id: string;
  createdAt: string;
  active: boolean;
  userId: string;
  technicalId: string;
  pointTypesIDs: string[];
  structureId: string;
}

interface Municipio {
  id: string;
  name: string;
  postalCode: number;
  municipioId: string;
  delegationId: string;
}

interface Technical {
  id: string;
  createdAt: string;
  active: boolean;
  userId: string;
  fullname: string;
  title: string;
  rol: string;
}

interface FormOptions {
  subCoordinators: SubCoordinator[];
  structures: { id: string, name: string }[],
  municipios: Municipio[];
  technicals: Technical[];
}

export default function ModalAuxCoor({ action, auxCoordinatorName, subCoordinatorName }: ModalAuxCoorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    auxCoor: "",
    struct: "",
    subCoor: "",
    municipios: [],
    tecnical: "",
  });
  const [formOptions, setFormOptions] = useState<FormOptions>({
    subCoordinators: [],
    structures: [],
    municipios: [],
    technicals: []
  });

  useEffect(() => {
    if (auxCoordinatorName) setFormValues(prev => ({ ...prev, auxCoor: auxCoordinatorName }));
  }, [auxCoordinatorName]);

  useEffect(() => {
    if (isModalOpen) {
      if (action === "Modificar") {
        fetchAuxiliaryDetails();
      }
      fetchFormOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, isModalOpen]);

  const fetchAuxiliaryDetails = async () => {
    const res = await fetch(`/dashboard/api/visor/auxiliaries/${formValues.auxCoor}`);
    const result = await res.json();
    if (result.code === "OK") {
      const { struct, subCoor, municipios, tecnical } = result.data;
      setFormValues({ auxCoor: auxCoordinatorName!, struct, subCoor, municipios, tecnical });
    }
  };

  const fetchFormOptions = async () => {
    const subCoordRes = await fetch("/dashboard/api/visor/subcoordinators?estructura=territorial");
    const subCoordResult = await subCoordRes.json();

    const muniRes = await fetch("/dashboard/api/visor/geographicConfiguration?geographicLevel=colonias");
    const muniResult = await muniRes.json();

    const techRes = await fetch("/dashboard/api/visor/technicals?onlyFree=false");
    const techResult = await techRes.json();

    // Llamamos a la función getStructures para obtener las estructuras
    getStructures();

    setFormOptions({
      subCoordinators: subCoordResult.data,
      municipios: muniResult.data,
      technicals: techResult.data,
      // Agregamos las estructuras al estado formOptions
      structures: ESTRUCTURAS.map((structure) => ({
        id: structure.id,
        name: structure.nombre
      }))
    });
  };

  // Función para obtener las estructuras desde ESTRUCTURAS
  const getStructures = () => {
    setFormOptions((prevOptions) => ({
      ...prevOptions,
      structures: ESTRUCTURAS.map((structure) => ({
        id: structure.id,
        name: structure.nombre
      }))
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = action === "Agregar" ? "/dashboard/api/visor/auxiliaries" : `/dashboard/api/visor/auxiliaries/${formValues.auxCoor}`;
    const method = action === "Agregar" ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues)
    });
    const result = await res.json();
    if (result.code === "OK") {
      alert(`Auxiliar ${action === "Agregar" ? "agregado" : "modificado"} correctamente`);
      setIsModalOpen(false);
    } else {
      alert(`Error al ${action === "Agregar" ? "agregar" : "modificar"} el auxiliar`);
    }
  };

  const deleteAuxiliaryCoordinator = async () => {
    const res = await fetch(`/dashboard/api/visor/auxiliaries/${formValues.auxCoor}`, {
      method: "DELETE"
    });
    const result = await res.json();
    if (result.code === "OK") {
      alert("Auxiliar eliminado correctamente");
      setIsModalOpen(false);
    } else {
      alert("Error al eliminar el auxiliar");
    }
  };

  return (
    <>
      <Button
        onPress={() => setIsModalOpen(true)}
        color={action === "Agregar" ? "primary" : "default"}
        variant={action === "Agregar" ? "solid" : "light"}
      >
        {action}
      </Button>

      <Modal size="lg" isOpen={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)}>
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              <h3>{action} auxiliar de coordinación</h3>
            </ModalHeader>
            <ModalBody>
              <Autocomplete
                label="Auxiliar de coordinación"
                placeholder="Seleccione un auxiliar de coordinación"
                selectedKey={formValues.auxCoor}
                onSelectionChange={(key) => setFormValues({ ...formValues, auxCoor: key as string })}
                value={formValues.auxCoor}
                isDisabled={action === "Modificar"}
                isRequired
              >
                {action === "Modificar" ? (
                  <AutocompleteItem key={auxCoordinatorName!}>{auxCoordinatorName}</AutocompleteItem>
                ) : (
                  formOptions.subCoordinators.map((subCoor) => (
                    <AutocompleteItem key={subCoor.id}>{subCoor.userId}</AutocompleteItem>
                  ))
                )}
              </Autocomplete>
              <Select
                label="Estructura"
                placeholder="Selecciona una estructura"
                selectedKeys={formValues.struct ? [formValues.struct] : []}
                onSelectionChange={(selection) => {
                  if (selection === "all") return;
                  setFormValues({ ...formValues, struct: [...selection][0] as string });
                }}
                isRequired
              >
                {formOptions.structures.map((structure) => (
                  <AutocompleteItem key={structure.id}>{structure.name}</AutocompleteItem>
                ))}
              </Select>
              <Autocomplete
                label="Sub-Coordinador"
                placeholder="Ingrese el sub coordinador"
                selectedKey={formValues.subCoor}
                onSelectionChange={(key) => setFormValues({ ...formValues, subCoor: key as string })}
                value={formValues.subCoor}
                isDisabled={action === "Modificar"}
                isRequired
              >
                {action === "Modificar" ? (
                  <AutocompleteItem key={subCoordinatorName!}>{subCoordinatorName}</AutocompleteItem>
                ) : (
                  formOptions.subCoordinators.map((subCoor) => (
                    <AutocompleteItem key={subCoor.id}>{subCoor.userId}</AutocompleteItem>
                  ))
                )}
              </Autocomplete>
              <Select
                label="Municipios"
                placeholder="Seleccione los municipios"
                selectionMode="multiple"
                selectedKeys={formValues.municipios}
                onSelectionChange={(keys) => setFormValues({ ...formValues, municipios: [...keys] as string[] })}
                isRequired
              >
                {formOptions.municipios.map((municipio) => (
                  <SelectItem key={municipio.id}>{municipio.name}</SelectItem>
                ))}
              </Select>
              <Autocomplete
                label="Técnico"
                placeholder="Seleccione un técnico"
                selectedKey={formValues.tecnical}
                onSelectionChange={(key) => setFormValues({ ...formValues, tecnical: key as string })}
                value={formValues.tecnical}
                isRequired
              >
                {formOptions.technicals.map((user) => (
                  <AutocompleteItem key={user.id}>{user.fullname}</AutocompleteItem>
                ))}
              </Autocomplete>
            </ModalBody>
            <ModalFooter className={`flex ${action === "Modificar" ? "justify-between" : "justify-end"}`}>
              {action === "Modificar" && (
                <Button
                  color="danger"
                  onPress={() => {
                    if (confirm("¿Estás seguro que deseas eliminar este auxiliar?")) {
                      deleteAuxiliaryCoordinator();
                    }
                  }}
                >
                  Eliminar
                </Button>
              )}
              <Button color="primary" type="submit">{action}</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
