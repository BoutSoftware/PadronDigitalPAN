import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Selection } from "@nextui-org/react";
import { useState } from "react";

interface CaminanteProps {
  id: string,
  active: boolean,
  name: string
}

export function Caminante({ id, name, active }: CaminanteProps) {

  const [isActive, setIsActive] = useState<boolean>(active);
  const [isActiveKey, setIsActiveKey] = useState<Selection>(new Set([`${active ? "active" : "inactive"}`]));

  async function handleCaminanteStatus(key: Selection) {

    const resBody = await fetch(`/dashboard/api/visor/members/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ newStatus: !isActive })
    })
      .then(res => res.json())
      .catch(err => console.error(err));

    setIsActive(resBody.data.active);
    setIsActiveKey(key);
  }

  return (
    <div key={id} className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Avatar showFallback name={name} src="https://images.unsplash.com/broken" />
        <span className="">{name}</span>
      </div>
      <Dropdown>
        <DropdownTrigger>
          <Button>{isActive ? "Activo" : "Inactivo"}</Button>
        </DropdownTrigger>
        <DropdownMenu
          onSelectionChange={(key) => handleCaminanteStatus(key)}
          selectedKeys={isActiveKey}
          selectionMode="single"
          aria-label="Caminante activo o inactivo"
        >
          <DropdownItem key="active">Activo</DropdownItem>
          <DropdownItem key="inactive">Inactivo</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}