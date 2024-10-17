import React, { useState, ChangeEvent } from "react";
import { Button, Checkbox, Select, SelectItem, Input } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Accordion, AccordionItem } from "@nextui-org/react";

// Datos estáticos para los municipios, colonias, detalles y estados
const MUNICIPIOS = [
  { id: "1", nombre: "Municipio 1" },
  { id: "2", nombre: "Municipio 2" },
  { id: "3", nombre: "Municipio 3" },
];

const COLONIAS = [
  { id: "1", nombre: "Colonia 1" },
  { id: "2", nombre: "Colonia 2" },
  { id: "3", nombre: "Colonia 3" },
];

const DETALLES = [
  { id: "1", nombre: "Detalle 1" },
  { id: "2", nombre: "Detalle 2" },
  { id: "3", nombre: "Detalle 3" },
];

const STATUSES = [
  { id: "1", nombre: "Status 1" },
  { id: "2", nombre: "Status 2" },
  { id: "3", nombre: "Status 3" },
];

const FiltroModal = () => {
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);

  // Estado para los filtros seleccionados
  const [filters, setFilters] = useState({
    municipio: [] as string[],
    colonia: [] as string[],
    detalle: [] as string[],
    status: [] as string[],
  });

  // Estado para controlar qué filtros están habilitados
  const [enabledFilters, setEnabledFilters] = useState({
    municipio: false,
    colonia: false,
    detalle: false,
    status: false,
  });

  // Maneja el cambio en los checkboxes para habilitar o deshabilitar filtros
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, filterType: string) => {
    setEnabledFilters({
      ...enabledFilters,
      [filterType]: e.target.checked,
    });
  };

  // Convierte una cadena a un arreglo, dividiendo por comas
  const str2arr = (str: string) => (str ? str.split(",") : []);

  return (
    <>
      {/* Botón para abrir el modal */}
      <Button onClick={() => setShowModal(true)}>Abrir Filtros</Button>

      {/* Modal para los filtros */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} className="z-20" backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex items-center w-full">
            <h3 className="text-lg font-semibold text-center w-full">Filtros</h3>
          </ModalHeader>
          <ModalBody>
            <Accordion>
              <AccordionItem key="activacion" aria-label="Nombre de la Activacion" title="Nombre de la Activacion">
                <Accordion>
                  {/* Primer conjunto de filtros */}
                  <AccordionItem
                    key="tipoPunto1"
                    aria-label="Tipo de Punto 1"
                    title={
                      <div className="flex items-center">
                        <Checkbox
                          isSelected={enabledFilters.municipio}
                          onChange={(e) => handleCheckboxChange(e, "municipio")}
                          className="mr-2"
                        />
                        Tipo de Punto 1
                      </div>
                    }
                  >
                    {/* Filtros internos */}
                    <Select
                      label="Municipio"
                      className="my-2"
                      placeholder="Selecciona un municipio"
                      onChange={(e) => setFilters({ ...filters, municipio: str2arr(e.target.value) })}
                      selectedKeys={filters.municipio}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.municipio}
                    >
                      {MUNICIPIOS.map((municipio) => (
                        <SelectItem value={municipio.id} key={municipio.id}>{municipio.nombre}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Colonia"
                      className="my-2"
                      placeholder="Selecciona una colonia"
                      onChange={(e) => setFilters({ ...filters, colonia: str2arr(e.target.value) })}
                      selectedKeys={filters.colonia}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.municipio}
                    >
                      {COLONIAS.map((colonia) => (
                        <SelectItem value={colonia.id} key={colonia.id}>{colonia.nombre}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Detalle del Punto"
                      className="my-2"
                      placeholder="Selecciona un detalle"
                      onChange={(e) => setFilters({ ...filters, detalle: str2arr(e.target.value) })}
                      selectedKeys={filters.detalle}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.municipio}
                    >
                      {DETALLES.map((detalle) => (
                        <SelectItem value={detalle.id} key={detalle.id}>{detalle.nombre}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Status"
                      className="my-2"
                      placeholder="Selecciona un status"
                      onChange={(e) => setFilters({ ...filters, status: str2arr(e.target.value) })}
                      selectedKeys={filters.status}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.municipio}
                    >
                      {STATUSES.map((status) => (
                        <SelectItem value={status.id} key={status.id}>{status.nombre}</SelectItem>
                      ))}
                    </Select>
                  </AccordionItem>

                  {/* Segundo conjunto de filtros */}
                  <AccordionItem
                    key="tipoPunto2"
                    aria-label="Tipo de Punto 2"
                    title={
                      <div className="flex items-center">
                        <Checkbox
                          isSelected={enabledFilters.colonia}
                          onChange={(e) => handleCheckboxChange(e, "colonia")}
                          className="mr-2"
                        />
                        Tipo de Punto 2
                      </div>
                    }
                  >
                    {/* Filtros internos */}
                    <Select
                      label="Municipio"
                      className="my-2"
                      placeholder="Selecciona un municipio"
                      onChange={(e) => setFilters({ ...filters, municipio: str2arr(e.target.value) })}
                      selectedKeys={filters.municipio}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.colonia}
                    >
                      {MUNICIPIOS.map((municipio) => (
                        <SelectItem value={municipio.id} key={municipio.id}>{municipio.nombre}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Colonia"
                      className="my-2"
                      placeholder="Selecciona una colonia"
                      onChange={(e) => setFilters({ ...filters, colonia: str2arr(e.target.value) })}
                      selectedKeys={filters.colonia}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.colonia}
                    >
                      {COLONIAS.map((colonia) => (
                        <SelectItem value={colonia.id} key={colonia.id}>{colonia.nombre}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Detalle del Punto"
                      className="my-2"
                      placeholder="Selecciona un detalle"
                      onChange={(e) => setFilters({ ...filters, detalle: str2arr(e.target.value) })}
                      selectedKeys={filters.detalle}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.colonia}
                    >
                      {DETALLES.map((detalle) => (
                        <SelectItem value={detalle.id} key={detalle.id}>{detalle.nombre}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Status"
                      className="my-2"
                      placeholder="Selecciona un status"
                      onChange={(e) => setFilters({ ...filters, status: str2arr(e.target.value) })}
                      selectedKeys={filters.status}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.colonia}
                    >
                      {STATUSES.map((status) => (
                        <SelectItem value={status.id} key={status.id}>{status.nombre}</SelectItem>
                      ))}
                    </Select>
                  </AccordionItem>
                </Accordion>
              </AccordionItem>

              <AccordionItem key="activacion2" aria-label="Nombre de la Activacion 2" title="Nombre de la Activacion 2">
                <Accordion>
                  {/* Primer conjunto de filtros */}
                  <AccordionItem
                    key="tipoPunto3"
                    aria-label="Tipo de Punto 3"
                    title={
                      <div className="flex items-center">
                        <Checkbox
                          isSelected={enabledFilters.detalle}
                          onChange={(e) => handleCheckboxChange(e, "detalle")}
                          className="mr-2"
                        />
                        Tipo de Punto 3
                      </div>
                    }
                  >
                    {/* Filtros internos */}
                    <Select
                      label="Municipio"
                      className="my-2"
                      placeholder="Selecciona un municipio"
                      onChange={(e) => setFilters({ ...filters, municipio: str2arr(e.target.value) })}
                      selectedKeys={filters.municipio}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.detalle}
                    >
                      {MUNICIPIOS.map((municipio) => (
                        <SelectItem value={municipio.id} key={municipio.id}>{municipio.nombre}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Colonia"
                      className="my-2"
                      placeholder="Selecciona una colonia"
                      onChange={(e) => setFilters({ ...filters, colonia: str2arr(e.target.value) })}
                      selectedKeys={filters.colonia}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.detalle}
                    >
                      {COLONIAS.map((colonia) => (
                        <SelectItem value={colonia.id} key={colonia.id}>{colonia.nombre}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Detalle del Punto"
                      className="my-2"
                      placeholder="Selecciona un detalle"
                      onChange={(e) => setFilters({ ...filters, detalle: str2arr(e.target.value) })}
                      selectedKeys={filters.detalle}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.detalle}
                    >
                      {DETALLES.map((detalle) => (
                        <SelectItem value={detalle.id} key={detalle.id}>{detalle.nombre}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Status"
                      className="my-2"
                      placeholder="Selecciona un status"
                      onChange={(e) => setFilters({ ...filters, status: str2arr(e.target.value) })}
                      selectedKeys={filters.status}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.detalle}
                    >
                      {STATUSES.map((status) => (
                        <SelectItem value={status.id} key={status.id}>{status.nombre}</SelectItem>
                      ))}
                    </Select>
                  </AccordionItem>

                  {/* Segundo conjunto de filtros */}
                  <AccordionItem
                    key="tipoPunto4"
                    aria-label="Tipo de Punto 4"
                    title={
                      <div className="flex items-center">
                        <Checkbox
                          isSelected={enabledFilters.status}
                          onChange={(e) => handleCheckboxChange(e, "status")}
                          className="mr-2"
                        />
                        Tipo de Punto 4
                      </div>
                    }
                  >
                    {/* Filtros internos */}
                    <Select
                      label="Municipio"
                      className="my-2"
                      placeholder="Selecciona un municipio"
                      onChange={(e) => setFilters({ ...filters, municipio: str2arr(e.target.value) })}
                      selectedKeys={filters.municipio}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.status}
                    >
                      {MUNICIPIOS.map((municipio) => (
                        <SelectItem value={municipio.id} key={municipio.id}>{municipio.nombre}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Colonia"
                      className="my-2"
                      placeholder="Selecciona una colonia"
                      onChange={(e) => setFilters({ ...filters, colonia: str2arr(e.target.value) })}
                      selectedKeys={filters.colonia}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.status}
                    >
                      {COLONIAS.map((colonia) => (
                        <SelectItem value={colonia.id} key={colonia.id}>{colonia.nombre}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Detalle del Punto"
                      className="my-2"
                      placeholder="Selecciona un detalle"
                      onChange={(e) => setFilters({ ...filters, detalle: str2arr(e.target.value) })}
                      selectedKeys={filters.detalle}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.status}
                    >
                      {DETALLES.map((detalle) => (
                        <SelectItem value={detalle.id} key={detalle.id}>{detalle.nombre}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Status"
                      className="my-2"
                      placeholder="Selecciona un status"
                      onChange={(e) => setFilters({ ...filters, status: str2arr(e.target.value) })}
                      selectedKeys={filters.status}
                      selectionMode="multiple"
                      isDisabled={!enabledFilters.status}
                    >
                      {STATUSES.map((status) => (
                        <SelectItem value={status.id} key={status.id}>{status.nombre}</SelectItem>
                      ))}
                    </Select>
                  </AccordionItem>
                </Accordion>
              </AccordionItem>
            </Accordion>
          </ModalBody>
          <ModalFooter className="items-center">
            {/* Botón para limpiar los filtros seleccionados */}
            {(filters.municipio.length > 0 || filters.colonia.length > 0 || filters.detalle.length > 0 || filters.status.length > 0) && (
              <Button
                variant="faded"
                color="default"
                size="sm"
                startContent={<span className="material-symbols-outlined !text-base">clear</span>}
                className="mr-auto gap-1"
                onClick={() => {
                  setFilters({ municipio: [], colonia: [], detalle: [], status: [] });
                }}
              >
                Limpiar Filtros
              </Button>
            )}
            {/* Botón para cancelar y cerrar el modal */}
            <Button variant="light" color="danger" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            {/* Botón para aplicar los filtros y cerrar el modal */}
            <Button variant="solid" color="primary" onClick={() => setShowModal(false)}>
              Aplicar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FiltroModal;
