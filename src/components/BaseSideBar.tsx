"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authContext } from "@/contexts/AuthContext";
import { ThemeSwitch } from "@/contexts/ThemeProvider";
import { Listbox, ListboxItem, ListboxSection, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User, Divider, Button, } from "@nextui-org/react";

export default function BaseSideBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const { isSuperAdmin } = useContext(authContext);

  return (
    <Listbox
      color="secondary"
      aria-label="Main Navigation"
      onAction={(key) => { router.push(String(key)); }}
      className={`flex items-center h-full px-2 py-4 max-w-60 bg-primary text-primary-foreground relative transition-all ${!isOpen && "w-4 p-0 hide-children"}`}
      classNames={{ list: "h-full" }}
      topContent={
        <>
          <SideBarTopContent />
          <Button color="secondary" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 min-w-0 !flex" isIconOnly size="sm" onPress={() => setIsOpen(!isOpen)}>
            <span className="material-symbols-outlined">drag_indicator</span>
          </Button>
        </>
      }
      bottomContent={<SideBarBottomContent />}
    >
      {/* Admin Routes */}
      <ListboxSection title={"Administrador"} classNames={{ heading: "text-primary-foreground opacity-70" }} className={!isSuperAdmin ? "hidden" : ""}>
        <ListboxItem key={"/dashboard/base/users"} className="flex items-center gap-2 py-3 px-4 text-primary-foreground" startContent={<span className="material-symbols-outlined">group</span>}>
          Usuarios
        </ListboxItem>
        <ListboxItem key={"/dashboard/base/directory"} className="flex items-center gap-2 py-3 px-4" startContent={<span className="material-symbols-outlined">lists</span>}>
          Directorio
        </ListboxItem>
      </ListboxSection>

      {/* Normal User Routes */}
      <ListboxSection title={"Modulos"} classNames={{ heading: "text-primary-foreground opacity-70" }}>
        <ListboxItem key={"/dashboard/visor"} className="flex items-center gap-2 py-3 px-4" startContent={<span className="material-symbols-outlined">map</span>}>
          Visor
        </ListboxItem>
        <ListboxItem key={"/dashboard/whats"} className="flex items-center gap-2 py-3 px-4" startContent={<span className="material-symbols-outlined">chat</span>}>
          WhatsApp
        </ListboxItem>
        <ListboxItem key={"/dashboard/"} className="flex items-center gap-2 py-3 px-4" startContent={<span className="material-symbols-outlined">report</span>}>
          Atención Ciudadana
        </ListboxItem>
        <ListboxItem key={"/dashboard/events"} className="flex items-center gap-2 py-3 px-4" startContent={<span className="material-symbols-outlined">emoji_events</span>}>
          Eventos y actividades
        </ListboxItem>
        <ListboxItem key={"/dashboard/organigram"} className="flex items-center gap-2 py-3 px-4" startContent={<span className="material-symbols-outlined">sort_by_alpha</span>}>
          Organigrama
        </ListboxItem>
        <ListboxItem key={"/dashboard/callcenter"} className="flex items-center gap-2 py-3 px-4" startContent={<span className="material-symbols-outlined">contact_phone</span>}>
          Call Center
        </ListboxItem>
      </ListboxSection>
    </Listbox>
  );
}

function SideBarTopContent() {
  return <h2 className="text-2xl font-medium text-center my-2">Sidebar</h2>;
}

function SideBarBottomContent() {
  const { currentUser, logout, isSuperAdmin } = useContext(authContext);

  return (
    <>
      <Divider className="my-3 bg-primary-100" />
      <Dropdown placement="right-end" showArrow>
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              src:
                currentUser?.profilePicture
            }}
            className="w-full py-2 px-4 bg-secondary justify-start gap-2"
            description={currentUser?.username}
            name={
              <div className="flex items-center gap-2">
                {currentUser?.name}
                {isSuperAdmin && (
                  <span className="material-symbols-outlined large icon-filled text-warning-500 icon-sm">star</span>
                )}
              </div>
            }
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem
            key="theme"
            closeOnSelect={false}
            startContent={
              <span className="material-symbols-outlined">brightness_4</span>
            }
            endContent={<ThemeSwitch />}
          >
            Cambiar tema
          </DropdownItem>
          <DropdownItem
            key="settings"
            startContent={
              <span className="material-symbols-outlined">settings</span>
            }
          >
            Configuración
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            onClick={logout}
            startContent={
              <span className="material-symbols-outlined">logout</span>
            }
          >
            Cerrar Sesión
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
