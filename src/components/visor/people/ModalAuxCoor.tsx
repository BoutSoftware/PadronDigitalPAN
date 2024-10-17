import { useEffect, useState, FormEvent, useMemo } from "react";
import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { ACTIVATIONS } from "@/configs/catalogs/visorCatalog";

interface ModalAuxCoorProps {
  auxiliary?: {
    id: string;
    name: string;
  };
}

interface AuxInfoProps {
  structureId: string;
  SubCoordinator: undefined;
  id: string;
  createdAt?: Date;
  active?: boolean;
  userId?: string;
  technicalId: string;
  subCoordinator: string;
  municipiosIDs: string[];
  technical: Technical;
  fullName: string;
}

interface FormValues {
  userId: string;
  structureId: string;
  subCoordinatorId: string;
  municipioIDs: string[];
  technicalId: string;
}

interface Coordinator {
  id: string;
  createdAt: string;
  active: boolean;
  userId: string;
  fullname: string;
  title: string | null;
  rol: string;
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
  coordinators: Coordinator[];
  subCoordinators: SubCoordinator[];
  structures: { id: string; name: string }[];
  municipios: Municipio[];
  technicals: Technical[];
}

export default function ModalAux({ auxiliary: currentAuxiliary }: ModalAuxCoorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formOptions, setFormOptions] = useState<FormOptions>({
    coordinators: [],
    structures: [],
    subCoordinators: [],
    municipios: [],
    technicals: [],
  });
  const [formValues, setFormValues] = useState<FormValues>({
    userId: "",
    structureId: "",
    subCoordinatorId: "",
    municipioIDs: [],
    technicalId: "",
  });

  const isModifying = useMemo(() => !!currentAuxiliary, [currentAuxiliary]);
  const currentSubCoordinator = useMemo(() => formOptions.subCoordinators.find((subCoor) => formValues.subCoordinatorId === subCoor.id), [formOptions, formValues]);

  const getCoordinators = async () => {
    try {
      const resBody = await fetch("/dashboard/api/visor/coordinators?onlyFree=true").then((res) => res.json());

      if (resBody.code === "OK") {
        setFormOptions((prevOptions) => ({
          ...prevOptions,
          coordinators: resBody.data,
        }));
      } else {
        console.log(resBody);
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getSubCoordinators = async () => {
    try {
      const resBody = await fetch(`/dashboard/api/visor/subcoordinators?activacion=${formValues.structureId}`).then((res) => res.json());

      if (resBody.code === "OK") {
        setFormOptions((prevOptions) => ({
          ...prevOptions,
          subCoordinators: resBody.data,
        }));
      } else {
        console.log(resBody);
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getMunicipios = async () => {
    try {
      const res = await fetch("/dashboard/api/visor/geographicConfiguration?geographicLevel=municipios");
      const result = await res.json();

      setFormOptions((prevOptions) => ({
        ...prevOptions,
        municipios: result.data,
      }));
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getTechnicals = async () => {
    try {
      const res = await fetch("/dashboard/api/visor/technicals?onlyFree=true");
      const result = await res.json();
      setFormOptions((prevOptions) => ({
        ...prevOptions,
        technicals: result.data,
      }));
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getStructures = () => {
    setFormOptions((prevOptions) => ({
      ...prevOptions,
      structures: ACTIVATIONS.map((structure) => ({
        id: structure.id,
        name: structure.nombre,
      })),
    }));
  };

  const getAuxiliaryDetails = async () => {
    if (!currentAuxiliary) return;

    try {
      const res = await fetch(`/dashboard/api/visor/auxiliaries/${currentAuxiliary.id}`);
      const result = await res.json();

      if (result.code === "OK") {
        const currAuxInfo: AuxInfoProps = result.data;

        setFormValues({
          userId: currentAuxiliary.id,
          structureId: currAuxInfo.structureId,
          subCoordinatorId: currAuxInfo.subCoordinator,
          municipioIDs: currAuxInfo.municipiosIDs,
          technicalId: currAuxInfo.technical.id,
        });

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
              rol: "",
            },
          ],
          coordinators: [
            ...value.coordinators,
            {
              active: true,
              createdAt: "",
              fullname: currAuxInfo.fullName,
              id: currAuxInfo.id,
              rol: "",
              title: "",
              userId: ""
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

  const handleClose = () => {
    setIsModalOpen(false);
    setFormValues({
      userId: "",
      structureId: "",
      subCoordinatorId: "",
      municipioIDs: [],
      technicalId: "",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = isModifying ? `/dashboard/api/visor/auxiliaries/${formValues.userId}` : "/dashboard/api/visor/auxiliaries";
    const method = isModifying ? "PATCH" : "POST";

    try {
      console.log("Formulario enviado con los siguientes valores:", formValues);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const resBody = await res.json();

      if (resBody.code === "OK") {
        alert(`Auxiliar ${isModifying ? "modificado" : "agregado"} correctamente`);
        handleClose();
      } else {
        alert(`Error al ${isModifying ? "modificar" : "agregar"} el auxiliar: ${resBody.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error al enviar el formulario. Revisa la consola para más detalles.");
    }
  };

  const handleDeleteAuxiliary = async () => {
    try {
      const res = await fetch(`/dashboard/api/visor/auxiliaries/${currentAuxiliary?.id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.code === "OK") {
        alert("Auxiliar eliminado correctamente");
        handleClose();
        // TODO: Definir si se va a recargar la pagina o se actualiza el estado en el componente
        window.location.reload();
      } else {
        alert("Error al eliminar el auxiliar");
      }
    } catch (error) {
      console.error("Error deleting auxiliary coordinator:", error);
      alert("Error al eliminar el auxiliar");
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      getStructures();
      getCoordinators();
      getMunicipios();
      getTechnicals();

      if (isModifying) {
        getAuxiliaryDetails();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, isModifying]);

  useEffect(() => {
    if (formValues.structureId)
      getSubCoordinators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.structureId]);


  return (
    <>
      <Button onPress={() => setIsModalOpen(true)} color={isModifying ? "default" : "primary"} variant={isModifying ? "light" : "solid"}>
        {isModifying ? "Modificar" : "Agregar"}
      </Button>

      <Modal size="lg" isOpen={isModalOpen} onClose={handleClose}>
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              <h3>{isModifying ? "Modificar" : "Agregar"} auxiliar de coordinación</h3>
            </ModalHeader>
            <ModalBody>
              <Autocomplete
                label="Auxiliar de coordinación"
                placeholder="Seleccione un auxiliar de coordinación"
                selectedKey={formValues.userId}
                onSelectionChange={(key) => setFormValues({ ...formValues, userId: key as string })}
                isDisabled={isModifying}
                isRequired
              >
                {formOptions.coordinators.map((coordinator) => (
                  <AutocompleteItem key={coordinator.id}>{coordinator.fullname}</AutocompleteItem>
                ))}
              </Autocomplete>
              <Select
                label="Activacion"
                placeholder="Selecciona una activacion"
                selectedKeys={formValues.structureId ? [formValues.structureId] : []}
                onSelectionChange={(selection) => {
                  if (selection === "all") return;
                  setFormValues({ ...formValues, structureId: [...selection][0] as string });
                }}
                isRequired
              >
                {formOptions.structures.map((structure) => (
                  <SelectItem key={structure.id}>{structure.name}</SelectItem>
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
                selectedKeys={formValues.municipioIDs}
                onSelectionChange={(keys) => setFormValues({ ...formValues, municipioIDs: [...keys] as string[] })}
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
                      handleDeleteAuxiliary();
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
