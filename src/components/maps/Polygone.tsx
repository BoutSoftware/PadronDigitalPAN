"use client";
import { createContext, useEffect, useContext, useState } from "react";
import { mapContext } from "./Map";

interface PolygoneProps {
  children?: React.ReactNode
  id: string,
  municipality: string
  coors: { lat: number, lng: number }[]
}

interface PolygoneContext {
  polygone: google.maps.Polygon | null
}

export const polygoneContext = createContext<PolygoneContext>({
  polygone: null
});

export default function Polygone({ children, id, municipality, coors }: PolygoneProps) {
  const { map, loader } = useContext(mapContext);
  const [polygone, setPolygone] = useState<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map || !loader) return;

    console.log("Do something with id and municipality");
    console.table({ id, municipality });

    const polygon = new google.maps.Polygon({
      paths: coors,
      strokeColor: "#00155E",
      strokeOpacity: 1,
      strokeWeight: 5,
      fillColor: "#00155E",
      fillOpacity: 0.40,
      clickable: true
    });
    polygon.setMap(map);
    setPolygone(polygon);

  }, [map, loader]);

  return (
    <polygoneContext.Provider value={{ polygone }}>
      {children}
    </polygoneContext.Provider>
  );
}
