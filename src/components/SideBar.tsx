"use client";

import React, { useState } from "react";
import { Listbox, Button, ListboxProps, } from "@nextui-org/react";

interface SideBarProps {
  isVisible: boolean
  topContent: ListboxProps["topContent"]
  bottomContent: ListboxProps["bottomContent"]
  children: ListboxProps["children"]
  ariaLabel: ListboxProps["aria-label"]
  onAction: ListboxProps["onAction"]
}

export default function SideBar(props: SideBarProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Listbox
      color="secondary"
      aria-label={props.ariaLabel}
      onAction={props.onAction}
      className={`flex items-center h-full px-2 py-4 max-w-60 bg-primary text-primary-foreground relative ${!isOpen && "w-4 p-0 hide-children"}`}
      classNames={{ list: `h-full` }}
      topContent={<>
        {props.topContent}
        <Button color="secondary" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 min-w-0 !flex" isIconOnly size="sm" onPress={() => setIsOpen(!isOpen)}>
          <span className="material-symbols-outlined">drag_indicator</span>
        </Button>
      </>}
      bottomContent={props.bottomContent}
    >
      {props.children}
    </Listbox>
  );
}