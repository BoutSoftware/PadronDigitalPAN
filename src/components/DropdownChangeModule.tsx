/* eslint-disable indent */
"use client";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { ReactNode, useEffect, useState } from "react";

export default function DropdownChangeModule({ currentModule }: { currentModule: string }) {

  const [buttonTriggerStartContent, setButtonTriggerStartContent] = useState<ReactNode>();
  const [currentModuleName, setCurrentModuleName] = useState("");

  const handleChangeModule = (module: string) => {
    switch (module) {
      case "visor":
        setButtonTriggerStartContent(<span className="material-symbols-outlined">map</span>);
        setCurrentModuleName("Visor de mapa");
        break;
      case "whatsapp":
        setButtonTriggerStartContent(<span className="material-symbols-outlined">chat</span>);
        setCurrentModuleName("WhatsApp");
        break;
      case "atencionCiudadana":
        setButtonTriggerStartContent(<span className="material-symbols-outlined">report</span>);
        setCurrentModuleName("Atencion ciudadana");
        break;
      case "eventosYActividades":
        setButtonTriggerStartContent(<span className="material-symbols-outlined">emoji_events</span>);
        setCurrentModuleName("Eventos y actividades");
        break;
      case "organigrama":
        setButtonTriggerStartContent(<span className="material-symbols-outlined">sort_by_alpha</span>);
        setCurrentModuleName("Organigrama");
        break;
      case "callCenter":
        setButtonTriggerStartContent(<span className="material-symbols-outlined">contact_phone</span>);
        setCurrentModuleName("Call center");
        break;
    }
  };

  useEffect(() => {
    handleChangeModule(currentModule);
  }, []);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          size="lg"
          radius="none"
          className="text-primary-foreground"
          startContent={buttonTriggerStartContent}
          endContent={<span className="material-symbols-outlined">unfold_more</span>}
          fullWidth>
          {currentModuleName}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Módulos Padrón Digital"
        onAction={(key) => handleChangeModule(key as string)}>
        <DropdownItem key="visor">Visor de mapa</DropdownItem>
        <DropdownItem key="whatsapp">WhatsApp</DropdownItem>
        <DropdownItem key="atencionCiudadana">Atención ciudadana</DropdownItem>
        <DropdownItem key="eventosYActividades">Eventos y actividades</DropdownItem>
        <DropdownItem key="organigrama">Organigrama</DropdownItem>
        <DropdownItem key="callCenter">Call center</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}