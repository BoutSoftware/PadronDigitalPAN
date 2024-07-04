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
  auxiliaryId: string;  
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

export default function ModalAuxCoor({ action, auxCoordinatorName }: ModalAuxCoorProps) {
  const isModifying = action === "Modificar";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formOptions, setFormOptions] = useState<FormOptions>({
    subCoordinators: [],
    structures: [],
    municipios: [],
    technicals: []
  });
  const [formValues, setFormValues] = useState<FormValues>({
    auxiliaryId: "",
    auxCoor: "",
    struct: "",
    subCoor: "",
    municipios: [],
    tecnical: "",
  });
  
  useEffect(() => {
    if (auxCoordinatorName) setFormValues(prev => ({ ...prev, auxCoor: auxCoordinatorName }));
  }, [auxCoordinatorName]);

  useEffect(() => {
    if (isModalOpen) {
      getStructures();
      getSubCoordinators();
      getMunicipios();
      getTechnicals();
      if (isModifying) {
        fetchAuxiliaryDetails();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, isModifying]);

  const getSubCoordinators = async () => {
    const res = await fetch("/dashboard/api/visor/subcoordinators?estructura");
    const result = await res.json();
    setFormOptions((prevOptions) => ({
      ...prevOptions,
      subCoordinators: result.data
    }));
  };

  const getMunicipios = async () => {
    const res = await fetch("/dashboard/api/visor/geographicConfiguration?geographicLevel=colonias");
    const result = await res.json();
    setFormOptions((prevOptions) => ({
      ...prevOptions,
      municipios: result.data
    }));
  };

  const getTechnicals = async () => {
    const res = await fetch("/dashboard/api/visor/technicals?onlyFree=false");
    const result = await res.json();
    setFormOptions((prevOptions) => ({
      ...prevOptions,
      technicals: result.data
    }));
  };

  const getStructures = () => {
    setFormOptions((prevOptions) => ({
      ...prevOptions,
      structures: ESTRUCTURAS.map((structure) => ({
        id: structure.id,
        name: structure.nombre
      }))
    }));
  };

  const fetchAuxiliaryDetails = async () => {
    try {
      const res = await fetch("/dashboard/api/visor/auxiliaries");
      const result = await res.json();
      if (result.code === "OK") {
        const { id, subCoordinator, municipiosIDs, technicalId } = result.data;
        setFormValues({
          auxiliaryId: id,
          auxCoor: auxCoordinatorName!,
          struct: "", // Asigna el valor correcto si está disponible
          subCoor: subCoordinator,
          municipios: municipiosIDs,
          tecnical: technicalId
        });
        // Agregar el subCoor y tecnical actuales a las opciones
        setFormOptions((value) => ({
          ...value,
          subCoordinators: [
            ...value.subCoordinators,
            {
              id: subCoordinator,
              createdAt: "",
              active: true,
              userId: "",
              technicalId: "",
              pointTypesIDs: [],
              structureId: ""
            }
          ],
          technicals: [
            ...value.technicals,
            {
              id: technicalId,
              createdAt: "",
              active: true,
              userId: "",
              fullname: "",
              title: "",
              rol: ""
            }
          ]
        }));
      } else {
        console.error("Error: Result code is not OK", result);
      }
    } catch (error) {
      console.error("Error fetching auxiliary details:", error);
    }
  };
      
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = isModifying ? `/dashboard/api/visor/auxiliaries/${formValues.auxiliaryId}` : "/dashboard/api/visor/auxiliaries";
    const method = isModifying ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues)
    });
    const result = await res.json();
    if (result.code === "OK") {
      alert(`Auxiliar ${isModifying ? "modificado" : "agregado"} correctamente`);
      setIsModalOpen(false);
    } else {
      alert(`Error al ${isModifying ? "modificar" : "agregar"} el auxiliar`);
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
        color={isModifying ? "default" : "primary"}
        variant={isModifying ? "light" : "solid"}
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
                isDisabled={isModifying}
                isRequired
              >
                {formOptions.subCoordinators.map((subCoor) => (
                  <AutocompleteItem key={subCoor.id}>{subCoor.userId}</AutocompleteItem>
                ))}
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
                isDisabled={isModifying}
                isRequired
              >
                {formOptions.subCoordinators.map((subCoor) => (
                  <AutocompleteItem key={subCoor.id}>{subCoor.userId}</AutocompleteItem>
                ))}
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
                isRequired
              >
                {formOptions.technicals.map((user) => (
                  <AutocompleteItem key={user.id}>{user.fullname}</AutocompleteItem>
                ))}
              </Autocomplete>
            </ModalBody>
            <ModalFooter className={`flex ${isModifying ? "justify-between" : "justify-end"}`}>
              {isModifying && (
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
              <Button color="primary" type="submit">
                Guardar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
