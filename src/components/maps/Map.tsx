"use client";

import { GCP_API_KEY } from "@/configs";
import { Loader } from "@googlemaps/js-api-loader";
import { createContext, useEffect, useRef, useState } from "react";

const defaultMapCenter = { lat: 20.84651181570421, lng: -99.79102603354762 };
const defaultMapZoom = 9;

interface MapContext {
  loader: Loader | null;
  map: google.maps.Map | null;
}
export const mapContext = createContext<MapContext>({
  loader: null,
  map: null,
});

export default function Map({ children, center = defaultMapCenter, zoom = defaultMapZoom, className }: { children: React.ReactNode, center?: { lat: number, lng: number }, zoom?: number, className?: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loader, setLoader] = useState<Loader | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = async () => {
      console.log("Initializing Map");

      const loader = new Loader({
        apiKey: GCP_API_KEY,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const myMap = new Map(mapRef.current as HTMLElement, {
        center: center,
        zoom: zoom,
        mapId: "mainMap",
      });

      setLoader(loader);
      setMap(myMap);
    };

    initMap();
  }, [center, zoom]);

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