import { Button } from "@nextui-org/react";
import RoundsCard from "./RoundsCard";

interface Round {
  id: string;
  status: "activo" | "pausada" | "futuras";
}

const rounds: Round[] = [
  { id: "1", status: "activo" },
  { id: "2", status: "pausada" },
  { id: "3", status: "futuras" },
  { id: "4", status: "futuras" },
  { id: "5", status: "futuras" },
];

export default function RoundsPage() {
  const activeRound = rounds.find((round) => round.status === "activo");
  const pausedRound = rounds.find((round) => round.status === "pausada");
  const futureRounds = rounds.filter((round) => round.status === "futuras");

  return (
    <div className="flex flex-col h-screen items-stretch overflow-auto px-8 gap-16">
      <div className="flex w-full justify-end">
        <Button color="primary">Añadir nueva ronda</Button>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-3xl">Ronda Activa</h1>
        <div className="w-full">
          {activeRound && <RoundsCard id={activeRound.id} status={activeRound.status} />}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-3xl">Ronda Pausada</h1>
        <div>
          {pausedRound && <RoundsCard id={pausedRound.id} status={pausedRound.status} />}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-3xl">Futuras Rondas</h1>
        <div className="flex flex-col gap-4">
          {futureRounds.map((round) => (
            <RoundsCard key={round.id} id={round.id} status={round.status} />
          ))}
        </div>
      </div>
    </div>
  );
}
