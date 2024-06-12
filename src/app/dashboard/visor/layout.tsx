"use client";
import { ReactNode } from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import DropdownChangeModule from "@/components/DropdownChangeModule";

export default function LayoutVisor({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="bg-primary flex flex-col w-full max-w-60 text-primary-foreground">

        <DropdownChangeModule currentModule="visor" />

        <Listbox>
          <ListboxItem
            className="py-3 rounded-none"
            key="dashboard/visor/teams"
          >
            Equipos
          </ListboxItem>
          <ListboxItem
            className="py-3 rounded-none"
            key="dashboard/visor/map"
          >
            Mapa general
          </ListboxItem>
          <ListboxItem
            className="py-3 rounded-none"
            key="dashboard/visor/table"
          >
            Tabla general
          </ListboxItem>
          <ListboxItem
            className="py-3 rounded-none"
            key="dashboard/visor/people"
          >
            Personas
          </ListboxItem>
        </Listbox>
      </div>
      {children}
    </div>
  );
}