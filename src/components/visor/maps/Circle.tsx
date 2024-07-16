import { createContext, useContext, useEffect, useState } from "react";
import { mapContext } from "./Map";

interface CircleProps {
  center: { lat: number, lng: number }
  children?: React.ReactNode // Possible pop up
  fillColor?: string
  fillOpacity?: number
  radius: number
  strokeColor?: string
  strokeOpacity?: number
  strokePosition?: number
  strokeWeight?: number
}

interface CircleContext {
  circle: google.maps.Circle | null;
}

export const circleContext = createContext<CircleContext>({
  circle: null
});

export default function Circle({ center, children, fillColor, fillOpacity, radius, strokeColor, strokeOpacity, strokePosition, strokeWeight }: CircleProps) {
  const { loader, map } = useContext(mapContext);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);

  useEffect(() => {
    initCircle();
  }, [map, loader]);

  async function initCircle() {
    if (!map || !loader) return;

    const circle = await new google.maps.Circle({
      center: center,
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      radius: radius,
      strokeColor: strokeColor,
      strokeOpacity: strokeOpacity,
      strokePosition: strokePosition,
      strokeWeight: strokeWeight,
    });

    setCircle(circle);
  }

  useEffect(() => {
    if (!circle) return;

    circle.setCenter(center);
  }, [center, circle]);

  useEffect(() => {
    if (!circle) return;

    circle.setMap(map);

    return () => {
      circle.setMap(null);
    };
  }, [circle, map]);

  return (
    <circleContext.Provider value={{ circle: circle }}>
      {children}
    </circleContext.Provider>
  );
}