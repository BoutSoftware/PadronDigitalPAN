
"use client";
import { modulesList } from "@/configs/roles";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const modulesListWithBase = [
  {
    id: "base",
    name: "Base",
    icon: "home",
  },
  ...modulesList,
];

export default function DropdownChangeModule({ currentModuleKey }: { currentModuleKey: string }) {
  const router = useRouter();

  const currentModule = useMemo(() => {
    return modulesList.find((module) => {
      return module.id === currentModuleKey;
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
          endContent={
            <span className="material-symbols-outlined">unfold_more</span>
          }
          fullWidth
        >
          {currentModule.name}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Módulos Padrón Digital"
        onAction={(key) => router.push(`/dashboard/${key}`)}
      >
        {modulesListWithBase.map((module) => (
          <DropdownItem key={module.id}>{module.name}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}