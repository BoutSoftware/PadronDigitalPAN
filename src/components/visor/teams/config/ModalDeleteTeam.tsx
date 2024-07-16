"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useState } from "react";

interface Props {
  teamId: string
  deleteTeam: () => void
}

export function ModalDeleteTeam({ teamId, deleteTeam }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setIsOpen(true)} color="danger" size="lg" className="max-w-48 self-end">Eliminar equipo</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Eliminar equipo</ModalHeader>
          <ModalBody>¿Está seguro que desea eliminar el equipo? Esta acción no se puede deshacer</ModalBody>
          <ModalFooter className="flex justify-end">
            <Button onPress={() => setIsOpen(false)}>Cancelar</Button>
            <Button color="danger" onPress={deleteTeam}>Eliminar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}