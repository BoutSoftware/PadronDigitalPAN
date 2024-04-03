import React, { useEffect } from "react";
import { Button, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Selection } from "@nextui-org/react";

export default function Roles({ numero }: { children?: React.ReactNode; numero?: number }) {
    const [selectedOption, setSelectedOption] = React.useState<Selection>(new Set(["admin"]));

    useEffect (() => {
        console.log(selectedOption);
        
    },[selectedOption])


    const labelsMap = {
        admin: "Admin",
        viewer: "Viewer",
        user: "User",
    }

    // Convert the Set to an Array and get the first value.
    const selectedOptionValue = Array.from(selectedOption)[0] as keyof typeof labelsMap;

    return (
        <div className="flex flex-row justify-between items-center">
            <h1>Modulo {numero}</h1>
            <ButtonGroup variant="flat">
                <Button>{labelsMap[selectedOptionValue]}</Button>
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Button isIconOnly>
                            <span className="material-symbols-outlined">
                                expand_more
                            </span>
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Merge options"
                        selectedKeys={selectedOption}
                        selectionMode="single"
                        onSelectionChange={setSelectedOption}
                        className="max-w-[300px]"
                    >
                        <DropdownItem key="admin">
                            {labelsMap["admin"]}
                        </DropdownItem>
                        <DropdownItem key="viewer">
                            {labelsMap["viewer"]}
                        </DropdownItem>
                        <DropdownItem key="user">
                            {labelsMap["user"]}
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </ButtonGroup>
        </div>
    );
}