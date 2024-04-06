"use client";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";

export default function SideBar() {
  return (
    <div className="flex flex-col p-4 w-full max-w-60 bg-secondary text-secondary-foreground">
      <h2 className="text-2xl font-medium">Sidebar</h2>

      {/* <div className="absolute top-4 -right-3">
        <Button isIconOnly size="sm" variant="shadow" color="primary">
          <span className="material-symbols-outlined icon-sm !text-secondary-foreground">keyboard_double_arrow_left</span>
        </Button>
      </div> */}

      <Listbox color="primary">
        <ListboxSection title={"Administrador"} classNames={{ heading: "text-primary-foreground opacity-70" }}>
          <ListboxItem key={"/dashboard/base/usuarios"}>
            Usuarios
          </ListboxItem>
          <ListboxItem key={"/dashboard/base/usuarios"}>
            Directorio
          </ListboxItem>
        </ListboxSection>
        <ListboxSection title={"Modulos"} classNames={{ heading: "text-primary-foreground opacity-70" }}>
          <ListboxItem key={"/dashboard/visor"} className="flex items-center gap-2">
            <span className="material-symbols-outlined">map</span>
            Modulo Visor
          </ListboxItem>
          <ListboxItem key={"/dashboard/visor"} className="flex items-center gap-2">
            <span className="material-symbols-outlined">chat</span>
            Modulo WhatsApp
          </ListboxItem>
        </ListboxSection>
      </Listbox>
    </div>
  );
}