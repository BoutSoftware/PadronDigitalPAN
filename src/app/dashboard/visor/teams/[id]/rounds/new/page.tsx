
"use client";
import { Select, SelectItem, Input, Button } from "@nextui-org/react";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import Map from "@/components/visor/maps/Map";
import Marker from "@/components/visor/maps/Marker";
import PopUp from "@/components/visor/maps/PopUp";

interface Point {
  id: string
  lat: number
  lng: number
}

export default function CreateRoundPage() {

  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    console.log(points);
  }, [points]);

  function handleClick(e: google.maps.MapMouseEvent) {
    if (!e.latLng) return;
    setPoints(prevPoints => (
      [
        ...prevPoints,
        {
          id: (prevPoints.length).toString(),
          lat: e.latLng!.lat(),
          lng: e.latLng!.lng()
        }
      ]
    ));
  }


  return (
    <div className="flex gap-4 p-4 flex-1 overflow-auto">
      <div className="flex flex-col gap-4 w-60">
        <Select
          label="Tipo de punto"
          placeholder="Selecciona un tipo de punto"
        >
          <SelectItem key="1">Tipo de punto 1</SelectItem>
          <SelectItem key="2">Tipo de punto 2</SelectItem>
          <SelectItem key="3">Tipo de punto 3</SelectItem>
          <SelectItem key="4">Tipo de punto 4</SelectItem>
        </Select>

        <Input
          label="Nombre de la ronda"
          placeholder="Escribe el nombre de la ronda"
        />

        <div className="flex flex-col flex-1 overflow-auto gap-4">
          {
            points.map((point, index) => (
              <PointDescription
                key={index}
                index={index}
                {...point}
                setPoints={setPoints}
                points={points} />
            ))
          }
        </div>

        <Button
          fullWidth
          color="primary"
          size="lg"
        >
          Crear ronda
        </Button>

      </div>

      <Map
        className="flex flex-1"
        onClick={handleClick}>
        {
          points.map(({ id, lat, lng }, index) => (
            <Marker
              key={id}
              position={{ lat, lng }}
              title={`Punto ${index + 1}`}
              image={{
                src: "https://map-visor.vercel.app/api/figures?figure=circulo&color=00000033",
                width: 30,
              }}

            >
              <PopUp>
                <h3 className="text-lg font-semibold">Punto {index + 1}</h3>
                <p>Descripción del punto</p>
              </PopUp>
            </Marker>
          ))
        }
      </Map>
    </div>
  );
}

interface Props {
  index: number
  lat: number
  lng: number
  setPoints: Dispatch<SetStateAction<Point[]>>
  points: Point[]
}

function PointDescription({ index, lat, lng, setPoints, points }: Props) {

  function handleDeletePoint(i: number) {
    const newPoints = [...points];
    // setPoints(prevPoints => ({
    //   ...prevPoints,
    // }));
  }

  return (
    <div className="flex flex-col w-64 p-4 rounded-md bg-foreground-50">
      <div className="flex flex-1 justify-between items-center mb-4">
        <span className="text-foreground-700">Punto {index + 1}</span>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          radius="full"
          onPress={() => handleDeletePoint(index)}
        >
          <span className="material-symbols-outlined !text-[16px]">close</span>
        </Button>
      </div>
      <span className="text-sm">Latitud: <span className="text-foreground-600">{lat}</span></span>
      <span className="text-sm">Longitud: <span className="text-foreground-600">{lng}</span></span>
    </div>
  );
}