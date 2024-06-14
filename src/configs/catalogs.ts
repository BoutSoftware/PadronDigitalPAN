
export interface TiposPunto {
  id: string,
  nombre: string,
  icon: string,
  estructuraId: typeof ESTRUCTURAS[number]["id"],
}

export interface TiposNecesidades {
  id: string,
  nombre: string,
  categoriaId: typeof CATEGORIAS_NECESIDADES[number]["id"],
  detalles: {
    id: string,
    nombre: string,
    color: string
  }[]
}

export interface StatusNecesidades {
  id: string,
  nombre: string,
  color: "danger" | "warning" | "success"
}

export const ESTRUCTURAS = [
  {
    id: "politica",
    nombre: "Politica",
  },
  {
    id: "territorial",
    nombre: "Territorial",
  },
  {
    id: "gobierno",
    nombre: "Gobierno",
  },
] as const;

export const CONFIGURACIONES_GEOGRAFICAS = [
  {
    id: "municipios",
    nombre: "Municipios"
  },
  {
    id: "delegaciones",
    nombre: "Delegaciones"
  },
  {
    id: "distritosLocales",
    nombre: "Distritos Locales"
  },
  {
    id: "secciones",
    nombre: "Secciones"
  },
  {
    id: "coloinias",
    nombre: "Colonia/Localidad"
  },
] as const;

export const STATUS_RONDAS = [
  {
    id: "activa",
    nombre: "ACTIVA",
    color: "verde",
  },
  {
    id: "pausada",
    nombre: "PAUSADA",
    color: "amarilla",
  },
  {
    id: "terminada",
    nombre: "TERMINADA",
    color: "roja",
  },
  {
    id: "noiniciada",
    nombre: "NO INICIADA",
    color: "blanco",
  },
];


export const TIPOS_PUNTO: TiposPunto[] = [
  {
    id: "necesidades",
    nombre: "Necesidades",
    icon: "iconoNecesidad",
    estructuraId: "territorial"
  },
  {
    id: "encuestas",
    nombre: "Encuestas",
    icon: "inocoEncuesta",
    estructuraId: "politica"
  }
];

export const CATEGORIAS_NECESIDADES = [
  {
    id: "infraestructura",
    nombre: "Infraestructura",
  },
  {
    id: "mantenimiento",
    nombre: "Mantenimiento",
  },
] as const;

export const TIPOS_NECESIDADES: TiposNecesidades[] = [
  {
    id: "baches",
    nombre: "Baches",
    categoriaId: "infraestructura",
    detalles: [
      {
        id: "pequeno",
        nombre: "Pequeño",
        color: "ffd966"
      },
      {
        id: "mediano",
        nombre: "Mediano",
        color: "f6b26b"
      },
      {
        id: "grande",
        nombre: "Grande",
        color: "e06666"
      }
    ]
  },
  {
    id: "basura",
    nombre: "Basura",
    categoriaId: "mantenimiento",
    detalles: [
      {
        id: "poda",
        nombre: "Poda",
        color: "ffd966"
      },
      {
        id: "tiliches",
        nombre: "Tiliches",
        color: "f6b26b"
      },
      {
        id: "deshechos",
        nombre: "Deshechos",
        color: "e06666"
      }
    ]
  },
];

export const STATUS_NECESIDADES: StatusNecesidades[] = [
  {
    id: "reportado",
    nombre: "Reportado",
    color: "danger"
  },
  {
    id: "validado",
    nombre: "Validado",
    color: "warning"
  },
  {
    id: "atendido",
    nombre: "Atendido",
    color: "success"
  }
];

// Aqui se manda una lista de ids (lo que se va a almacenar en subcooridnadores, equipos, rondas, etc..) y te regresa los tipos de punto
export const getTipoPuntos = (ids: string[]) => {
  return TIPOS_PUNTO.filter(tipo => ids.includes(tipo.id));
};

// Aqui se manda el id de una categoria de necesidad, y te va a regresar una lista con los tipos de necesidades con sus detalles
export const getTiposNecesidad = (id: string) => {
  return TIPOS_NECESIDADES.filter(tipo => tipo.categoriaId === id);
};



