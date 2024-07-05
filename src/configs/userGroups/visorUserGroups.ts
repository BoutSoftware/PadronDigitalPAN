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


export const isCoordinador = (id: typeof TITULOS[number]["id"]) => {
  if ( id === "admin") return true;
  return coordinatorsGroup.includes(id);
};

export const isSubcoordinador = (id: typeof TITULOS[number]["id"]) => {
  if ( id === "admin") return true;
  return subcoordinadorsGroup.includes(id);
};

export const isAuxiliar = (id: typeof TITULOS[number]["id"]) => {
  if ( id === "admin") return true;
  return axiliariyGroup.includes(id);
};

export const isTeamMember = (id: typeof TITULOS[number]["id"]) => {
  if ( id === "admin") return true;
  return teamMembersGroup.includes(id);
};

export const isEnlace = (id: typeof TITULOS[number]["id"]) => {
  if ( id === "admin") return true;
  return id === "enlace";
};

export const isCaminate = (id: typeof TITULOS[number]["id"]) => {
  if ( id === "admin") return true;
  return id === "caminate";
};

export const isCoordinadorWaterFall = (id: typeof TITULOS[number]["id"]) => {
  const index = TITULOS.findIndex(title => title.id === "adjCoordinador");
  const validTitulos = TITULOS.slice(0, index + 1).map(title => title.id);

  return validTitulos.includes(id);
};

export const isSubcoordinadorWaterFall = (id: typeof TITULOS[number]["id"]) => {
  const index = TITULOS.findIndex(title => title.id === "tecSubcoordinador");
  const validTitulos = TITULOS.slice(0, index + 1).map(title => title.id);

  return validTitulos.includes(id);
};

export const isAuxiliarWaterFall = (id: typeof TITULOS[number]["id"]) => {
  const index = TITULOS.findIndex(title => title.id === "tecAuxiliar");
  const validTitulos = TITULOS.slice(0, index + 1).map(title => title.id);

  return validTitulos.includes(id);
};

export const isEnlaceWaterFall = (id: typeof TITULOS[number]["id"]) => {
  const index = TITULOS.findIndex(title => title.id === "enlace");
  const validTitulos = TITULOS.slice(0, index + 1).map(title => title.id);

  return validTitulos.includes(id);
};

export const isCaminateWaterFall = (id: typeof TITULOS[number]["id"]) => {
  const index = TITULOS.findIndex(title => title.id === "caminate");
  const validTitulos = TITULOS.slice(0, index + 1).map(title => title.id);

  return validTitulos.includes(id);
};

const titlesFunctions = {
  "coordinador": isCoordinador,
  "subcoordinador": isSubcoordinador,
  "axuiliar": isAuxiliar,
  "enlace": isEnlace,
  "caminate": isCaminate
};

export const isValid = ({ id, include, exclude }: {
  id: typeof TITULOS[number]["id"],
  include?: (keyof typeof titlesFunctions)[],
  exclude?: (keyof typeof titlesFunctions)[] 
}) => {
  if ( id === "admin") return true;

  if ( include ) {
    return include.some( title => titlesFunctions[title](id) );
  }

  if ( exclude ) {
    return !exclude.some( title => titlesFunctions[title](id) );
  }

  return false;
};