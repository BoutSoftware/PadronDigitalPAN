
export interface TiposPunto {
  id: string,
  nombre: string,
  icon: string,
  activacionId: typeof ACTIVATIONS[number]["id"],
}

export interface CategoriasNecesidades {
  id: string,
  nombre: string,
  tipos: {
    id: string,
    nombre: string,
    detalles: {
      id: string,
      nombre: string,
      color: string
    }[]
  }[]
}

export interface StatusNecesidades {
  id: string,
  nombre: string,
  color: "danger" | "warning" | "success"
}

export const ACTIVATIONS = [
  {
    id: "territorial",
    nombre: "Territorial",
  },
  {
    id: "barridos",
    nombre: "Barridos",
  },
  {
    id: "censos",
    nombre: "Censos",
  },
  {
    id: "reportes",
    nombre: "Reportes",
  }
] as const;

export type ActivationId = typeof ACTIVATIONS[number]["id"];

export const CONFIGURACIONES_GEOGRAFICAS = [
  {
    id: "municipios",
    nombre: "Municipios",
    dependsOn: null
  },
  {
    id: "delegaciones",
    nombre: "Delegaciones",
    dependsOn: "municipios"
  },
  {
    id: "distritosLocales",
    nombre: "Distritos Locales",
    dependsOn: "municipios"
  },
  {
    id: "secciones",
    nombre: "Secciones",
    dependsOn: "distritosLocales"
  },
  {
    id: "colonias",
    nombre: "Colonia/Localidad",
    dependsOn: "municipios"
  },
] as const;

export const STATUS_RONDAS = [
  {
    id: "activa",
    nombre: "ACTIVA",
    color: "success",
    mensaje: "Ronda activa"
  },
  {
    id: "pausada",
    nombre: "PAUSADA",
    color: "warning",
    mensaje: "Ronda pausada"
  },
  {
    id: "terminada",
    nombre: "TERMINADA",
    color: "danger",
    mensaje: "Ronda terminada"
  },
  {
    id: "noiniciada",
    nombre: "NO INICIADA",
    color: "default",
    mensaje: "Ronda no iniciada"
  },
];


export const TIPOS_PUNTO: TiposPunto[] = [
  {
    id: "necesidades",
    nombre: "Necesidades",
    icon: "iconoNecesidad",
    activacionId: "territorial"
  },
  {
    id: "publicidad",
    nombre: "Publicidad",
    icon: "",
    activacionId: "territorial"
  },
  {
    id: "encuestas",
    nombre: "Encuestas",
    icon: "inocoEncuesta",
    activacionId: "censos"
  },
  {
    id: "rondas",
    nombre: "Rondas",
    icon: "iconoRonda",
    activacionId: "barridos"
  }
];

export const CATEGORIAS_NECESIDADES: CategoriasNecesidades[] = [
  {
    id: "infraestructura",
    nombre: "Infraestructura",
    tipos: [
      {
        id: "baches",
        nombre: "Baches",
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
    ]
  },
  {
    id: "mantenimiento",
    nombre: "Mantenimiento",
    tipos: [
      {
        id: "basura",
        nombre: "Basura",
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

// Aqui se manda una lista de ids (lo que se va a almacenar en subcooridnadores, Proyectos, rondas, etc..) y te regresa los tipos de punto
export const getTipoPuntos = (ids: string[]) => {
  return TIPOS_PUNTO.filter(tipo => ids.includes(tipo.id));
};



