"use client";

import Map from "@/components/maps/Map";
import Marker from "@/components/maps/Marker";
import PopUp from "@/components/maps/PopUp";
import { Spacer } from "@nextui-org/react";

const Estados = [
  {
    name: "Queretaro",
    position: { lat: 20.69661181570421, lng: -99.69102603354762 },
  },
  {
    name: "Guanajuato",
    position: { lat: 21.018073, lng: -101.257358 },
  },
  {
    name: "San Luis Potosi",
    position: { lat: 22.156469, lng: -100.985540 },
  },
  {
    name: "Hidalgo",
    position: { lat: 20.479879, lng: -98.882404 },
  },
  {
    name: "Michoacan",
    position: { lat: 19.700781, lng: -101.184418 },
  },
];

export default function MapsExperimentPage() {

  return (
    <main className="p-4 h-full flex flex-col flex-1">
      <h1 className="text-2xl font-semibold">Maps Experiment</h1>

      <Spacer y={2} />

      <Map className="flex flex-1">
        {Estados.map((estado, index) => (
          <Marker
            key={index}
            position={estado.position}
            title={estado.name}
            image={{
              src: "https://map-visor.vercel.app/api/figures?figure=circulo&color=000",
              width: 30,
            }}
          >
            <PopUp>
              <h3 className="text-lg font-semibold">{estado.name}</h3>
              <p>Estado de {estado.name}</p>
            </PopUp>
          </Marker>
        ))}
      </Map>
    </main>
  );
}