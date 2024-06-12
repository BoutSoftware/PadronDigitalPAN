import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface CardProps {
  id: number;
  teamName: string;
  enlaceName: string;
  puntos: string;
  territorio: string;
}

export default function TeamCard({ id, teamName, enlaceName, puntos, territorio }: CardProps) {
  const router = useRouter();

  //Función para manejar la navegación a las rutas de mapa o tabla
  const handleNavigation = (path: string) => {
    router.push(`/team/${id}/${path}`); //Redirige a la ruta correspondiente con el id del equipo y el path proporcionado
  };

  return (
    <Card className="max-w-80 h-64" radius="sm" key={id}>
      <CardHeader className="pb-0 pt-3 px-4 flex-col items-start">
        <h1 className="text-xl text-primary-600">{teamName}</h1>
      </CardHeader>
      <CardBody className="px-4 gap-2">
        <p className="text-sm font-light">{enlaceName}</p>
        <p className="text-sm font-light">{puntos}</p>
        <p className="text-sm font-light">{territorio}</p>
      </CardBody>
      <CardFooter className="flex flex-row justify-end gap-2">
        <Button
          isIconOnly
          className="bg-white"
          onClick={() => handleNavigation("map")}
        >
          <span className="material-symbols-outlined">pin_drop</span>
        </Button>
        <Button
          isIconOnly
          className="bg-white"
          onClick={() => handleNavigation("table")}
        >
          <span className="material-symbols-outlined">toc</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
