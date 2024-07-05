import { TITULOS } from "../catalogs/visorCatalog";



export const coordinatorsGroup: typeof TITULOS[number]["id"][] = [
  "coordinador",
  "tecCoordinador",
  "adjCoordinador"
];

export const subcoordinadorsGroup: typeof TITULOS[number]["id"][] = [
  "subcoordinador",
  "tecSubcoordinador"
];

export const axiliariyGroup: typeof TITULOS[number]["id"][] = [
  "axuiliar",
  "tecAuxiliar"
];

export const teamMembersGroup: typeof TITULOS[number]["id"][] = [
  "enlace",
  "caminate"
];

// const 




export const isCoordinador = (id: typeof TITULOS[number]["id"]) => {
  if ( id === "admin") return true;
  return coordinatorsGroup.includes(id);
};