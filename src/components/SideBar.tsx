"use client";

import { Listbox, ListboxItem, ListboxSection, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User, Button, Divider } from "@nextui-org/react";

export default function SideBar() {
  return (
    <div className="flex flex-col p-4 gap-4 w-full max-w-60 bg-secondary text-secondary-foreground">
      <h2 className="text-2xl font-medium text-center">Sidebar</h2>
      <Listbox
        color="primary"
        className='flex items-center h-full'
        classNames={{
          list: "h-full",
        }}
        bottomContent={
          <>
            <Divider className='my-1' />
            <Dropdown>
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                  }}
                  className="transition-transform w-full"
                  description="@tonyreichert"
                  name="Tony Reichert"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14">
                  <p className="font-bold">Signed in as</p>
                  <p className="font-bold">@tonyreichert</p>
                </DropdownItem>
                <DropdownItem key="settings">
                  Configuración
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Cerrar Sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        }
      >
        <ListboxSection title={"Administrador"} classNames={{ heading: "text-primary-foreground opacity-70" }}>
          <ListboxItem key={"/dashboard/base/usuarios"} className="flex items-center gap-2" startContent={<span className="material-symbols-outlined">group</span>}>
            Usuarios
          </ListboxItem>
          <ListboxItem key={"/dashboard/base/usuarios"} className="flex items-center gap-2" startContent={<span className="material-symbols-outlined">lists</span>}>
            Directorio
          </ListboxItem>
        </ListboxSection>
        <ListboxSection title={"Modulos"} classNames={{ heading: "text-primary-foreground opacity-70" }}>
          <ListboxItem key={"/dashboard/visor"} className="flex items-center gap-2" startContent={<span className="material-symbols-outlined">map</span>}>
            Modulo Visor
          </ListboxItem>
          <ListboxItem key={"/dashboard/visor"} className="flex items-center gap-2" startContent={<span className="material-symbols-outlined">chat</span>}>
            Modulo WhatsApp
          </ListboxItem>
          <ListboxItem key={"/dashboard/visor"} className="flex items-center gap-2" startContent={<span className="material-symbols-outlined">report</span>}>
            Modulo Atención Ciudadana
          </ListboxItem>
          <ListboxItem key={"/dashboard/visor"} className="flex items-center gap-2" startContent={<span className="material-symbols-outlined">emoji_events</span>}>
            Modulo Eventos y actividades
          </ListboxItem>
          <ListboxItem key={"/dashboard/visor"} className="flex items-center gap-2" startContent={<span className="material-symbols-outlined">sort_by_alpha</span>}>
            Modulo Organigrama
          </ListboxItem>
          <ListboxItem key={"/dashboard/visor"} className="flex items-center gap-2" startContent={<span className="material-symbols-outlined">contact_phone</span>}>
            Modulo Call Center
          </ListboxItem>
          <ListboxItem key={"/dashboard/visor"} className="flex items-center gap-2" startContent={<span className="material-symbols-outlined">chat</span>}>
            Modulo WhatsApp
          </ListboxItem>
          <ListboxItem key={"/dashboard/visor"} className="flex items-center gap-2" startContent={<span className="material-symbols-outlined">chat</span>}>
            Modulo WhatsApp
          </ListboxItem>
        </ListboxSection>
      </Listbox>
    </div>
  );
}