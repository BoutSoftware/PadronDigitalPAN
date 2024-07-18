"use client";
import { useState } from "react";
import Map from "@/components/visor/maps/Map";
import Marker from "@/components/visor/maps/Marker";
import PopUp from "@/components/visor/maps/PopUp";

interface Point {
  lat: number
  lng: number
}

export default function GeneralMapPage() {
  const [points, setPoints] = useState<Point[]>([
    { lat: 20, lng: -100 },
    { lat: 21, lng: -101 },
    { lat: 22, lng: -102 },
    { lat: 23, lng: -103 }
  ]);

  function updatePoints(points: []) { // Se la pasará al componente de Alan
    setPoints(points);
  }

  return (
    <div className="flex flex-1 gap-8 p-8 h-full">
      <Map showPolygones className="flex flex-1 h-full">
        {
          points.map((point, index) => (
            <Marker key={index} position={point}>
              <PopUp>
                <h3>Point {index}</h3>

                <p>Description</p>
              </PopUp>
            </Marker>
          ))
        }
      </Map>

      <div className="flex flex-col">

        {/* Componente de Alan, me imagino que va a poder setear el state de points de acuerdo a los filtros */}

        <h2 className="text-center">Filtros</h2>

        <div className="flex-1 w-72 bg-zinc-200">
          Aqui van los filtros de alan
        </div>

      </div>
    </div>
  );
}