
export interface TiposPunto {
  id: string,
  nombre: string,
  icon: string,
  estructuraId: typeof ESTRUCTURAS[number]["id"],
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

export interface Titulos {
  id: string,
  nombre: string
}

export const ESTRUCTURAS = [
  {
    id: "territorial",
    nombre: "Territorial",
  },
  {
    id: "politica",
    nombre: "Politica",
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
    id: "colonias",
    nombre: "Colonia/Localidad"
  },
] as const;

export const STATUS_RONDAS = [
  {
    id: "activa",
    nombre: "ACTIVA",
    color: "verde",
    mensaje: "Ronda activa"
  },
  {
    id: "pausada",
    nombre: "PAUSADA",
    color: "amarilla",
    mensaje: "Ronda pausada"
  },
  {
    id: "terminada",
    nombre: "TERMINADA",
    color: "roja",
    mensaje: "Ronda terminada"
  },
  {
    id: "noiniciada",
    nombre: "NO INICIADA",
    color: "blanco",
    mensaje: "Ronda no iniciada"
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
    id: "publicidad",
    nombre: "Publicidad",
    icon: "",
    estructuraId: "territorial"
  },
  {
    id: "encuestas",
    nombre: "Encuestas",
    icon: "inocoEncuesta",
    estructuraId: "politica"
  },
  {
    id: "rondas",
    nombre: "Rondas",
    icon: "iconoRonda",
    estructuraId: "gobierno"
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

export const TITULOS = [
  {
    id: "admin",
    nombre: "Administrador"
  },
  {
    id: "coordinador",
    nombre: "Coordinador de estructura",
  },
  {
    id: "tecCoordinador",
    nombre: "Técnico de coordinador"
  },
  {
    id: "adjCoordinador",
    nombre: "Adjunto de coordinador"
  },
  {
    id: "subcoordinador",
    nombre: "Subcoordinador de estructura",
  },
  {
    id: "tecSubcoordinador",
    nombre: "Técnico de subcoordinador"
  },
  {
    id: "auxiliar",
    nombre: "Auxiliar de estructura"
  },
  {
    id: "tecAuxiliar",
    nombre: "Técnico de auxiliar"
  },
  {
    id: "enlace",
    nombre: "Enlace de equipo",
  },
  {
    id: "caminante",
    nombre: "Caminate",
  }
] as const;

// Aqui se manda una lista de ids (lo que se va a almacenar en subcooridnadores, equipos, rondas, etc..) y te regresa los tipos de punto
export const getTipoPuntos = (ids: string[]) => {
  return TIPOS_PUNTO.filter(tipo => ids.includes(tipo.id));
};

export const getTitulo = (id: string) => {
  return TITULOS.find(titulo => titulo.id === id);
};




