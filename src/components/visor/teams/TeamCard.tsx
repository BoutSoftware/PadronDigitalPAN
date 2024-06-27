import React from "react";
import { Button, Card, Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface GeographicConf {
  geographicLevel: string
  values: string[]
}

interface CardProps {
  id: string;
  team: string;
  enlace: string;
  puntos: string;
  geographicConf: GeographicConf;
}

export default function TeamCard({ id, team, enlace, puntos, geographicConf }: CardProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(`teams/${id}/${path}`);
  };

  return (
    <Card className="flex flex-col gap-4 w-full h-64 shadow rounded-md hover:cursor-pointer" onClick={() => handleNavigation("members")}>
      <h3 className="text-primary-600 text-xl font-bold pt-4 px-4">{team}</h3>
      <Divider />
      <div className="flex-1 px-4">
        <ul>
          <li className="text-default-400 my-2 text-sm"><span className="text-default-600 font-medium">Enlace: </span>{enlace}</li>
          <li className="text-default-400 my-2 text-sm"><span className="text-default-600 font-medium">Tipos de punto: </span>{puntos}</li>
          <li className="text-default-400 my-2 text-sm"><span className="text-default-600 font-medium">{geographicConf?.geographicLevel}: </span>{geographicConf?.values.join(", ")}</li>
        </ul>
      </div>
      <div className="flex justify-end items-center gap-2 pb-4 px-4">
        <Button variant="light" onPress={() => handleNavigation("map")} isIconOnly>{<span className="material-symbols-outlined">pin_drop</span>}</Button>
        <Button variant="light" onPress={() => handleNavigation("points")} isIconOnly>{<span className="material-symbols-outlined">toc</span>}</Button>
      </div>
    </Card>
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