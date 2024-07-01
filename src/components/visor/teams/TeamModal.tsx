import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Tabs, Tab, Select, SelectItem, Autocomplete} from "@nextui-org/react";
import { TIPOS_PUNTO, CONFIGURACIONES_GEOGRAFICAS } from "../../../configs/catalogs/visorCatalog";

interface CoordinationAssistant {
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

interface GeographicValue {
  key: string;
  name: string;
}

interface TeamModalProps {
  structureName: string;
}

const TeamModal: React.FC<TeamModalProps> = ({ structureName }) => {
  // Estados para manejar las distintas variables del modal
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Jerarquia");
  const [selectedGeographicValues, setSelectedGeographicValues] = useState<string[]>([]);
  const [selectedPointTypes, setSelectedPointTypes] = useState<string[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<string>("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<Member[]>([]);
  const [coordinationAssistants, setCoordinationAssistants] = useState<CoordinationAssistant[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [teamName, setTeamName] = useState<string>("");
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [selectedGeographicLevel, setSelectedGeographicLevel] = useState<string>("");
  const [geographicValues, setGeographicValues] = useState<GeographicValue[]>([]);

  const tabs = ["Jerarquia", "Tipo de punto", "Participantes"];

  // useEffect para obtener los auxiliares de coordinación
  useEffect(() => {
    const fetchCoordinationAssistants = async () => {
      try {
        const res = await fetch('/dashboard/api/visor/auxiliaries?estructura=territorial');
        const result = await res.json();
        if (result.code === "OK") {
          const formattedData = result.data.map((item: any) => ({
            key: item.id,
            name: item.fullName
          }));
          setCoordinationAssistants(formattedData);
        } else {
          console.error("Error fetching coordination assistants:", result.message);
        }
      } catch (error) {
        console.error("Error fetching coordination assistants:", error);
      }
    };

    fetchCoordinationAssistants();
  }, []);

  // useEffect para obtener los caminantes
  useEffect(() => {
    const fetchCaminantes = async () => {
      try {
        const res = await fetch('/dashboard/api/visor/caminantes?team=false');
        const result = await res.json();
        if (result.code === "OK") {
          const formattedData = result.data.map((item: any) => ({
            key: item.id,
            name: item.User.Person.name
          }));
          setMembers(formattedData);
          setLinks(formattedData);
          setFilteredMembers(formattedData);
        } else {
          console.error("Error fetching caminantes:", result.message);
        }
      } catch (error) {
        console.error("Error fetching caminantes:", error);
      }
    };

    fetchCaminantes();
  }, []);

  // useEffect para filtrar los miembros en base al enlace seleccionado
  useEffect(() => {
    if (selectedLink) {
      setFilteredMembers(members.filter(member => member.key !== selectedLink));
    } else {
      setFilteredMembers(members);
    }
  }, [selectedLink, members]);

  // useEffect para obtener los valores geográficos en base al nivel seleccionado
  useEffect(() => {
    const fetchGeographicValues = async () => {
      if (selectedGeographicLevel === "") return;
      
      try {
        const res = await fetch(`/dashboard/api/visor/geographicConfiguration?geographicLevel=${selectedGeographicLevel}&municipios=667bcf8e6ae4f348d52a3af1`);
        const result = await res.json();
        if (result.code === "OK") {
          const formattedData = result.data.map((item: any) => ({
            key: item.id,
            name: item.name
          }));
          setGeographicValues(formattedData);
        } else {
          console.error("Error fetching geographic values:", result.message);
        }
      } catch (error) {
        console.error("Error fetching geographic values:", error);
      }
    };

    fetchGeographicValues();
  }, [selectedGeographicLevel]);

  // Maneja el cambio de tab en el modal
  const handleTabChange = (key: React.Key) => {
    setActiveTab(key as string);
  };

  // Maneja el botón de siguiente para cambiar de tab o enviar el formulario
  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else {
      handleSubmit();
    }
  };

  // Maneja la selección de valores geográficos
  const handleGeographicValueSelectionChange = (key: React.Key) => {
    if (!selectedGeographicValues.includes(key as string)) {
      setSelectedGeographicValues([...selectedGeographicValues, key as string]);
    }
  };

  // Maneja la selección de tipos de punto
  const handlePointTypeSelectionChange = (key: React.Key) => {
    if (!selectedPointTypes.includes(key as string)) {
      setSelectedPointTypes([...selectedPointTypes, key as string]);
    }
  };

  // Maneja la selección de miembros del equipo
  const handleTeamMemberSelectionChange = (key: React.Key) => {
    const selectedMember = filteredMembers.find(member => member.key === key);
    if (selectedMember && !selectedTeamMembers.includes(selectedMember)) {
      setSelectedTeamMembers([...selectedTeamMembers, selectedMember]);
    }
  };

  // Maneja la selección de enlace
  const handleLinkSelectionChange = (key: React.Key) => {
    setSelectedLink(key as string);
  };

  // Maneja la selección de nivel geográfico
  const handleGeographicLevelSelectionChange = (key: React.Key) => {
    setSelectedGeographicLevel(key as string);
    setSelectedGeographicValues([]); // Limpiar valores geográficos anteriores
  };

  // Elimina un valor geográfico seleccionado
  const handleRemoveGeographicValue = (key: string) => {
    setSelectedGeographicValues(selectedGeographicValues.filter((value) => value !== key));
  };

  // Elimina un miembro del equipo seleccionado
  const handleRemoveTeamMember = (key: string) => {
    setSelectedTeamMembers(selectedTeamMembers.filter((member) => member.key !== key));
  };

  // Maneja el envío del formulario para crear el equipo
  const handleSubmit = async () => {
    const teamData = {
      name: teamName,
      pointTypesIDs: selectedPointTypes,
      geographicConf: {
        geographicLevel: selectedGeographicLevel,
        values: selectedGeographicValues,
      },
      auxiliaryId: selectedAssistant,
      linkId: selectedLink,
      caminantes: selectedTeamMembers.map(member => member.key),
    };

    // try {
    //   const res = await fetch('/dashboard/api/visor/team', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(teamData),
    //   });
    //   const result = await res.json();
    //   if (result.code === "OK") {
    //     console.log("Team created successfully:", result.data);
    //   } else {
    //     console.error("Error creating team:", result.message);
    //   }
    // } catch (error) {
    //   console.error("Error creating team:", error);
    // }
    console.log(teamData);
    
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
                    onSelectionChange={(key) => setSelectedAssistant(key as string)}
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
                    onChange={(e) => setTeamName(e.target.value)}
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
                    onSelectionChange={(_key) => handlePointTypeSelectionChange}
                  >
                    {TIPOS_PUNTO.map((pointType) => (
                      <SelectItem key={pointType.id} value={pointType.id}>
                        {pointType.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                  <p className="py-2">Niveles Geográficos</p>
                  <Select
                    label="Nivel Geográfico"
                    placeholder="Selecciona el nivel geográfico"
                    isRequired
                    onSelectionChange={(_key) => handleGeographicLevelSelectionChange}
                  >
                    {CONFIGURACIONES_GEOGRAFICAS.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.nombre}
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
                  <div className={`${selectedGeographicValues.length > 4 ? "overflow-y-scroll h-24" : ""} px-8 flex flex-col gap-2`}>
                    {selectedGeographicValues.map((value) => (
                      <div key={value} className="flex justify-between items-center py-2 px-4 rounded-md bg-content2">
                        <span className="text-sm">{value}</span>
                        <Button isIconOnly className="material-symbols-outlined bg-transparent hover:bg-accent hover:text-white" size="sm" onClick={() => handleRemoveGeographicValue(value)}>close</Button>
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
                    onSelectionChange={handleLinkSelectionChange}
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
                    {filteredMembers.map((member) => (
                      <SelectItem key={member.key} value={member.key}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </Autocomplete>
                  <div className={`mt-4 ${selectedTeamMembers.length > 4 ? "overflow-y-scroll h-24" : ""} px-8 flex flex-col gap-2`}>
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
            <ModalFooter className="mt-2">
              <Button color="primary" onPress={handleNext}>
                {activeTab === "Participantes" ? "Agregar equipo" : "Siguiente"}
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TeamModal;
