import React, { useContext, useEffect, useRef } from "react";
import { mapContext } from "./Map";
import { markerContext } from "./Marker";
// import { polygoneContext } from "./Polygone";

interface PopUpProps {
  children?: React.ReactNode;
}

export default function PopUp({ children }: PopUpProps) {
  const { map, loader } = useContext(mapContext);
  const { marker } = useContext(markerContext);
  // const { polygone } = useContext(polygoneContext);
  const infoWindowContentRef = useRef<HTMLDivElement>(null);

  const drawPopUpOfMarker = (infoWindow: google.maps.InfoWindow) => {
    marker!.addListener("click", () => {
      infoWindow.open({
        anchor: marker,
        map: map,
      });
    });
  };

  const drawPopUpOfPolygone = (infoWindow: google.maps.InfoWindow) => {
    console.log("Draw pop up of polygone");

    // polygone!.addListener("click", () => {
    //   console.log("Click en poligono");

    //   infoWindow.open({
    //     anchor: polygone,
    //     map: map,
    //   });
    // });
  };

  const initPopup = async () => {
    if (!map || !loader || !marker) return;

    const { InfoWindow } = await loader.importLibrary("maps");
    const infoWindow = new InfoWindow({
      content: infoWindowContentRef.current,
    });

    if (marker) drawPopUpOfMarker(infoWindow);
    console.log("No hay marker");
    // console.log(polygone);


    // if (polygone) drawPopUpOfPolygone(infoWindow);

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