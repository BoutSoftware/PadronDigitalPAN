/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState, FormEvent, useMemo } from "react";
import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { ESTRUCTURAS } from "@/configs/catalogs/visorCatalog";

interface ModalAuxCoorProps {
  auxiliary?: {
    id: string,
    name: string
  }
}

interface AuxInfoProps {
  structureId: string;
  SubCoordinator: undefined;
  id?: string | undefined;
  createdAt?: Date | undefined;
  active?: boolean | undefined;
  userId?: string | undefined;
  technicalId: string;
  subCoordinator: string;
  municipiosIDs: string[];
  technical: Technical
}

interface FormValues {
  auxiliaryId: string;
  auxCoor: string;
  structure: string;
  subCoordinatorId: string;
  municipios: string[];
  technicalId: string;
}

interface SubCoordinator {
  id: string;
  createdAt: string;
  active: boolean;
  userId: string;
  technicalId: string;
  pointTypesIDs: string[];
  structureId: string;
  fullName: string;
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
  coordinators: { id: string, name: string }[];
  subCoordinators: SubCoordinator[];
  structures: { id: string, name: string }[],
  municipios: Municipio[];
  technicals: Technical[];
}

export default function ModalAuxCoor({ auxiliary: currentAuxiliary }: ModalAuxCoorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formOptions, setFormOptions] = useState<FormOptions>({
    coordinators: [],
    structures: [],
    subCoordinators: [],
    municipios: [],
    technicals: []
  });
  const [formValues, setFormValues] = useState<FormValues>({
    auxiliaryId: "",
    auxCoor: "",
    structure: "",
    subCoordinatorId: "",
    municipios: [],
    technicalId: "",
  });

  const isModifying = useMemo(() => !!currentAuxiliary, [currentAuxiliary]);
  const currentSubCoordinator = useMemo(() => formOptions.subCoordinators.find((subCoor) => formValues.subCoordinatorId === subCoor.id), [formOptions, formValues]);

  useEffect(() => {
    if (currentAuxiliary?.name) setFormValues(prev => ({ ...prev, auxCoor: currentAuxiliary?.name }));
  }, [currentAuxiliary?.name]);

  useEffect(() => {
    if (isModalOpen) {
      getStructures();
      // getSubCoordinators();
      getMunicipios();
      getTechnicals();
      if (isModifying) {
        fetchAuxiliaryDetails();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, isModifying]);

  useEffect(() => {
    getSubCoordinators();
  }, [formValues.structure]);

  // TODO: Agregar función de getCoordinatorsBucket

  const getSubCoordinators = async () => {
    const resBody = await fetch(`/dashboard/api/visor/subcoordinators?estructura=${formValues.structure}`)
      .then((res) => res.json())
      .catch((e) => console.log("Error: ", e));

    if (resBody.code === "OK") {
      setFormOptions((prevOptions) => ({
        ...prevOptions,
        subCoordinators: resBody.data
      }));
    } else {
      console.log(resBody);
    }
  };

  const getMunicipios = async () => {
    const res = await fetch("/dashboard/api/visor/geographicConfiguration?geographicLevel=municipios");
    const result = await res.json();

    setFormOptions((prevOptions) => ({
      ...prevOptions,
      municipios: result.data
    }));
  };

  const getTechnicals = async () => {
    const res = await fetch("/dashboard/api/visor/technicals?onlyFree=true");
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
    if (!currentAuxiliary) return;

    try {
      const res = await fetch(`/dashboard/api/visor/auxiliaries/${currentAuxiliary.id}`);
      const result = await res.json();

      if (result.code === "OK") {
        const currAuxInfo: AuxInfoProps = result.data;

        setFormValues({
          auxiliaryId: currentAuxiliary.id,
          auxCoor: currentAuxiliary.name,
          structure: currAuxInfo.structureId,
          subCoordinatorId: currAuxInfo.subCoordinator,
          municipios: currAuxInfo.municipiosIDs,
          technicalId: currAuxInfo.technical.id
        });

        // Agregar el subCoor y tecnical actuales a las opciones
        setFormOptions((value) => ({
          ...value,
          technicals: [
            ...value.technicals,
            {
              id: currAuxInfo.technical.id,
              fullname: currAuxInfo.technical.fullname,
              createdAt: "",
              active: true,
              userId: "",
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
        {isModifying ? "Modificar" : "Agregar"}
      </Button>

      <Modal size="lg" isOpen={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)}>
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              <h3>{isModifying ? "Modificar" : "Agregar"} auxiliar de coordinación</h3>
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
                selectedKeys={formValues.structure ? [formValues.structure] : []}
                onSelectionChange={(selection) => {
                  if (selection === "all") return;
                  setFormValues({ ...formValues, structure: [...selection][0] as string });
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
                selectedKey={formValues.subCoordinatorId}
                onSelectionChange={(key) => setFormValues({ ...formValues, subCoordinatorId: key as string })}
                isDisabled={isModifying}
                isRequired
              >
                {formOptions.subCoordinators.map((subCoor) => (
                  <AutocompleteItem key={subCoor.id}>{subCoor.fullName}</AutocompleteItem>
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
                selectedKey={formValues.technicalId}
                onSelectionChange={(key) => setFormValues({ ...formValues, technicalId: key as string })}
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
