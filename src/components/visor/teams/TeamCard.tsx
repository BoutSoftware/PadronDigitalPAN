import React from "react";
import { Button, Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface GeoConfig {
  level: string;
  values: string[];
}

interface CardProps {
  id: number;
  team: string;
  enlace: string;
  puntos: string;
  geoConfig: GeoConfig;
}

export default function TeamCard({ id, team, enlace, puntos, geoConfig }: CardProps) {
  const router = useRouter();

  // Función para manejar la navegación a las rutas de mapa o tabla
  const handleNavigation = (path: string) => {
    router.push(`/team/${id}/${path}`); // Redirige a la ruta correspondiente con el id del equipo y el path proporcionado
  };

  return (
    <div className="flex flex-col gap-4 w-[370px] h-80 shadow rounded-md">
      <h3 className="text-primary-600 text-xl font-bold pt-4 px-4">{team}</h3>
      <Divider />
      <div className="flex-1 px-4">
        <ul>
          <li className="text-default-400 my-2 text-sm"><span className="text-default-600 font-medium">Enlace: </span>{enlace}</li>
          <li className="text-default-400 my-2 text-sm"><span className="text-default-600 font-medium">Tipos de punto: </span>{puntos}</li>
          <li className="text-default-400 my-2 text-sm"><span className="text-default-600 font-medium">{geoConfig.level}: </span>{geoConfig.values.join(", ")}</li>
        </ul>
      </div>
      <div className="flex justify-end items-center gap-2 pb-4 px-4">
        <Button variant="light" isIconOnly>{<span className="material-symbols-outlined">pin_drop</span>}</Button>
        <Button variant="light" isIconOnly>{<span className="material-symbols-outlined">toc</span>}</Button>
      </div>
    </div>
  );
}



{/* <Card className="w-80 h-72" radius="sm" shadow="sm" key={id}>
      <CardHeader className="pt-3 px-4 flex-col items-start">
        <h3 className="text-xl text-default-500 font-semibold">{teamName}</h3>
      </CardHeader>
      <CardBody className="px-4 gap-2">
        <p className="text-sm text-default-700">Enlace: <span className="text-default-500">{enlace}</span></p>
        <p className="text-sm text-default-700">Tipos de punto: <span className="text-default-500">{puntos}</span></p>
        <p className="text-sm text-default-700">{geoConfig.level}: <span className="text-default-500">{geoConfig.values.join(", ")}</span></p>
      </CardBody>
      <CardFooter className="flex flex-row justify-end gap-2">
        <Button
          isIconOnly
          variant="flat"
          onClick={() => handleNavigation("map")}
        >
          <span className="material-symbols-outlined">pin_drop</span>
        </Button>
        <Button
          isIconOnly
          variant="flat"
          onClick={() => handleNavigation("table")}
        >
          <span className="material-symbols-outlined">toc</span>
        </Button>
      </CardFooter>
    </Card> */}