import { Avatar, Divider } from "@nextui-org/react";
import { TeamInterface } from "@/utils/VisorInterfaces";

interface Props {
  team: TeamInterface
}

export function Enlace({ team }: Props) {


  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl text-foreground-600 ">Enlace del Proyecto</h2>
      <Divider />
      <div className="flex items-center gap-2">
        <Avatar showFallback name={team?.Link.name} src="https://images.unsplash.com/broken" />
        <p>{team?.Link.name}</p>
      </div>
    </div>
  );
}