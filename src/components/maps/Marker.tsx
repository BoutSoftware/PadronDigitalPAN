import { createContext, useContext, useEffect, useState } from "react";
import { mapContext } from "./Map";

interface MarkerProps {
  children?: React.ReactNode;
  position: { lat: number; lng: number };
  title?: string;
  image?: { src: string; width: number };
}

interface MarkerContext {
  marker: google.maps.marker.AdvancedMarkerElement | null;
}

export const markerContext = createContext<MarkerContext>({
  marker: null,
});

export default function Marker({ children, position, title, image }: MarkerProps) {
  const { map, loader } = useContext(mapContext);
  const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const getMarkerImage = () => {
    if (!image) return;

    const markerImageElement = document.createElement("img");
    markerImageElement.src = image.src;
    markerImageElement.width = image.width;

    return markerImageElement;
  };

  const initMarker = async () => {
    if (!map || !loader) return;

    console.log(`Initializing Marker "${title}"`);

    const { AdvancedMarkerElement } = await loader.importLibrary("marker");

    const marker = new AdvancedMarkerElement({
      position: position,
      map: map,
      title: title,
      content: getMarkerImage(),
    });

    setMarker(marker);
  };

  useEffect(() => {
    initMarker();
  }, [map, loader]);

  useEffect(() => {
    if (!marker) return;

    marker.position = position;
    marker.title = title || "";
    marker.content = getMarkerImage();
  }, [position, title, image, marker]);

  return (
    <markerContext.Provider value={{ marker: marker }}>
      {children}
    </markerContext.Provider>
  );
}