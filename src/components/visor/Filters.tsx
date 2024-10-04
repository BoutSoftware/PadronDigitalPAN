import { Accordion, AccordionItem, Button, Checkbox, Select, SelectItem } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";

export default function Filters() {
  const [filters, setFilters] = useState({
    activacion1: {
      tipoPunto1: {
        isEnabled: false,
        municipio: [] as string[],
        colonia: [] as string[],
        detalle: [] as string[],
        status: [] as string[],
      },
      tipoPunto2: {
        isEnabled: false,
        municipio: [] as string[],
        colonia: [] as string[],
        detalle: [] as string[],
        status: [] as string[],
      },
    },
    activacion2: {
      tipoPunto1: {
        isEnabled: false,
        municipio: [] as string[],
        colonia: [] as string[],
        detalle: [] as string[],
        status: [] as string[],
      },
      tipoPunto2: {
        isEnabled: false,
        municipio: [] as string[],
        colonia: [] as string[],
        detalle: [] as string[],
        status: [] as string[],
      },
    },
  });

  const handleSubmit = () => {
    
  };

  return (
    <div className="max-w-sm">
      <h2 className="text-2xl font-bold">Filtros</h2>
      <span>Viendo: 100/1200</span>
      <Accordion>
        <AccordionItem key="activacion1" aria-label="Activacion 1" title="Activacion 1">
          <ActivationTypeXFilters filters={filters.activacion1} setFilters={(activationTypeFilters) => setFilters({ ...filters, activacion1: activationTypeFilters })} />
        </AccordionItem>
        <AccordionItem key="activacion2" aria-label="Activacion 2" title="Activacion 2">
          <ActivationTypeXFilters filters={filters.activacion2} setFilters={(activationTypeFilters) => setFilters({ ...filters, activacion2: activationTypeFilters })} />
        </AccordionItem>
      </Accordion>
      <div className="flex justify-end">
        <Button variant="solid" color="primary">Aplicar</Button>
      </div>
    </div>
  );
}

interface PointTypeXFiltersFields {
  isEnabled: boolean;
  municipio: string[];
  colonia: string[];
  detalle: string[];
  status: string[];
}
function PointTypeXFilters({ isPointTypeEnabled, filters, setFilters }: { isPointTypeEnabled: boolean, filters: PointTypeXFiltersFields, setFilters: (filters: PointTypeXFiltersFields) => void }) {
  const [options, setOptions] = useState({
    municipio: [] as { id: string; nombre: string }[],
    colonia: [] as { id: string; nombre: string }[],
    detalle: [] as { id: string; nombre: string }[],
    status: [] as { id: string; nombre: string }[],
  });

  useEffect(() => {
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

    setOptions({
      municipio: MUNICIPIOS,
      colonia: COLONIAS,
      detalle: DETALLES,
      status: STATUSES,
    });
  }, []);

  const str2arr = (str: string) => (str ? str.split(",") : []);

  return (
    <>
      {/* Filtros internos */}
      <Select
        label="Municipio"
        className="my-2"
        placeholder="Selecciona un municipio"
        onChange={(e) => setFilters({ ...filters, municipio: str2arr(e.target.value) })}
        selectedKeys={filters.municipio}
        selectionMode="multiple"
        isDisabled={!isPointTypeEnabled}
      >
        {options.municipio.map((municipio) => (
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
        isDisabled={!isPointTypeEnabled}
      >
        {options.colonia.map((colonia) => (
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
        isDisabled={!isPointTypeEnabled}
      >
        {options.detalle.map((detalle) => (
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
        isDisabled={!isPointTypeEnabled}
      >
        {options.status.map((status) => (
          <SelectItem value={status.id} key={status.id}>{status.nombre}</SelectItem>
        ))}
      </Select>
    </>
  );
}

interface ActivationTypeFiltersProps {
  filters: {
    tipoPunto1: PointTypeXFiltersFields;
    tipoPunto2: PointTypeXFiltersFields;
  };
  setFilters: (filters: { tipoPunto1: PointTypeXFiltersFields; tipoPunto2: PointTypeXFiltersFields }) => void;
}
function ActivationTypeXFilters({ filters, setFilters }: ActivationTypeFiltersProps) {
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, filterType: "tipoPunto1" | "tipoPunto2") => {
    // setEnabledTypes({ ...enabledTypes, [filterType]: e.target.checked });
    setFilters({ ...filters, [filterType]: { ...filters[filterType], isEnabled: e.target.checked } });
  };

  return (
    <Accordion>
      <AccordionItem
        key="tipoPunto1"
        aria-label="Tipo de Punto 1"
        startContent={
          <Checkbox
            isSelected={filters.tipoPunto1.isEnabled}
            onChange={(e) => handleCheckboxChange(e, "tipoPunto1")}
            className="mr-2"
          />
        }
        title={"Tipo de Punto 1"}
      >
        <PointTypeXFilters isPointTypeEnabled={filters.tipoPunto1.isEnabled} filters={filters.tipoPunto1} setFilters={(pointTypeFilters) => setFilters({ ...filters, tipoPunto1: pointTypeFilters })} />
      </AccordionItem>
      <AccordionItem
        key="tipoPunto2"
        aria-label="Tipo de Punto 2"
        startContent={
          <Checkbox
            isSelected={filters.tipoPunto2.isEnabled}
            onChange={(e) => handleCheckboxChange(e, "tipoPunto2")}
            className="mr-2"
          />
        }
        title={"Tipo de Punto 2"}
      >
        <PointTypeXFilters isPointTypeEnabled={filters.tipoPunto2.isEnabled} filters={filters.tipoPunto2} setFilters={(pointTypeFilters) => setFilters({ ...filters, tipoPunto2: pointTypeFilters })} />
      </AccordionItem>
    </Accordion>
  );
}