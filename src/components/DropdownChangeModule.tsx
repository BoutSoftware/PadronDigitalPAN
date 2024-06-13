
"use client";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const moduleList = [
  {
    key: "visor",
    icon: "map",
    name: "Visor de Mapa",
    href: "/dashboard/visor"
  },
  {
    key: "whatsapp",
    icon: "chat",
    name: "WhatsApp",
    href: "/dashboard/whatsapp"
  },
  {
    key: "atencionCiudadana",
    icon: "report",
    name: "Atencion Ciudadana",
    href: "/dashboard/atention"
  },
  {
    key: "eventosYActividades",
    icon: "i_events",
    name: "Eventos y actividades",
    href: "/dashboard/events"
  },
  {
    key: "organigrama",
    icon: "sort_by_alpha",
    name: "WhatsApp",
    href: "/dashboard/whatsapp"
  },
  {
    key: "callCenter",
    icon: "contact_phone",
    name: "Call center",
    href: "/dashboard/callCenter"
  }
];

export default function DropdownChangeModule({ currentModuleKey }: { currentModuleKey: string }) {
  const router = useRouter();

  const currentModule = useMemo(() => {
    return moduleList.find((module) => {
      return module.key === currentModuleKey;
    })!;
  }, [currentModuleKey]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          size="lg"
          radius="none"
          className="text-primary-foreground"
          startContent={
            <span className="material-symbols-outlined">{currentModule.icon}</span>
          }
          endContent={<span className="material-symbols-outlined">unfold_more</span>}
          fullWidth>
          {currentModule.name}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Módulos Padrón Digital"
        onAction={(key) => router.push(moduleList.find((module) => {
          return module.key === key;
        })!.href)}>
        {
          moduleList.map((module) => (<DropdownItem key={module.key}>{module.name}</DropdownItem>))
        }
      </DropdownMenu>
    </Dropdown>
  );
}