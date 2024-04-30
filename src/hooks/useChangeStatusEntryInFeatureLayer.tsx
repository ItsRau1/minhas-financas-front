import axios from "axios";
import { useFindEntryInFeatureLayer } from "./useFindEntryInFeatureLayer";
import { HooksFeatureLayerProps } from "../@types/props";

const arcGisOnline = axios.create({
    baseURL: "https://services3.arcgis.com/cS4GcXNpyMgMVA4J/ArcGIS/rest/services/MyFinancesFeatureLayer/FeatureServer/0/updateFeatures",
})

export async function useChangeStatusEntryInFeatureLayer({ data }: HooksFeatureLayerProps) {
    if (!data) {
        return false;
    }

    const entryInFeatureLayer = await useFindEntryInFeatureLayer({ id: data.id! })

    let featureToUpdate = {
        "attributes": {
            "OBJECTID": entryInFeatureLayer.data.uniqueIds[0],
            "status": data.status,
            "updated_date": new Date(),
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