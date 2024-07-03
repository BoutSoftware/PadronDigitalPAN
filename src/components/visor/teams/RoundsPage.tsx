import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import RoundsCard from "./RoundsCard";

interface Round {
  id: string;
  status: "activo" | "pausada" | "futuras";
}

const initialRounds: Round[] = [
  { id: "1", status: "activo" },
  { id: "2", status: "pausada" },
  { id: "3", status: "futuras" },
  { id: "4", status: "futuras" },
  { id: "5", status: "futuras" },
];

export default function RoundsPage() {
  const [rounds, setRounds] = useState<Round[]>(initialRounds);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const activeRounds = rounds.filter((round) => round.status === "activo");
    const pausedRounds = rounds.filter((round) => round.status === "pausada");

    if (activeRounds.length > 1) {
      setAlertMessage("Sólo puede haber una ronda activa. Ajustando las rondas...");
      const adjustedRounds = rounds.map((round, index) => {
        if (round.status === "activo" && index > 0) {
          return { ...round, status: "futuras" };
        }
        return round;
      });
      setRounds(adjustedRounds as Round[]);
    }

    if (pausedRounds.length > 1) {
      setAlertMessage("Sólo puede haber una ronda pausada. Ajustando las rondas...");
      const adjustedRounds = rounds.map((round, index) => {
        if (round.status === "pausada" && index > 0) {
          return { ...round, status: "futuras" };
        }
        return round;
      });
      setRounds(adjustedRounds as Round[]);
    }
  }, [rounds]);

  const activeRound = rounds.find((round) => round.status === "activo");
  const pausedRound = rounds.find((round) => round.status === "pausada");
  const futureRounds = rounds.filter((round) => round.status === "futuras");

  return (
    <div className="flex flex-col h-screen items-stretch overflow-auto px-8 gap-16">
      {alertMessage && (
        <div className="alert alert-warning flex justify-between items-center p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg" role="alert">
          <span>{alertMessage}</span>
          <Button isIconOnly className="bg-transparent" aria-label="Cerrar alerta" onPress={() => setAlertMessage(null)}>
            <span className="material-symbols-outlined">close</span>
          </Button>
        </div>
      )}
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
