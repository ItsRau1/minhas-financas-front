import axios from "axios";
import { HookMassiveRegisterInFeatureLayerProps } from "../@types/props";
import { EntryFeatureLayerDto } from "../@types/types";
import { useFormatCategoriesToList } from "./useFormatCategoriesToList";

const arcGisOnline = axios.create({
    baseURL: "https://services3.arcgis.com/cS4GcXNpyMgMVA4J/ArcGIS/rest/services/MyFinancesFeatureLayer/FeatureServer/0/addFeatures"
})

export async function useMassiveRegisterEntriesInFeatureLayer({ data }: HookMassiveRegisterInFeatureLayerProps) {
    if (!data) {
        return false;
    }

    let featuresToAdd: EntryFeatureLayerDto[] = [];

    for (let i = 0; i < data.lancamentosRegistrados.length; i++) {
        let categories = useFormatCategoriesToList(data.lancamentosRegistrados[i].categoria);

        let featureToAdd = {
            "geometry": {
                "x": data.lancamentosRegistrados[i].longitude,
                "y": data.lancamentosRegistrados[i].latitude
            },
            "attributes": {
                "entry_id": data.lancamentosRegistrados[i].id!,
                "description": data.lancamentosRegistrados[i].descricao,
                "month": data.lancamentosRegistrados[i].mes,
                "year": data.lancamentosRegistrados[i].ano,
                "user_": data.lancamentosRegistrados[i].usuario.id,
                "value": data.lancamentosRegistrados[i].valor,
                "registration_date": new Date(),
                "type": data.lancamentosRegistrados[i].tipo,
                "status": data.lancamentosRegistrados[i].status!,
                "category": categories
            }
        };

        featuresToAdd.push(featureToAdd);
    }

    let params = {
        f: "json",
        features: JSON.stringify(featuresToAdd),
        rollbackOnFailure: true
    }

    let options = {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
    };

    await arcGisOnline.post("", params, options);
}