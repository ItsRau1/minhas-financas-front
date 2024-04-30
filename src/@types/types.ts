export type CredentialsType = {
    email: string,
    senha: string
}

export type UserType = {
    id?: number,
    name?: string,
    email: string,
    password: string,
    passwordRepeat?: string
}

export type UserDtoType = {
    id?: number,
    nome: string,
    email: string,
    senha: string
}

export type UserAuthenticatedType = {
    id: number,
    nome: string
}

export type EntryType = {
    id?: number,
    description?: string,
    type?: string,
    status?: string,
    value?: number,
    month?: string,
    year?: string,
    user?: number,
    category: SelectType[];
    latitude?: string,
    longitude?: string,
    format?: string
}

export type EntryDtoType = {
    id?: number,
    descricao: string,
    mes: number,
    ano: number,
    usuario: UserAuthenticatedType,
    valor: number,
    dataCadastro: string,
    tipo: string,
    status?: string,
    categoria: CategoryDtoType[],
    latitude: string,
    longitude: string
}

export type SelectType = {
    label: string,
    value: string | number
}

export type TokenDtoType = {
    nome: string,
    token: string
}

export type ContextType = {
    endSession?: () => void;
    initSession?: (tokenDto: TokenDtoType) => void,
    userAuthenticated?: UserAuthenticatedType | null,
    isAuthenticated?: boolean,
    isLoading?: boolean,
    changeTheme?: () => void,
    filtersMap?: FilterMapType,
    setFiltersMap?: (filters: FilterMapType) => void
}

export type CategoryDtoType = {
    id: number,
    descricao: string,
    ativo: boolean
}

export type SelectInputData = {
    label: string,
    value: number
}

export type EnvType = {
    BASE_URL: string
}

export type FilterMapType = {
    idUser?: string,
    description?: string,
    month?: string,
    year?: string,
    type?: string,
    category?: string
}

export type FindEntryType = {
    description?: string,
    type?: string,
    month?: string,
    year?: string,
    user?: number,
    category: number,
    format?: string
}

export type ResponseFindEntryInFeatureLayerType = {
    data: {
        uniqueIds: number[]
    }
}

export type EntryFeatureLayerDto = {
    "geometry": {
        "x": string | number,
        "y": string | number
    },
    "attributes": {
        "entry_id": number,
        "description": string,
        "month": number,
        "year": number,
        "user_": number,
        "value": number,
        "registration_date": Date,
        "type": string,
        "status": string,
        "category": string
    }
}

export type PointType = {
    type: string,
    latitude: number,
    longitude: number
}