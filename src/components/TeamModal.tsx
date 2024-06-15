import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Tabs, Tab, Select, SelectItem, Autocomplete } from "@nextui-org/react";

interface CoordinationAssistant {
  key: string;
  name: string;
}

interface PointType {
  key: string;
  name: string;
}

interface GeographicLevel {
  key: string;
  name: string;
}

interface GeographicValue {
  key: string;
  name: string;
}

interface Link {
  key: string;
  name: string;
}

interface Member {
  key: string;
  name: string;
}

interface TeamModalProps {
  structureName: string;
}

export default function TeamModal({ structureName }: TeamModalProps) {
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Jerarquia");
  const [selectedGeographicValues, setSelectedGeographicValues] = useState<GeographicValue[]>([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<Member[]>([]);

  // Estados para almacenar las opciones de los selects
  const [coordinationAssistants, setCoordinationAssistants] = useState<CoordinationAssistant[]>([]);
  const [pointTypes, setPointTypes] = useState<PointType[]>([]);
  const [geographicLevels, setGeographicLevels] = useState<GeographicLevel[]>([]);
  const [geographicValues, setGeographicValues] = useState<GeographicValue[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const tabs = ["Jerarquia", "Tipo de punto", "Participantes"];

  // Simulación de datos para los selects (se van a obtener desde la API)
  useEffect(() => {
    // Simulación de carga de datos
    const fetchCoordinationAssistants = () => {
      const data: CoordinationAssistant[] = [
        { key: "1", name: "Carlos Hernández" },
        { key: "2", name: "María González" },
        { key: "3", name: "Javier Méndez" },
        { key: "4", name: "Ana Martínez" },
        { key: "5", name: "Luis Pérez" },
        { key: "6", name: "Gabriela Ramírez" },
      ];
      setCoordinationAssistants(data);
    };

    const fetchPointTypes = () => {
      const data: PointType[] = [
        { key: "1", name: "Necesidad" },
        { key: "2", name: "Publicidad" },
        { key: "3", name: "Encuestas" },
        { key: "4", name: "Toques" },
      ];
      setPointTypes(data);
    };

    const fetchGeographicLevels = () => {
      const data: GeographicLevel[] = [
        { key: "1", name: "Municipios" },
        { key: "2", name: "Entidades" },
        { key: "3", name: "Colonias" },
      ];
      setGeographicLevels(data);
    };

    const fetchGeographicValues = () => {
      const data: GeographicValue[] = [
        { key: "1", name: "Querétaro" },
        { key: "2", name: "San Juan del Río" },
        { key: "3", name: "El Marqués" },
        { key: "4", name: "Corregidora" },
        { key: "5", name: "Tequisquiapan" },
      ];
      setGeographicValues(data);
    };

    const fetchLinks = () => {
      const data: Link[] = [
        { key: "1", name: "Juan López" },
        { key: "2", name: "Sofía Torres" },
        { key: "3", name: "Ricardo Mendoza" },
        { key: "4", name: "Elena Cruz" },
        { key: "5", name: "Miguel Ángel" },
        { key: "6", name: "Patricia Díaz" },
      ];
      setLinks(data);
    };

    const fetchMembers = () => {
      const data: Member[] = [
        { key: "1", name: "Fernando Salinas" },
        { key: "2", name: "Rosa Martínez" },
        { key: "3", name: "Carlos Romero" },
        { key: "4", name: "Lucía Sánchez" },
        { key: "5", name: "Manuel Ortiz" },
        { key: "6", name: "Laura Gutiérrez" },
      ];
      setMembers(data);
    };

    // Llamar a las funciones de carga de datos
    fetchCoordinationAssistants();
    fetchPointTypes();
    fetchGeographicLevels();
    fetchGeographicValues();
    fetchLinks();
    fetchMembers();
  }, []);

  // Maneja el cambio de pestañas en el modal
  const handleTabChange = (key: React.Key) => {
    setActiveTab(key as string);
  };

  // Maneja el avance a la siguiente pestaña o el cierre del modal
  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else {
      // Acción final, por ejemplo, agregar el equipo
      setIsOpen(false)
    }
  };

  // Maneja la selección de valores geográficos
  const handleGeographicValueSelectionChange = (key: React.Key) => {
    const selectedValue = geographicValues.find(
      (value) => value.key === key
    );
    if (selectedValue && !selectedGeographicValues.some((value) => value.key === key)) {
      setSelectedGeographicValues([...selectedGeographicValues, selectedValue]);
    }
  };

  // Maneja la selección de miembros del equipo
  const handleTeamMemberSelectionChange = (key: React.Key) => {
    const selectedMember = members.find((member) => member.key === key);
    if (selectedMember && !selectedTeamMembers.some((member) => member.key === key)) {
      setSelectedTeamMembers([...selectedTeamMembers, selectedMember]);
    }
  };

  // Maneja la eliminación de valores geográficos seleccionados
  const handleRemoveGeographicValue = (key: string) => {
    setSelectedGeographicValues(
      selectedGeographicValues.filter((value) => value.key !== key)
    );
  };

  // Maneja la eliminación de miembros seleccionados
  const handleRemoveTeamMember = (key: string) => {
    setSelectedTeamMembers(
      selectedTeamMembers.filter((member) => member.key !== key)
    );
  };

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        color="primary"
        radius="sm"
        endContent={
          <span className="material-symbols-outlined">add</span>
        }
      >
        Agregar equipo
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} placement="top-center" size="xl">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">Agregando Equipo</ModalHeader>
            <p className="text-sm text-gray-500 px-6">Estructura: {structureName}</p>
            <Tabs selectedKey={activeTab} onSelectionChange={handleTabChange} className="px-5 mt-4">
              <Tab key="Jerarquia" title="Jerarquia">
                <ModalBody>
                  <Autocomplete
                    label="Auxiliar de Coordinación"
                    placeholder="Selecciona al auxiliar"
                    isRequired
                  >
                    {coordinationAssistants.map((assistant) => (
                      <SelectItem key={assistant.key} value={assistant.key}>
                        {assistant.name}
                      </SelectItem>
                    ))}
                  </Autocomplete>
                  <Input
                    label="Nombre del equipo"
                    placeholder="Escribe el nombre del equipo"
                    isRequired
                  />
                </ModalBody>
              </Tab>
              <Tab key="Tipo de punto" title="Tipo de punto">
                <ModalBody>
                  <Select
                    label="Tipo de Punto"
                    placeholder="Selecciona los tipos de punto"
                    isRequired
                    selectionMode="multiple"
                  >
                    {pointTypes.map((type) => (
                      <SelectItem key={type.key} value={type.key}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <p className="text-sm text-gray-500 px-1">Zona de trabajo</p>
                  <Select
                    label="Nivel geográfico"
                    placeholder="Seleccione el nivel geográfico"
                    isRequired
                  >
                    {geographicLevels.map((level) => (
                      <SelectItem key={level.key} value={level.key}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Autocomplete
                    label="Valores"
                    placeholder="Seleccione los valores geográficos"
                    isRequired
                    onSelectionChange={handleGeographicValueSelectionChange}
                  >
                    {geographicValues.map((value) => (
                      <SelectItem key={value.key} value={value.key}>
                        {value.name}
                      </SelectItem>
                    ))}
                  </Autocomplete>
                  <div className={`${selectedGeographicValues.length > 4 ? 'overflow-y-scroll h-24' : ''} px-8 flex flex-col gap-2`}>
                    {selectedGeographicValues.map((value) => (
                      <div key={value.key} className="flex justify-between items-center py-2 px-4 rounded-md bg-content2">
                        <span className="text-sm">{value.name}</span>
                        <Button isIconOnly className="material-symbols-outlined bg-transparent hover:bg-accent hover:text-white" size="sm" onClick={() => handleRemoveGeographicValue(value.key)}>close</Button>
                      </div>
                    ))}
                  </div>
                </ModalBody>
              </Tab>
              <Tab key="Participantes" title="Participantes">
                <ModalBody>
                  <Autocomplete
                    label="Enlace"
                    placeholder="Selecciona el enlace"
                    isRequired
                  >
                    {links.map((link) => (
                      <SelectItem key={link.key} value={link.key}>
                        {link.name}
                      </SelectItem>
                    ))}
                  </Autocomplete>
                  <Autocomplete
                    label="Miembros"
                    placeholder="Selecciona los miembros"
                    isRequired
                    onSelectionChange={handleTeamMemberSelectionChange}
                  >
                    {members.map((member) => (
                      <SelectItem key={member.key} value={member.key}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </Autocomplete>
                  <div className={`mt-4 ${selectedTeamMembers.length > 4 ? 'overflow-y-scroll h-24' : ''} px-8 flex flex-col gap-2`}>
                    {selectedTeamMembers.map((member) => (
                      <div key={member.key} className="flex justify-between items-center py-2 px-4 rounded-md bg-content2">
                        <span>{member.name}</span>
                        <Button isIconOnly className="material-symbols-outlined bg-transparent hover:bg-accent hover:text-white" size="sm" onClick={() => handleRemoveTeamMember(member.key)}>close</Button>
                      </div>
                    ))}
                  </div>
                </ModalBody>
              </Tab>
            </Tabs>
            <ModalFooter>
              <Button onPress={handleNext} color="primary">
                {activeTab === "Participantes" ? "Agregar Equipo" : "Siguiente"}
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}

