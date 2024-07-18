"use client";
import { GCP_API_KEY } from "@/configs";
import { Loader } from "@googlemaps/js-api-loader";
import { createContext, useEffect, useRef, useState } from "react";

const defaultMapCenter = { lat: 20.84651181570421, lng: -99.79102603354762 };
const defaultMapZoom = 9;

const figures1Paths = [
  // This could be electoral sections
  // And need to be an array of arrays with the following data structure
  { "lat": 37.7749, "lng": -122.4194 },
  { "lat": 37.7849, "lng": -122.4094 },
  { "lat": 37.7749, "lng": -122.3994 }
];
const figures2Paths = [
  // This could be electoral sections
  // And need to be an array of arrays with the following data structure
  { "lat": 37.7749, "lng": -122.4294 },
  { "lat": 37.7749, "lng": -122.4194 },
  { "lat": 37.7649, "lng": -122.4194 },
  { "lat": 37.7649, "lng": -122.4294 }
];
const figures3Paths = [
  // This could be electoral sections
  // And need to be an array of arrays with the following data structure
  { "lat": 37.7849, "lng": -122.4194 },
  { "lat": 37.7949, "lng": -122.4094 },
  { "lat": 37.7949, "lng": -122.3994 },
  { "lat": 37.7849, "lng": -122.3894 },
  { "lat": 37.7749, "lng": -122.3994 }
];
const polygonOptions = { // This must be the deseable style of the polygons
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35
};
interface MapContext {
  loader: Loader | null;
  map: google.maps.Map | null;
}
interface Props {
  children: React.ReactNode,
  center?: { lat: number, lng: number },
  zoom?: number,
  className?: string
  onClick?: (e: google.maps.MapMouseEvent) => void
  showPolygones: boolean
}

export const mapContext = createContext<MapContext>({
  loader: null,
  map: null,
});

export default function Map({
  children,
  center = defaultMapCenter,
  zoom = defaultMapZoom,
  className,
  onClick,
  showPolygones
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loader, setLoader] = useState<Loader | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // !Tried to do this. Failed because loader had not been loaded yet
  // const figures1 = new google.maps.Polygon({ paths: figures1Paths, ...polygonOptions });
  // const figures2 = new google.maps.Polygon({ paths: figures2Paths, ...polygonOptions });
  // const figures3 = new google.maps.Polygon({ paths: figures3Paths, ...polygonOptions });
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: GCP_API_KEY,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const myMap = new Map(mapRef.current as HTMLElement, {
        center: center,
        zoom: zoom,
        mapId: "mainMap",
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false
      });

      initListeners(myMap);
      setLoader(loader);
      setMap(myMap);
    };

    initMap();
  }, [center, zoom]);

  useEffect(() => {
    // consider do this with useMemo
    if (!showPolygones) return;
    if (!map) return;

    const figures1 = new google.maps.Polygon({ paths: figures1Paths, ...polygonOptions }); // This need to be google.maps.Polygon[]
    const figures2 = new google.maps.Polygon({ paths: figures2Paths, ...polygonOptions }); // This need to be google.maps.Polygon[]
    const figures3 = new google.maps.Polygon({ paths: figures3Paths, ...polygonOptions }); // This need to be google.maps.Polygon[]

    const polygonsListener = map.addListener("zoom_changed", () => {
      drawPolygones(figures1, figures2, figures3);
    });

    return () => {
      console.log("Removing listeners...");
      google.maps.event.removeListener(polygonsListener);
      figures1.setMap(null); // This need to map google.maps.Polygon[] and do figure => figure.setMap(null)
      figures2.setMap(null); // This need to map google.maps.Polygon[] and do figure => figure.setMap(null)
      figures3.setMap(null); // This need to map google.maps.Polygon[] and do figure => figure.setMap(null)
    };

  }, [showPolygones, map]);

  const initListeners = (myMap: google.maps.Map | null) => {
    if (onClick) myMap?.addListener("click", (e: google.maps.MapMouseEvent) => onClick(e));
  };

  const drawPolygones = (figures1: google.maps.Polygon, figures2: google.maps.Polygon, figures3: google.maps.Polygon) => {
    const currentZoom = map!.getZoom();

    if (!currentZoom) return;

    if (currentZoom >= 8 && currentZoom < 12) {
      figures1.setMap(map);
      figures2.setMap(null);
      figures3.setMap(null);
    }

    if (currentZoom >= 12 && currentZoom < 15) {
      figures1.setMap(null);
      figures2.setMap(map);
      figures3.setMap(null);
    }

    if (currentZoom >= 15 && currentZoom < 18) {
      figures1.setMap(null);
      figures2.setMap(null);
      figures3.setMap(map);
    }
  };
  return (
    <>
      <div id="map" className={className} ref={mapRef} />

      <div hidden>
        <mapContext.Provider value={{ loader: loader, map: map }}>
          {children}
        </mapContext.Provider>
      </div>
    </>
  );
}