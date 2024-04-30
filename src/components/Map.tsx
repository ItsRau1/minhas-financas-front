import { useContext, useEffect } from "react";
import { useRenderMap } from "../hooks/useRenderMap";
import { MapComponentProps } from "../@types/props";
import { AuthContext } from "../contexts/auth";
import { ContextType } from "../@types/types";

export function Map({ eventOnClick, latitude, longitude }: MapComponentProps) {
    const { filtersMap, userAuthenticated } = useContext(AuthContext) as ContextType;
    const ID_MAP_VIEW = "viewDiv"

    useEffect(() => {
        useRenderMap(ID_MAP_VIEW, eventOnClick, filtersMap!, String(userAuthenticated!.id), latitude, longitude)
    }, [])

    return (
        <div id={ID_MAP_VIEW} style={{ width: "100%", height: "100%" }}>
        </div>
    )
}