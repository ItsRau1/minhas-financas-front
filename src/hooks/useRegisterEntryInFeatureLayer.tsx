import axios from "axios";
import { HooksFeatureLayerProps } from "../@types/props";
import { useFormatCategoriesToList } from "./useFormatCategoriesToList";
import { EntryFeatureLayerDto } from "../@types/types";

const arcGisOnline = axios.create({
    baseURL: "https://services3.arcgis.com/cS4GcXNpyMgMVA4J/ArcGIS/rest/services/MyFinancesFeatureLayer/FeatureServer/0/addFeatures"
})

export function useRegisterEntryInFeatureLayer({ data }: HooksFeatureLayerProps) {
    if (!data) {
        return false;
    }

    let categories = useFormatCategoriesToList(data.categoria)

    let featureToAdd: EntryFeatureLayerDto = {
        "geometry": {
            "x": data.longitude,
            "y": data.latitude
        },
        "attributes": {
            "entry_id": data.id!,
            "description": data.descricao,
            "month": data.mes,
            "year": data.ano,
            "user_": data.usuario.id,
            "value": data.valor,
            "registration_date": new Date(),
            "type": data.tipo,
            "status": data.status!,
            "category": categories
        }
    };

    let params = {
        f: "json",
        features: JSON.stringify(featureToAdd),
        rollbackOnFailure: true
    }

    let options = {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
    };

    arcGisOnline.post("", params, options);
}