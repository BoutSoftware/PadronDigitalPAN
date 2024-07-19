"use client";
import { GCP_API_KEY } from "@/configs";
import { Loader } from "@googlemaps/js-api-loader";
import { createContext, useEffect, useRef, useState } from "react";

const defaultMapCenter = { lat: 20.84651181570421, lng: -99.79102603354762 };
const defaultMapZoom = 9;

const figures1Paths: latLng[][] = [ // This could be all the sections
  [
    { "lat": 20.629196, "lng": -100.450957 },
    { "lat": 20.588866, "lng": -100.444600 },
    { "lat": 20.611346, "lng": -100.405750 }
  ],
  [
    { "lat": 20.627213, "lng": -100.368313 },
    { "lat": 20.594817, "lng": -100.349948 },
    { "lat": 20.607380, "lng": -100.301209 }
  ],
  [
    { "lat": 20.710486, "lng": -100.378202 },
    { "lat": 20.706521, "lng": -100.320281 },
    { "lat": 20.676786, "lng": -100.348535 }
  ]
];


const figures2Paths: latLng[][] = [ // This could be all the local districts
  [
    { "lat": 20.652412, "lng": -100.389106 },
    { "lat": 20.635589, "lng": -100.362217 },
    { "lat": 20.601271, "lng": -100.389485 }
  ],
  [
    { "lat": 20.667234, "lng": -100.353627 },
    { "lat": 20.651109, "lng": -100.335341 },
    { "lat": 20.620590, "lng": -100.367672 }
  ],
  [
    { "lat": 20.676791, "lng": -100.317848 },
    { "lat": 20.660768, "lng": -100.302926 },
    { "lat": 20.639812, "lng": -100.328597 }
  ]
];

const figures3Paths: latLng[][] = [ // This could be all the local federal districts
  [
    { "lat": 20.630000, "lng": -100.360000 },
    { "lat": 20.632000, "lng": -100.362000 },
    { "lat": 20.628000, "lng": -100.362000 }
  ],
  [
    { "lat": 20.632000, "lng": -100.362000 },
    { "lat": 20.634000, "lng": -100.364000 },
    { "lat": 20.630000, "lng": -100.364000 }
  ],
  [
    { "lat": 20.634000, "lng": -100.364000 },
    { "lat": 20.636000, "lng": -100.366000 },
    { "lat": 20.632000, "lng": -100.366000 }
  ]
];

const polygonOptions = { // This must be the deseable style of the polygons
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35
};
interface latLng {
  lat: number
  lng: number
}
interface MapContext {
  loader: Loader | null;
  map: google.maps.Map | null;
}
interface Props {
  children: React.ReactNode,
  center?: { lat: number, lng: number },
  zoom?: number,
  className?: string
  onClick?: (e: google.maps.MapMouseEvent) => void
  showPolygones: boolean
}

export const mapContext = createContext<MapContext>({
  loader: null,
  map: null,
});

export default function Map({
  children,
  center = defaultMapCenter,
  zoom = defaultMapZoom,
  className,
  onClick,
  // showPolygones
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [showPolygones, setShowPolygones] = useState(false);
  const [loader, setLoader] = useState<Loader | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // !Tried to do this. Failed because loader had not been loaded yet
  // const figures1 = new google.maps.Polygon({ paths: figures1Paths, ...polygonOptions });
  // const figures2 = new google.maps.Polygon({ paths: figures2Paths, ...polygonOptions });
  // const figures3 = new google.maps.Polygon({ paths: figures3Paths, ...polygonOptions });
  useEffect(() => {
    const initMap = async () => {
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
        mapTypeControl: true,
        streetViewControl: false,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
      });
      initControls(myMap);
      initListeners(myMap);
      setLoader(loader);
      setMap(myMap);
    };

    initMap();
  }, [center, zoom]);

  useEffect(() => {
    console.log(showPolygones);
    if (!showPolygones) return;
    if (!map) return;

    const figures1 = figures1Paths.map(figure1path => new google.maps.Polygon({ paths: figure1path, ...polygonOptions }));
    const figures2 = figures2Paths.map(figure2path => new google.maps.Polygon({ paths: figure2path, ...polygonOptions }));
    const figures3 = figures3Paths.map(figure3path => new google.maps.Polygon({ paths: figure3path, ...polygonOptions }));

    const polygonsListener = map.addListener("zoom_changed", () => {
      drawPolygones(figures1, figures2, figures3);
    });

    return () => {
      console.log("Removing listeners...");
      google.maps.event.removeListener(polygonsListener);
      figures1.map(figure => figure.setMap(null));
      figures2.map(figure => figure.setMap(null));
      figures3.map(figure => figure.setMap(null));
    };

  }, [showPolygones, map]);

  const initControls = (myMap: google.maps.Map | null) => {
    const centerControlDiv = document.createElement("div");
    const controlButton = document.createElement("button");
    controlButton.className = `border-b-2 border-b-white rounded-sm shadow text-zinc-800 text-lg font-medium px-2 py-1 mt-[9px] -ml-10 text-center ${showPolygones ? "bg-blue-500" : "bg-white"}`;


    controlButton.textContent = "Mostrar polígonos";
    controlButton.title = "Click to recenter the map";
    controlButton.type = "button";

    controlButton.addEventListener("click", () => setShowPolygones(prev => !prev));

    centerControlDiv.append(controlButton);
    myMap?.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
  };

  const initListeners = (myMap: google.maps.Map | null) => {
    if (onClick) myMap?.addListener("click", (e: google.maps.MapMouseEvent) => onClick(e));
  };

  const drawPolygones = (figures1: google.maps.Polygon[], figures2: google.maps.Polygon[], figures3: google.maps.Polygon[]) => {
    console.log("draw polygones");
    if (!map) return;
    const currentZoom = map.getZoom();
    if (!currentZoom) return;

    if (currentZoom >= 8 && currentZoom < 12) {
      figures1.map(f => f.setMap(map));
      figures2.map(f => f.setMap(null));
      figures3.map(f => f.setMap(null));
    }

    if (currentZoom >= 12 && currentZoom < 15) {
      figures1.map(f => f.setMap(null));
      figures2.map(f => f.setMap(map));
      figures3.map(f => f.setMap(null));
    }

    if (currentZoom >= 15 && currentZoom < 18) {
      figures1.map(f => f.setMap(null));
      figures2.map(f => f.setMap(null));
      figures3.map(f => f.setMap(map));
    }

    if (currentZoom < 8 || currentZoom >= 18) {
      figures1.map(f => f.setMap(null));
      figures2.map(f => f.setMap(null));
      figures3.map(f => f.setMap(null));
    }
  };
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