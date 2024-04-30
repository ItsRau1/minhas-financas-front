import WebMap from "@arcgis/core/WebMap";
import Config from "@arcgis/core/config";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Search from "@arcgis/core/widgets/Search";
import { whenOnce } from "@arcgis/core/core/reactiveUtils";
import { FilterMapType, PointType } from "../@types/types";
import { ShowError } from "../components/Toastr";
import "@arcgis/core/assets/esri/themes/light/main.css";

Config.portalUrl = "https://muralis.maps.arcgis.com/";

export function useRenderMap(rootElement: any, eventOnClick: ((lat: string, long: string) => void) | undefined, filters: FilterMapType, idUser: string, lat: string | null | undefined, long: string | null | undefined) {
    const map = new WebMap({
        portalItem: {
            id: "5a1678f19cfc4c178af0d63a090b1159"
        }
    });

    const view = new MapView({
        map: map,
        center: [-50.194481, -15.055825],
        zoom: 4
    });

    const scalebar = new ScaleBar({
        view: view
    });

    view.ui.add(scalebar, "bottom-left");

    const search = new Search({
        view: view
    })

    view.ui.add(search, "top-right")

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    const insertPoint = (point: __esri.Point | PointType | any) => {
        const symbol = {
            type: "simple-marker",
            color: "#FED601",
            size: 5
        }
        const pointGraphic = new Graphic({
            geometry: point,
            symbol: symbol
        });
        return graphicsLayer.add(pointGraphic);
    }

    view.container = rootElement;
    graphicsLayer.removeAll();

    view.on("click", function (event) {
        view.hitTest(event).then(function (response) {
            if (response.results) {
                if (eventOnClick) {
                    graphicsLayer.removeAll()
                    eventOnClick(String(event.mapPoint.latitude), String(event.mapPoint.longitude))
                    insertPoint(event.mapPoint)
                }
            }
        })
    })

    whenOnce(() => view.ready).then(() => {
        // @ts-ignore
        const MyFinancesFeatureLayer = map.layers.items[1];

        if (!eventOnClick) {
            graphicsLayer.removeAll();
        } else {
            MyFinancesFeatureLayer.visible = false
        }

        if (lat && long) {
            insertPoint({
                type: "point",
                latitude: Number(lat),
                longitude: Number(long),
            })
        }

        let query = "user_ = " + idUser

        if (filters.year) {
            query = query + " AND year = " + filters.year
        }
        if (filters.month) {
            query = query + " AND month = " + filters.month
        }
        if (filters.description) {
            query = query + " AND description LIKE '%" + filters.description + "%'"
        }
        if (filters.type) {
            query = query + " AND type = " + filters.type
        }
        if (filters.category) {
            query = query + " AND category LIKE '%" + filters.category + "%'"
        }

        MyFinancesFeatureLayer.definitionExpression = query
    }).catch(e => {
        ShowError(`Erro ao carregar o mapa. </br> Motivo: ${e}`)
    })
}