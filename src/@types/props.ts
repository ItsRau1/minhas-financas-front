import { ReactNode } from "react";
import { EntryDtoType, SelectType } from "./types";

export interface EntryTableProps {
    entries: EntryDtoType[],
    changeStatus: (entry: EntryDtoType, status: string) => void;
    editAction: (entry: EntryDtoType) => void,
    deleteAction: (entry: EntryDtoType) => void
}

export interface SelectMenuProps {
    id: string,
    list: SelectType[],
    value: string,
    onChange: (e: any) => void,
    className: string,
    disabled?: boolean
}

export interface AuthContextProps {
    children?: ReactNode
}

export interface NavBarItemProps {
    to: string,
    title: string,
    label: string,
    onClick?: (e: any) => void
}

export interface FormGroupProps {
    label: string,
    htmlFor: string,
    children: ReactNode
}

export interface CardProps {
    title: string,
    children: ReactNode
}

export interface ChipComponentProps {
    description: string,
    id: number
}

export interface ChipsProps {
    label: string,
    list: SelectType[],
    onCloseChip: (item: SelectType) => void
}

export interface MapComponentProps {
    eventOnClick?: ((lat: string, long: string) => void) | undefined,
    latitude?: string | null,
    longitude?: string | null
}

export interface HooksFeatureLayerProps {
    data: EntryDtoType
}

export interface HookMassiveRegisterInFeatureLayerProps {
    data: {
        lancamentosRegistrados: EntryDtoType[],
        totalDeLinhasProcessadas: number,
        totalDeErros: number,
        totalDeSucessos: number
    }
}

export interface UseFindEntryInFeatureLayerProps {
    id: number
}