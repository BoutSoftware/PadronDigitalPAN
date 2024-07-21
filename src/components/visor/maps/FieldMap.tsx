"use client";
import { GCP_API_KEY } from "@/configs";
import { Loader } from "@googlemaps/js-api-loader";
import { createContext, useEffect, useRef, useState } from "react";

const defaultMapCenter = { lat: 20.84651181570421, lng: -99.79102603354762 };
const defaultMapZoom = 9;

interface FieldMapContext {
  loader: Loader | null;
  map: google.maps.Map | null;
}
interface Props {
  children: React.ReactNode,
  center?: { lat: number, lng: number },
  zoom?: number,
  className?: string
  onClick?: (e: google.maps.MapMouseEvent) => void
}

export const fieldMapContext = createContext<FieldMapContext>({
  loader: null,
  map: null,
});

export function FieldMap({
  children,
  center = defaultMapCenter,
  zoom = defaultMapZoom,
  className,
  onClick
}: Props) {

  const mapRef = useRef<HTMLDivElement>(null);
  const [loader, setLoader] = useState<Loader | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

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

  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    if (!map) return;

    map?.setCenter(center);
    map?.setZoom(zoom);
  }, [center, zoom, map]);

  const initListeners = (myMap: google.maps.Map | null) => {
    if (onClick) myMap?.addListener("click", (e: google.maps.MapMouseEvent) => onClick(e));
  };

  return (
    <>
      <div id="map" className={className} ref={mapRef} />

      <div hidden>
        <fieldMapContext.Provider value={{ loader: loader, map: map }}>
          {children}
        </fieldMapContext.Provider>
      </div>
    </>
  );
}