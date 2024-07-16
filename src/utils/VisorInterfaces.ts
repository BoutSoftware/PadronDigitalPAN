export interface TeamInterface {
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
        municipios: string[],
        pointTypes: string[]
    }
    TiposPunto: {
        id: string
        nombre: string
        icon: string
        estructuraId: string
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