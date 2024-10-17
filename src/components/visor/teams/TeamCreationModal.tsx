/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Tabs, Tab, Select, SelectItem, Autocomplete } from "@nextui-org/react";
import { TIPOS_PUNTO, CONFIGURACIONES_GEOGRAFICAS, ACTIVATIONS } from "../../../configs/catalogs/visorCatalog";
import { hasIncompleteFields } from "@/utils";

interface Auxiliary {
  key: string;
  name: string;
  municipiosIDs: string[];
  pointTypes: string[]
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
  structureId: string;
}

interface TypePoint {
  key: string,
  name: string,
}

const TeamCreationModal: React.FC<TeamModalProps> = ({ structureId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Jerarquia");
  const [selectedGeographicValues, setSelectedGeographicValues] = useState<string[]>([]);
  const [selectedPointTypes, setSelectedPointTypes] = useState<string[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<string>("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<Member[]>([]);
  const [coordinationAssistants, setCoordinationAssistants] = useState<Auxiliary[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [teamName, setTeamName] = useState<string>("");
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [selectedGeographicLevel, setSelectedGeographicLevel] = useState<string>("");
  const [geographicValues, setGeographicValues] = useState<GeographicValue[]>([]);

  // TODO: migrate above to form and options states
  const [form, setForm] = useState<{
    assistant: string;
    teamName: string;
    pointTypes: string[];
    geographicLevel: string;
    geographicValues: string[];
    link: string;
    teamMembers: Member[];
  }>({
    assistant: "",
    teamName: "",
    pointTypes: [],
    geographicLevel: "",
    geographicValues: [],
    link: "",
    teamMembers: [],
  });
  const [options, setOptions] = useState<{
    auxiliaries: Auxiliary[];
    pointTypes: TypePoint[];
    geographicLevels: string[];
    geographicValues: GeographicValue[];
    links: Link[];
    teamMembers: Member[];
  }>({
    auxiliaries: [],
    pointTypes: [],
    geographicLevels: [],
    geographicValues: [],
    links: [],
    teamMembers: [],
  });

  const structureName = ACTIVATIONS.find((str) => str.id === structureId)?.nombre;
  const currentAssistant = useMemo(() => coordinationAssistants.find((asnt) => asnt.key === selectedAssistant), [coordinationAssistants, selectedAssistant]);
  const tabs = ["Jerarquia", "Tipo de punto", "Participantes"];

  const fetchCaminantes = async () => {
    const resBody = await fetch("/dashboard/api/visor/caminantes?team=false")
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error fetching caminantes:", error);
      });

    if (resBody.code !== "OK") {
      console.error("Error fetching caminantes:", resBody.message);
    }

    const formattedData = resBody.data.map((item: any) => ({
      key: item.id,
      name: item.User.Person.name
    }));
    setMembers(formattedData);
    setLinks(formattedData);
    setFilteredMembers(formattedData);

    setOptions((prev) => ({ ...prev, teamMembers: formattedData, links: formattedData }));
  };

  const fetchCoordinationAssistants = async () => {
    const resBody = await fetch(`/dashboard/api/visor/auxiliaries?activacion=${structureId}`)
      .then((res) => res.json())
      .catch((error) => console.error("Error no esperado", error));

    if (resBody.code !== "OK") {
      console.error("Error fetching coordination assistants:", resBody.message);
    }

    const formattedData: Auxiliary[] = (resBody.data as any[]).map((item) => ({
      key: item.id,
      name: item.fullName,
      municipiosIDs: item.municipiosIDs,
      pointTypes: item.pointTypes,
    }));

    setCoordinationAssistants(formattedData);
    setOptions((prev) => ({ ...prev, auxiliaries: formattedData }));
  };

  const fetchGeographicValues = async () => {
    if (selectedGeographicLevel === "") return;
    if (!currentAssistant) return;

    try {
      const municipios = currentAssistant.municipiosIDs.join(",");

      const res = await fetch(`/dashboard/api/visor/geographicConfiguration?geographicLevel=${selectedGeographicLevel}&municipios=${municipios}`);
      const result = await res.json();

      console.log(result);

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

  // On component mount
  useEffect(() => {
    if (!isOpen) return;

    fetchCoordinationAssistants();
    fetchCaminantes();
  }, [isOpen, structureId]);

  // Take out link from available members
  useEffect(() => {
    if (selectedLink) {
      setFilteredMembers((curr) => curr.filter((member) => member.key !== selectedLink));
    }
  }, [selectedLink, members]);

  // Update geographic values when assistant or level changes
  useEffect(() => {
    fetchGeographicValues();
  }, [selectedGeographicLevel, selectedAssistant]);

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

  const handleGeographicValueSelectionChange = (key: React.Key | null) => {
    if (!key) return;

    if (!selectedGeographicValues.includes(key as string)) {
      setSelectedGeographicValues([...selectedGeographicValues, key as string]);
    }
  };

  const handlePointTypeSelectionChange = (keys: Set<React.Key>) => {
    const selectedKeysArray = Array.from(keys);
    setSelectedPointTypes(selectedKeysArray.map(key => key as string));
  };


  const handleTeamMemberSelectionChange = (key: React.Key | null) => {
    const selectedMember = filteredMembers.find(member => member.key === key);
    if (selectedMember && !selectedTeamMembers.includes(selectedMember)) {
      setSelectedTeamMembers([...selectedTeamMembers, selectedMember]);
    }
  };

  const handleLinkSelectionChange = (key: React.Key | null) => {
    setSelectedLink(key as string);
  };

  const handleGeographicLevelSelectionChange = (key: string) => {
    setSelectedGeographicLevel([...key][0]);
    setSelectedGeographicValues([]);
  };

  const handleRemoveGeographicValue = (key: string) => {
    setSelectedGeographicValues(selectedGeographicValues.filter((value) => value !== key));
  };

  const handleRemoveTeamMember = (key: string) => {
    setSelectedTeamMembers(selectedTeamMembers.filter((member) => member.key !== key));
  };

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

    if (hasIncompleteFields(teamData))
      return alert("Favor de completar todos los campos");

    try {
      const res = await fetch("/dashboard/api/visor/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      });
      const result = await res.json();
      if (result.code === "OK") {
        console.log("Team created successfully:", result.data);
        handleCloseModal();
      } else {
        console.error("Error creating team:", result.message);
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleCloseModal = () => {
    // Close
    setIsOpen(false);

    // Reset Full Form
    setActiveTab("Jerarquia");
    setSelectedGeographicValues([]);
    setSelectedPointTypes([]);
    setSelectedAssistant("");
    setSelectedTeamMembers([]);
    setCoordinationAssistants([]);
    setLinks([]);
    setMembers([]);
    setFilteredMembers([]);
    setTeamName("");
    setSelectedLink(null);
    setSelectedGeographicLevel("");
    setGeographicValues([]);
  };

  const getGeographicValueName = (key: string) => {
    const value = geographicValues.find(val => val.key === key);
    return value ? value.name : key;
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
        Agregar Proyecto
      </Button>
      <Modal isOpen={isOpen} onClose={handleCloseModal} placement="top-center" size="xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Agregando Proyecto</ModalHeader>
          <p className="text-sm text-gray-500 px-6">Activacion: {structureName}</p>
          <Tabs selectedKey={activeTab} onSelectionChange={handleTabChange} className="px-5 mt-4">
            <Tab key="Jerarquia" title="Jerarquia">
              <ModalBody>
                <Autocomplete
                  label="Auxiliar de Coordinación"
                  placeholder="Selecciona al auxiliar"
                  isRequired
                  onSelectionChange={(key) => setSelectedAssistant(key as string)}
                  selectedKey={selectedAssistant}
                >
                  {coordinationAssistants.map((assistant) => (
                    <SelectItem key={assistant.key} value={assistant.key}>
                      {assistant.name}
                    </SelectItem>
                  ))}
                </Autocomplete>
                <Input
                  label="Nombre del Proyecto"
                  placeholder="Escribe el nombre del Proyecto"
                  isRequired
                  value={teamName}
                  onValueChange={setTeamName}
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
                  onSelectionChange={(keys) => handlePointTypeSelectionChange(keys as Set<React.Key>)}
                  selectedKeys={selectedPointTypes}
                >
                  {TIPOS_PUNTO.filter((tp) => tp.activacionId === structureId && currentAssistant?.pointTypes.includes(tp.id)).map((pointType) => (
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
                  onSelectionChange={(_key) => handleGeographicLevelSelectionChange(_key as string)}
                  selectedKeys={selectedGeographicLevel ? [selectedGeographicLevel] : []}
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
                  isDisabled={geographicValues.length === 0}
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
                      <span className="text-sm">{getGeographicValueName(value)}</span>
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
                <div className={`${selectedTeamMembers.length > 4 ? "overflow-y-scroll h-24" : ""} px-8 flex flex-col gap-2`}>
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
              {activeTab === "Participantes" ? "Agregar Proyecto" : "Siguiente"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TeamCreationModal;
