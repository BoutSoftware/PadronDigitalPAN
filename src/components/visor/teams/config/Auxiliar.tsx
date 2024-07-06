import { Avatar, Divider } from "@nextui-org/react";
import { TeamInterface } from "@/utils/VisorInterfaces";

interface Props {
  team: TeamInterface
}

export function Auxiliar({ team }: Props) {


  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl text-foreground-600 ">Auxiliar de coordinación</h2>
      <Divider />
      <div className="flex items-center gap-2">
        <Avatar showFallback name={team?.Auxiliary.name} src="https://images.unsplash.com/broken" />
        <span>{team?.Auxiliary.name}</span>
      </div>
    </div>
  );
}