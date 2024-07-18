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
    <Card className="flex flex-col gap-4 w-full shadow rounded-md hover:cursor-pointer" isPressable onPress={() => handleNavigation("config")}>
      <h3 className="text-primary-600 text-xl font-bold pt-4 px-4">{team}</h3>
      <Divider />
      <div className="flex-1 px-4 text-start">
        <ul>
          <li className="text-default-400 my-2 text-sm"><span className="text-default-600 font-medium">Enlace: </span>{enlace}</li>
          <li className="text-default-400 my-2 text-sm"><span className="text-default-600 font-medium">Tipos de punto: </span>{puntos}</li>
          <li className="text-default-400 my-2 text-sm"><span className="text-default-600 font-medium">{geographicConf?.geographicLevel}: </span>{geographicConf?.values.join(", ")}</li>
        </ul>
      </div>
      <div className="flex justify-end items-center gap-2 pb-4 px-4 w-full">
        <Button variant="light" onPress={() => handleNavigation("map")} isIconOnly>{<span className="material-symbols-outlined">pin_drop</span>}</Button>
        <Button variant="light" onPress={() => handleNavigation("points")} isIconOnly>{<span className="material-symbols-outlined">toc</span>}</Button>
      </div>
    </Card>
  );
}