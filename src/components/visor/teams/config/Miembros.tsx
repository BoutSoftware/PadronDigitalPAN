import { Avatar, Divider } from "@nextui-org/react";
import { Caminante } from "./Caminante";
import { TeamInterface } from "@/utils/VisorInterfaces";

interface Props {
  team: TeamInterface
}

export function Miembros({ team }: Props) {


  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl text-foreground-600 ">
        Miembros
        <span className="text-base text-foreground-400"> {team?.Caminantes.length} miembros en el Proyecto</span>
      </h2>
      <Divider />
      <div className="flex flex-col gap-4">
        {
          team?.Caminantes.map(({ id, active, name }) => (
            <Caminante key={id} id={id} active={active} name={name} />
          ))
        }
      </div>
    </div>
  );
}