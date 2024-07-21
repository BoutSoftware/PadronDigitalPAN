"use client";
import { GCP_API_KEY } from "@/configs";
import { Loader } from "@googlemaps/js-api-loader";
import { createContext, useCallback, useEffect, useRef, useState } from "react";

const defaultMapCenter = { lat: 20.84651181570421, lng: -99.79102603354762 };
const defaultMapZoom = 9;

interface MapContext {
  loader: Loader | null;
  map: google.maps.Map | null;
}
interface Props {
  children: React.ReactNode,
  center?: { lat: number, lng: number },
  zoom?: number,
  className?: string
  isFieldMap?: boolean
  onClick?: (e: google.maps.MapMouseEvent) => void
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
  isFieldMap,
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

  /*
    With this code, each 3 seconds, the map focus on the current user position
    and the zoom passed in the props.

    I think we can solve this doing:

    - A map control that makes map focusing on the zoom level and user position.
      (both passed by the props)
    - To do the point above, we need to create another prop to know if the map
      is being used in field or in office.
      So... Map.isFieldMap
        TRUE: then show the control to focus user position.
        FALSE: work as it has been working
    
    I also think this will make the component less maintainable and scalable.
    So for now I think I will create another component named FieldMap that will
    only be called if we need to use a field map

    The problem using the FieldMap component is that, we will need to work in two
    components when we need to work with events for example.

    -----------------------------------------------------------------------------

    That idea wont work because circles and children components in general that maps
    recieve are waiting to consume this map context, not the field map context. This
    will increase the complexity of components.

    I will try to do the first idea of the controls by knowing if map is field map 
    or not
  */

  const initListeners = (myMap: google.maps.Map | null) => {
    if (onClick) myMap?.addListener("click", (e: google.maps.MapMouseEvent) => onClick(e));
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