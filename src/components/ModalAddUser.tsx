"use client";
import { Modal, ModalContent, ModalBody, Button, useDisclosure, Autocomplete, AutocompleteItem, ModalHeader, Input, ModalFooter } from "@nextui-org/react";
import { useState } from "react";

const fakeData = [
  {
    "fullName": "Sophia Taylor"
  },
  {
    "fullName": "Ethan Anderson"
  },
  {
    "fullName": "Ava Wilson"
  },
  {
    "fullName": "Noah Thomas"
  },
  {
    "fullName": "Isabella White"
  },
  {
    "fullName": "William Martinez"
  },
  {
    "fullName": "Mia Brown"
  },
  {
    "fullName": "Liam Lee"
  },
  {
    "fullName": "Amelia Rodriguez"
  },
  {
    "fullName": "Benjamin Garcia"
  }
];

interface User {
  id: number
  fullName: string
  activeModules: string[]
  status: boolean
  userName: string
}


export default function ModalAddUser({ currentUsers, setCurrentUsers }: { currentUsers: User[], setCurrentUsers: any }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [personSearched, setPersonSearched] = useState("");
  return (
    <>
      <Button onPress={onOpen} color="secondary">Agregar usuario</Button>
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h4>Agregando un usuario</h4>
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  startContent={<span className="material-symbols-outlined icon-sm">search</span>}
                  label="Persona"
                  placeholder="Selecciona una persona"
                  onInputChange={setPersonSearched}>
                  {
                    fakeData.map((item, index) => <AutocompleteItem key={index} value={item.fullName}>{item.fullName}</AutocompleteItem>)
                  }
                </Autocomplete>
                <Input
                  type="text"
                  value={newUserName}
                  onValueChange={setNewUserName}
                  label="Usuario"
                  labelPlacement="inside"
                  variant="flat"
                  placeholder="Asigna un nombre de usuario"
                  startContent={<span className="material-symbols-outlined">person</span>}
                />
                <div className="flex gap-4 items-center">
                  <Input
                    type="text"
                    value={newUserPassword}
                    onValueChange={setNewUserPassword}
                    label="Contraseña"
                    labelPlacement="inside"
                    variant="flat"
                    placeholder="Asigna un nombre de usuario"
                    startContent={<span className="material-symbols-outlined">key</span>}
                    endContent={
                      <Button
                        className="rounded-full bg-transparent"
                        size="md"
                        isIconOnly
                        onPress={async () => {
                          await navigator.clipboard.writeText(newUserPassword);
                          alert("Contraseña copiada en el portapapeles");
                        }}
                      >
                        <span className="material-symbols-outlined icon">content_copy</span>
                      </Button>}
                  />
                  <Button color="secondary" className="px-10" onPress={() => {
                    const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    let password = "";
                    for (let i = 0; i < 16; i++) {
                      const indice = Math.floor(Math.random() * abecedario.length);
                      password += abecedario.charAt(indice);
                    }
                    setNewUserPassword(password);
                  }}>Generar contraseña</Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  size="lg"
                  onPress={() => {
                    const newUser = {
                      id: 2024,
                      fullName: personSearched,
                      activeModules: [],
                      status: false,
                      userName: newUserName
                    };
                    setCurrentUsers([...currentUsers, newUser]);
                    onClose();
                  }}
                  fullWidth
                >
                  Agregar usuario
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}