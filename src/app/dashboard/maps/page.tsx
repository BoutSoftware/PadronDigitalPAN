"use client";

import Map from "@/components/maps/Map";
import Marker from "@/components/maps/Marker";
import { GCP_API_KEY } from "@/configs";
import { ThemeContext } from "@/contexts/ThemeProvider";
import { Loader } from "@googlemaps/js-api-loader";
import { Spacer } from "@nextui-org/react";
import { useContext, useEffect, useRef, useState } from "react";

export default function MapsExperimentPage() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { theme } = useContext(ThemeContext);
  const infoWindowContentRef = useRef<HTMLDivElement>(null);

  const SetupMap = async () => {
    const loader = new Loader({
      apiKey: GCP_API_KEY,
      version: "weekly",
    });

    const { Map, InfoWindow } = await loader.importLibrary("maps");
    const { AdvancedMarkerElement, } = await loader.importLibrary("marker");

    const myMap = new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
      mapId: "mainMap",
    });

    const markerImage = document.createElement("img");
    markerImage.src = "https://map-visor.vercel.app/api/figures?figure=cuadrado&color=f00";
    markerImage.width = 15;


    const marker = new AdvancedMarkerElement({
      position: { lat: -34.397, lng: 150.644 },
      map: myMap,
      title: "Hello World!",
      content: markerImage,
    });

    const infoWindow = new InfoWindow({
      content: infoWindowContentRef.current,
    });

    marker.addListener("click", () => {
      infoWindow.open({
        anchor: marker,
        map: myMap,
      });
    });
  };

  useEffect(() => {
    // if (!window) return;

    // SetupMap();
  }, []);

  return (
    <main className="p-4 h-full flex flex-col flex-1">
      <h1 className="text-2xl font-semibold">Maps Experiment</h1>

      <Spacer y={2} />

      <Map className="flex flex-1">
        <div>Some children here</div>
        <Marker
          position={{ lat: 20.89661181570421, lng: -99.79102603354762 }}
          title="Queretaro"
          image={{
            src: "https://map-visor.vercel.app/api/figures?figure=cuadrado&color=000",
            width: 15,
          }}
        />
      </Map>
    </main>
  );
}