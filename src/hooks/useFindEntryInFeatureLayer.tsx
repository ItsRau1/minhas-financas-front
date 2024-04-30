import axios from "axios";
import { UseFindEntryInFeatureLayerProps } from "../@types/props";

const arcGisOnline = axios.create({
    baseURL: "https://services3.arcgis.com/cS4GcXNpyMgMVA4J/ArcGIS/rest/services/MyFinancesFeatureLayer/FeatureServer/0/query"
})

export async function useFindEntryInFeatureLayer({ id }: UseFindEntryInFeatureLayerProps) {
    let params = `where=entry_id%3D${id}&f=json&returnUniqueIdsOnly=true`
    return await arcGisOnline.get("?" + params);
}