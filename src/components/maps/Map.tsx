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
      //console.log("Initializing Map");

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
        streetViewControl: false,
      });

      const flightPlanCoordinates = [
        { lat: 20.69661181570421, lng: -99.69102603354762 },
        { lat: 21.018073, lng: -101.257358 },
        { lat: 22.156469, lng: -100.985540 },
        { lat: 20.479879, lng: -98.882404 },
        { lat: 19.700781, lng: -101.184418 }
      ];
      const flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: "#f31260",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        editable: true,
        draggable: true
      });

      flightPath.setMap(myMap);

      // Define the LatLng coordinates for the polygon's path.
      const triangleCoords = [
        { lat: 25.774, lng: -80.19 },
        { lat: 18.466, lng: -66.118 },
        { lat: 32.321, lng: -64.757 },
        { lat: 25.774, lng: -80.19 },
      ];

      // GeoJsonQro.features.map((municipioInfo) => {
      //   console.log(municipioInfo.properties.Name2);
      // });
      // console.log(QroCoords);

      // const municipalityCoords = GeoJsonQro.features[17].geometry.coordinates.map(coor => ({ lat: coor[1], lng: coor[0] }));

      // const AmealcoPolygon = new google.maps.Polygon({
      //   paths: municipalityCoords,
      //   strokeColor: "#00155E",
      //   strokeOpacity: 0.8,
      //   strokeWeight: 5,
      //   fillColor: "#00155E",
      //   fillOpacity: 0.20
      // });
      //AmealcoPolygon.setMap(myMap);
      // Construct the polygon.
      const bermudaTriangle = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      });

      bermudaTriangle.setMap(myMap);


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