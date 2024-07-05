"use client";
import { useState } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

interface Props {
  getGeographicLevelValues: (geographicLevelId: string, municipios: string[]) => void

}

export function ModalModifyGeographicArea({
  getGeographicLevelValues
}: Props) {

  const [isOpen, setIsOpen] = useState(false);

  function handleModifyGeographicArea() {

  }

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Modificar área geográfica</Button>

      <Modal isOpen={isOpen} size="5xl">
        <ModalContent>
          <ModalHeader>
            Modificando área geográfica
          </ModalHeader>
          <ModalBody>


          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => setIsOpen(false)}>Cancelar</Button>
            <Button color="primary" onPress={handleModifyGeographicArea}>Modificar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}