"use client";
import { useState } from "react";
import Map from "@/components/visor/maps/Map";
import Marker from "@/components/visor/maps/Marker";
import PopUp from "@/components/visor/maps/PopUp";
import Header from "@/components/Header";

interface Points {
  structure: string
  type: string
  image: string
  pointsCoordinates: {
    lat: number
    lng: number
  }[]
}

export default function GeneralMapPage() {
  const [points, setPoints] = useState<Points[]>([
    {
      structure: "Política",
      type: "Tipo de punto A",
      image: "",
      pointsCoordinates: [{ lat: 20, lng: -100 }, { lat: 21, lng: -101 }, { lat: 22, lng: -102 }, { lat: 23, lng: -103 }]
    },
    {
      structure: "Política",
      type: "Tipo de punto B",
      image: "",
      pointsCoordinates: [{ lat: 20.5, lng: -100.5 }, { lat: 21.5, lng: -101.5 }, { lat: 22.5, lng: -102.5 }, { lat: 23.5, lng: -103.5 }]
    },
    {
      structure: "Gubernamental",
      type: "Tipo de punto C",
      image: "",
      pointsCoordinates: [{ lat: 21, lng: -101 }, { lat: 22, lng: -102 }, { lat: 23, lng: -103 }, { lat: 24, lng: -104 }]
    },
    {
      structure: "Gubernamental",
      type: "Tipo de punto D",
      image: "",
      pointsCoordinates: [{ lat: 21.5, lng: -101.5 }, { lat: 22.5, lng: -102.5 }, { lat: 23.5, lng: -103.5 }, { lat: 24.5, lng: -104.5 }]
    }
  ]);

  function updatePoints(points: []) { // Se la pasará al componente de Alan
    setPoints(points);
  }

  return (
    <div className="flex flex-col flex-1 p-8 gap-4">
      <Header title="Mapa general" />
      <div className="flex w-full gap-8 h-full">
        <Map showPolygones className="flex flex-1 h-full">
          {
            points.map(({ image, pointsCoordinates, structure, type }) => (
              pointsCoordinates.map((p, i) => (
                // When image exist, pass it to marker
                <Marker key={i} position={p}>
                  <PopUp>
                    {/* 
                    Pop up will be a simple component
                    YES: "How do we do the logic for all points?"
                    NO: "How do we do the logic for dynamic pop ups?" 
                  */}
                    <h3 className="font-bold">{structure} | &quot;{type}&quot;</h3>
                    <p>Punto:{i + 1}</p>
                  </PopUp>
                </Marker>
              ))
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
    </div>
  );
}