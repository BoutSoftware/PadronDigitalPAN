"use client";
import { Select, SelectItem, Input, Button } from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";
import Map from "@/components/visor/maps/Map";
import Marker from "@/components/visor/maps/Marker";
import PopUp from "@/components/visor/maps/PopUp";

interface Point {
  id: string
  lat: number
  lng: number
}

export default function CreateRoundPage() {

  const [idCounter, setIdCounter] = useState(0);
  const [points, setPoints] = useState<Point[]>([
    // { id: "1", lat: 18.89425768444393, lng: -96.9345266598625 },
    { id: "2", lat: 18.90862561562622, lng: -96.9323472494062 },
    // { id: "3", lat: 18.908715061343514, lng: -96.93247331323172 },
    // { id: "4", lat: 18.908726479942146, lng: -96.93254640343007 },
    // { id: "5", lat: 18.908701739644577, lng: -96.93262284638736 }
  ]);

  return (
    <div className="p-4 flex gap-4 flex-1">
      <div className="flex flex-col gap-4">
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

        <div className="flex flex-col gap-4">
          {
            points.map((point, index) => (
              <PointDescription
                key={index}
                index={index}
                {...point}
                setPoints={setPoints} />
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

      <Map className="flex flex-1">
        {
          points.map(({ id, lat, lng }, index) => (
            <Marker
              key={id}
              position={{ lat, lng }}
              title={`Punto ${index + 1}`}
              image={{
                src: "https://map-visor.vercel.app/api/figures?figure=circulo&color=000",
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
}

function PointDescription({ index, lat, lng, setPoints }: Props) {
  function handleDeletePoint() {


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
          onPress={handleDeletePoint}
        >
          <span className="material-symbols-outlined !text-[16px]">close</span>
        </Button>
      </div>
      <span className="text-sm">Latitud: <span className="text-foreground-600">{lat}</span></span>
      <span className="text-sm">Longitud: <span className="text-foreground-600">{lng}</span></span>
    </div>
  );
}