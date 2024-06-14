"use client";
import { ReactNode } from "react";
import { Divider, Listbox, ListboxItem } from "@nextui-org/react";
import DropdownChangeModule from "@/components/DropdownChangeModule";
import { useRouter } from "next/navigation";

export default function LayoutVisor({ children }: { children: ReactNode }) {

  return (
    <div className="flex min-h-screen items-stretch">
      <VisorSidebar />
      {children}
    </div>
  );
}

function VisorSidebar() {
  const router = useRouter();

  return (
    <Listbox
      topContent={
        <>
          <DropdownChangeModule currentModuleKey="visor" />
          <Divider className="bg-primary-foreground opacity-50 my-2" />
        </>
      }
      color="secondary"
      aria-label="Visor Navigation"
      onAction={(key) => { router.push(String(key)); }}
      className='hidden lg:flex items-center px-2 py-4 max-w-60 bg-primary text-primary-foreground'
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