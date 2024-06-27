import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Tabs, Tab, Select, SelectItem, Autocomplete } from "@nextui-org/react";
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

interface TeamModalProps {
  structureName: string;
}


const TeamModal: React.FC<TeamModalProps> = ({ structureName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Jerarquia");
  const [selectedGeographicValues, setSelectedGeographicValues] = useState<string[]>([]);
  const [selectedPointTypes, setSelectedPointTypes] = useState<string[]>([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [coordinationAssistants, setCoordinationAssistants] = useState<CoordinationAssistant[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [teamName, setTeamName] = useState<string>("");

  const tabs = ["Jerarquia", "Tipo de punto", "Participantes"];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [coordinationRes, linksRes, membersRes] = await Promise.all([
  //         fetch('/api/coordinationAssistants'),
  //         fetch('/api/links'),
  //         fetch('/api/members')
  //       ]);

  //       const [coordinationData, linksData, membersData] = await Promise.all([
  //         coordinationRes.json(),
  //         linksRes.json(),
  //         membersRes.json()
  //       ]);

  //       setCoordinationAssistants(coordinationData);
  //       setLinks(linksData);
  //       setMembers(membersData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const handleTabChange = (key: React.Key) => {
    setActiveTab(key as string);
  };

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else {
      handleSubmit();
    }
  };

  const handleGeographicValueSelectionChange = (key: React.Key) => {
    if (!selectedGeographicValues.includes(key as string)) {
      setSelectedGeographicValues([...selectedGeographicValues, key as string]);
    }
  };

  const handlePointTypeSelectionChange = (key: React.Key) => {
    if (!selectedPointTypes.includes(key as string)) {
      setSelectedPointTypes([...selectedPointTypes, key as string]);
    }
  };

  const handleTeamMemberSelectionChange = (key: React.Key) => {
    if (!selectedTeamMembers.includes(key as string)) {
      setSelectedTeamMembers([...selectedTeamMembers, key as string]);
    }
  };

  const handleRemoveGeographicValue = (key: string) => {
    setSelectedGeographicValues(selectedGeographicValues.filter((value) => value !== key));
  };

  const handleRemoveTeamMember = (key: string) => {
    setSelectedTeamMembers(selectedTeamMembers.filter((member) => member !== key));
  };

  const handleSubmit = async () => {
    const teamData = {
      name: teamName,
      pointTypesIDs: selectedPointTypes,
      geographicConf: {
        geographicLevel: selectedGeographicValues[0], // Assuming you select only one geographic level
        values: selectedGeographicValues.slice(1), // Remaining selected values
      },
      members: selectedTeamMembers,
    };

    // try {
    //   const res = await fetch('/api/createTeam', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(teamData)
    //   });

    //   const result = await res.json();

    //   if (result.code === "OK") {
    //     console.log("Team created successfully");
    //     setIsOpen(false);
    //   } else {
    //     console.error("Error creating team:", result.statusText);
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
                    onSelectionChange={(_key) => handlePointTypeSelectionChange} // la variable _key no se está usando
                  >
                    {TIPOS_PUNTO.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                  <p className="text-sm text-gray-500 px-1">Zona de trabajo</p>
                  <Select
                    label="Nivel geográfico"
                    placeholder="Seleccione el nivel geográfico"
                    isRequired
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
                    {CONFIGURACIONES_GEOGRAFICAS.map((value) => (
                      <SelectItem key={value.id} value={value.id}>
                        {value.nombre}
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
                  <div className={`mt-4 ${selectedTeamMembers.length > 4 ? "overflow-y-scroll h-24" : ""} px-8 flex flex-col gap-2`}>
                    {selectedTeamMembers.map((member) => (
                      <div key={member} className="flex justify-between items-center py-2 px-4 rounded-md bg-content2">
                        <span>{member}</span>
                        <Button isIconOnly className="material-symbols-outlined bg-transparent hover:bg-accent hover:text-white" size="sm" onClick={() => handleRemoveTeamMember(member)}>close</Button>
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
