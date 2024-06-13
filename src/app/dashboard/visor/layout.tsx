"use client";
import { ReactNode } from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import DropdownChangeModule from "@/components/DropdownChangeModule";

export default function LayoutVisor({ children }: { children: ReactNode }) {

  return (
    <div className="flex min-h-screen">
      <Sidebar topContent={<DropdownChangeModule currentModuleKey="visor" />} />
      {children}
    </div>
  );
}

function Sidebar({ topContent }: { topContent: ReactNode }) {
  return (
    <div className="bg-primary flex flex-col w-full max-w-60 text-primary-foreground">
      <Listbox
        topContent={topContent}
      >
        <ListboxItem
          startContent={<span className="material-symbols-outlined">groups</span>}
          className="py-3 rounded-none"
          key="dashboard/visor/teams"
        >
          Equipos
        </ListboxItem>
        <ListboxItem
          startContent={<span className="material-symbols-outlined">map</span>}
          className="py-3 rounded-none"
          key="dashboard/visor/map"
        >
          Mapa general
        </ListboxItem>
        <ListboxItem
          startContent={<span className="material-symbols-outlined">table_rows</span>}
          className="py-3 rounded-none"
          key="dashboard/visor/table"
        >
          Tabla general
        </ListboxItem>
        <ListboxItem
          startContent={<span className="material-symbols-outlined">emoji_people</span>}
          className="py-3 rounded-none"
          key="dashboard/visor/people"
        >
          Personas
        </ListboxItem>
      </Listbox>
    </div>
  );
}