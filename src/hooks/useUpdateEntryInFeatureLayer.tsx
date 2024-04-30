import axios from "axios";
import { HooksFeatureLayerProps } from "../@types/props";
import { useFindEntryInFeatureLayer } from "./useFindEntryInFeatureLayer";
import { useFormatCategoriesToList } from "./useFormatCategoriesToList";

const arcGisOnline = axios.create({
    baseURL: "https://services3.arcgis.com/cS4GcXNpyMgMVA4J/ArcGIS/rest/services/MyFinancesFeatureLayer/FeatureServer/0/updateFeatures",
})

export async function useUpdateEntryInFeatureLayer({ data }: HooksFeatureLayerProps) {
    if (!data) {
        return false;
    }

    const entryInFeatureLayer = await useFindEntryInFeatureLayer({ id: data.id! })

    let categories = useFormatCategoriesToList(data.categoria)

    let featureToUpdate = {
        "geometry": {
            "x": data.longitude,
            "y": data.latitude
        },
        "attributes": {
            "OBJECTID": entryInFeatureLayer.data.uniqueIds[0],
            "description": data.descricao,
            "month": data.mes,
            "year": data.ano,
            "value": data.valor,
            "type": data.tipo,
            "category": categories,
            "updated_date": new Date()
        }
    };

    let params = {
        f: "json",
        features: JSON.stringify(featureToUpdate),
        rollbackOnFailure: true
    }

    let options = {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
    };

    arcGisOnline.post("", params, options);
}