import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useState } from "react";


export default function ChangePasswordModal({ id }: { id: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleChangePassword = async () => {
    const reqBody = { password: newPassword };

    if (newPassword === "") {
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

  return (
    <>
      <Button
        startContent={<span className="material-symbols-outlined">lock</span>}
        className="bg-content1 drop-shadow-md"
        onPress={onOpen}
      >
        Cambiar contraseña
      </Button>
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
                <Button color="default" variant="flat" onPress={() => { onClose(); setNewPassword(""); setConfirmationPassword(""); }}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleChangePassword} isDisabled={newPassword === "" || newPassword !== confirmationPassword}>
                  Cambiar contraseña
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}