import axios from "axios";
import { useFindEntryInFeatureLayer } from "./useFindEntryInFeatureLayer";

const arcGisOnline = axios.create({
    baseURL: "https://services3.arcgis.com/cS4GcXNpyMgMVA4J/ArcGIS/rest/services/MyFinancesFeatureLayer/FeatureServer/0/deleteFeatures"
})

export async function useDeleteEntryInFeatureLayer(id: number) {
    const entryInFeatureLayer = await useFindEntryInFeatureLayer({ id })

    let params = {
        f: "json",
        objectIds: entryInFeatureLayer.data.uniqueIds[0],
        rollbackOnFailure: true
    }

    let options = {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
    };

    arcGisOnline.post("", params, options);
}