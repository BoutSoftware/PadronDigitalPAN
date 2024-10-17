import { Divider } from "@nextui-org/react";

interface Team {
  id: string
  name: string
  active: boolean
  Structure: {
    id: string
    nombre: string
  }
  Caminantes: {
    id: string
    name: string
    active: boolean
  }[]
  Link: {
    id: string
    active: boolean
    name: string
  }
  Auxiliary: {
    id: string
    active: boolean
    name: string
    municipios: string[]
  }
  TiposPunto: {
    id: string
    nombre: string
    icon: string
    activacionId: string
  }[]
  geographicConf: {
    geographicLevel: {
      id: string
      nombre: string
    }
    values: {
      id: string
      name: string
    }[]
  }
}

interface Props {
  team: Team
}

export function Structure({ team }: Props) {
  return (
    <>
      <h2 className="text-2xl text-foreground-600 ">Activacion perteneciente</h2>
      <Divider />
      <span className="text-foreground-400">{team.Structure.nombre}</span>
    </>
  );
}