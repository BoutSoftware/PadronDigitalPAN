"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, Image, useDisclosure, Input } from "@nextui-org/react";
import Roles from "@/components/Roles";
import { User, Person } from "@prisma/client";

export default function IndividualUserPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [user, setUser] = useState<User & { Person: Person, activeModules: number } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const fullName = `${user?.Person.name} ${user?.Person.fatherLastName} ${user?.Person.motherLastName}`;

  const getUser = async () => {
    const resBody = await (await fetch(`/dashboard/api/users/${id}`)).json();

    if (resBody.code !== "OK") {
      alert("Error al cargar el usuario");
    }
    setUser(resBody.data);
  };

  // Change password
  const handleChangePassword = async () => {
    const reqBody = { password: newPassword };

    if (newPassword === ""){
      alert("La contraseña no puede estar vacía");
      return;
    }

    const resBody = await fetch(`/dashboard/api/users/${id}/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    }).then((res) => res.json());

    if (resBody.code !== "OK") {
      alert("Error al cambiar la contraseña");
    }
    // close modal and clear input
    onOpenChange();
    alert("Contraseña cambiada correctamente");
    setNewPassword("");
    setConfirmationPassword("");
  };

  // Function to format phone number
  const formatPhone = (phone: string) => {
    const cleaned = ("" + phone).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return match[1] + " " + match[2] + " " + match[3];
    }
    return null;
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex flex-grow flex-col p-8">
      {user &&
        <>
          <Header title={fullName} />

          <main id="main" className="mt-4">
            <div id="userInfoContainer" className="flex flex-row mt-8 gap-8">
              <div id="image" className="w-48 h-48">
                {user.Person.photoURL ?
                  <Image src={user.Person.photoURL} alt="Foto de perfil" className="w-full object-cover aspect-square" />
                  : // If user has no photo, show initials
                  <div className="w-full h-full aspect-square bg-blue-200 flex items-center justify-center rounded-lg">
                    <span className="p-2 text-5xl">
                      {fullName.split(" ").map((word) => word[0]).join("").toUpperCase()}
                    </span>
                  </div>
                }
              </div>
              <div id="userInfo" className="flex flex-row gap-x-8">
                <div className="flex flex-col gap-4">
                  <p><strong>Nombre:</strong> {fullName} </p>
                  <p><strong>Número telefónico:</strong> {formatPhone(user.Person.phone?.number || "")}</p>
                  <p><strong>CURP:</strong> {user.Person.curp}</p>
                  <div className="mt-8">
                    <Button
                      startContent={<span className="material-symbols-outlined">lock</span>}
                      className="bg-content1 drop-shadow-md"
                      onPress={onOpen}
                    >
                      Cambiar contraseña
                    </Button>
                    <ChangePasswordModal 
                      isOpen={isOpen} 
                      onOpenChange={onOpenChange} 
                      newPassword={newPassword} 
                      setNewPassword={setNewPassword} 
                      handleChangePassword={handleChangePassword} 
                      confirmationPassword={confirmationPassword}
                      setConfirmationPassword={setConfirmationPassword}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <p><strong>Modulos activos:</strong> {user.activeModules}</p>
                  <p><strong>Estado:</strong> {user.active ? "Activo" : "Inactivo"}</p>
                  <p><strong>Usuario:</strong> {user.username}</p>
                  <div className="mt-8">
                    <Button
                      startContent={<span className="material-symbols-outlined">account_tree</span>}
                      className="bg-content1 drop-shadow-md"
                    >
                      Llevar a la estructura
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-10 max-w-5xl" />

            <div id="roles" className="flex flex-col p-8 rounded-xl max-w-4xl border border-divider shadow-lg">
              <h1 className="text-4xl">Roles</h1>
              <div className="flex flex-col gap-6 mt-4">
                {numeros.map((numero) => (
                  <Roles key={numero} numero={numero} />
                ))}
              </div>
            </div>
          </main>
        </>
      }
    </div>

  );
}

function ChangePasswordModal({ isOpen, onOpenChange, newPassword, setNewPassword, confirmationPassword, setConfirmationPassword, handleChangePassword }:
  { isOpen: boolean, onOpenChange: () => void, newPassword: string, setNewPassword: (newPassword: string) => void, confirmationPassword: string, setConfirmationPassword: (confirmationPassword: string) => void, handleChangePassword: () => void }) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Cambiar contraseña</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Nueva contraseña"
                placeholder="Ingrese la nueva contraseña"
                type="password"
                variant="bordered"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                label="Confirmar contraseña"
                placeholder="Confirme la nueva contraseña"
                type="password"
                variant="bordered"
                value={confirmationPassword}
                onChange={(e) => setConfirmationPassword(e.target.value)}
                errorMessage={newPassword !== confirmationPassword ? "Las contraseñas no coinciden" : ""}
                color={newPassword === "" ? "default" : newPassword !== confirmationPassword ? "danger" : "success"}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleChangePassword} isDisabled={newPassword  === "" || newPassword !== confirmationPassword}>
                Cambiar contraseña
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
