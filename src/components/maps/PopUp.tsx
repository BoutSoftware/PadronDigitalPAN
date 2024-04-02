import React, { useContext, useEffect, useRef } from "react";
import { mapContext } from "./Map";
import { markerContext } from "./Marker";

interface PopUpProps {
  children?: React.ReactNode;
}

export default function PopUp({ children }: PopUpProps) {
  const { map, loader } = useContext(mapContext);
  const { marker } = useContext(markerContext);
  const infoWindowContentRef = useRef<HTMLDivElement>(null);

  const initPopup = async () => {
    if (!map || !loader || !marker) return;

    console.log("Initializing PopUp");

    const { InfoWindow } = await loader.importLibrary("maps");

    const infoWindow = new InfoWindow({
      content: infoWindowContentRef.current,
    });

    marker.addListener("click", () => {
      infoWindow.open({
        anchor: marker,
        map: map,
      });
    });

  };

  useEffect(() => {
    initPopup();
  }, [map, loader, marker]);

  return (
    <div ref={infoWindowContentRef}>
      {children}
    </div>
  );
}