"use client";
import { ReactNode, useState } from "react";
import { Button, Divider, Listbox, ListboxItem } from "@nextui-org/react";
import DropdownChangeModule from "@/components/DropdownChangeModule";
import { useRouter } from "next/navigation";

export default function LayoutVisor({ children }: { children: ReactNode }) {

  return (
    <div className="flex h-screen overflow-hidden">
      <VisorSidebar />
      {children}
    </div>
  );
}

function VisorSidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  // TODO: implement logic of when current user has a role of caminante.
  const isCaminante = false;

  return (
    <Listbox
      topContent={
        <>
          <DropdownChangeModule currentModuleKey="visor" />
          <Divider className="bg-primary-foreground opacity-50 my-2" />
          <Button color="secondary" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 min-w-0 !flex" isIconOnly size="sm" onPress={() => setIsOpen(!isOpen)}>
            <span className="material-symbols-outlined">drag_indicator</span>
          </Button>
        </>
      }
      color="secondary"
      aria-label="Visor Navigation"
      onAction={(key) => { router.push(String(key)); }}
      className={`hidden lg:flex items-center px-2 py-4 max-w-60 bg-primary text-primary-foreground transition-all ${isCaminante && "!hidden"} ${!isOpen && "w-4 p-0 hide-children"}`}
    >
      <ListboxItem
        startContent={<span className="material-symbols-outlined">groups</span>}
        className="flex items-center gap-2 py-3 px-4"
        key="/dashboard/visor/teams"
      >
        Equipos
      </ListboxItem>
      <ListboxItem
        startContent={<span className="material-symbols-outlined">map</span>}
        className="flex items-center gap-2 py-3 px-4"
        key="/dashboard/visor/map"
      >
        Mapa general
      </ListboxItem>
      <ListboxItem
        startContent={<span className="material-symbols-outlined">table_rows</span>}
        className="flex items-center gap-2 py-3 px-4"
        key="/dashboard/visor/table"
      >
        Tabla general
      </ListboxItem>
      <ListboxItem
        startContent={<span className="material-symbols-outlined">emoji_people</span>}
        className="flex items-center gap-2 py-3 px-4"
        key="/dashboard/visor/people"
      >
        Personas
      </ListboxItem>
    </Listbox>
  );
}