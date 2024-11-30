"use client";

import { useState, useEffect } from "react";
import { Button, Divider } from "@nextui-org/react";
import RoundsCard from "@/components/visor/teams/RoundsCard";
import { useParams } from "next/navigation";
import RoundsModal from "@/components/visor/teams/RoundsModal";
import Link from "next/link";

interface Round {
  id: string;
  name: string;
  status: "activa" | "pausada" | "noiniciada";
  pointTypesIDs: string[];
}

interface Rounds {
  active: Round[]
  paused: Round[]
  noStarted: Round[]
}

export default function RoundsPage() {
  const { id: teamId } = useParams();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [rounds, setRounds] = useState<Rounds>({
    active: [],
    noStarted: [],
    paused: []
  });

  const getRounds = async () => {
    try {
      const resBody = await fetch(`/dashboard/api/visor/teams/${teamId}/rounds`)
        .then(res => res.json())
        .catch(e => console.log(e));

      if (resBody.code !== "OK") {
        console.error(resBody.message);
        alert("Error Obteniendo las Rondas");
      }

      console.log(resBody.data);

      setRounds(resBody.data);
    } catch (error) {
      console.error("Error fetching rounds:", error);
    }
  };

  useEffect(() => {
    getRounds();
  }, []);

  // useEffect(() => {
  //   console.log("Rounds state updated:", rounds);
  //   const activeRounds = rounds.filter((round) => round.status === "activa");
  //   const pausedRounds = rounds.filter((round) => round.status === "pausada");

  //   if (activeRounds.length > 1) {
  //     setAlertMessage("Sólo puede haber una ronda activa. Ajustando las rondas...");
  //     const adjustedRounds = rounds.map((round, index) => {
  //       if (round.status === "activa" && index > 0) {
  //         return { ...round, status: "noiniciada" };
  //       }
  //       return round;
  //     });
  //     setRounds(adjustedRounds as Round[]);
  //   }

  //   if (pausedRounds.length > 1) {
  //     setAlertMessage("Sólo puede haber una ronda pausada. Ajustando las rondas...");
  //     const adjustedRounds = rounds.map((round, index) => {
  //       if (round.status === "pausada" && index > 0) {
  //         return { ...round, status: "noiniciada" };
  //       }
  //       return round;
  //     });
  //     setRounds(adjustedRounds as Round[]);
  //   }
  // }, [rounds]);

  const handleStatusChange = () => {
    getRounds();
  };

  return (
    <div className="flex flex-col p-8 gap-8">
      {alertMessage && (
        <div className="alert alert-warning flex justify-between items-center p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg" role="alert">
          <span>{alertMessage}</span>
          <Button isIconOnly className="bg-transparent" aria-label="Cerrar alerta" onPress={() => setAlertMessage(null)}>
            <span className="material-symbols-outlined">close</span>
          </Button>
        </div>
      )}

      {rounds.active.length > 0 && (
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-3xl">Ronda Activa</h1>
          <div className="w-full">
            {rounds.active.map((activeRound) =>
              <RoundsCard
                key={activeRound.id}
                id={activeRound.id}
                name={activeRound.name}
                status={activeRound.status}
                pointTypesIDs={activeRound.pointTypesIDs}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
          <Divider />
        </div>
      )}

      {rounds.paused.length > 0 && (
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-3xl">Ronda Pausada</h1>
          <div>
            {rounds.paused.map((pausedRound) =>
              <RoundsCard
                key={pausedRound.id}
                id={pausedRound.id}
                name={pausedRound.name}
                status={pausedRound.status}
                pointTypesIDs={pausedRound.pointTypesIDs}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
          <Divider />
        </div>
      )}

      {rounds.noStarted.length > 0 &&
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl">Futuras Rondas</h1>
            <Button color="primary" href={`/dashboard/visor/teams/${teamId}/rounds/new`} as={Link}>Añadir nueva ronda</Button>
          </div>
          <div className="flex flex-col gap-4">
            {rounds.noStarted.map((round) => (
              <RoundsCard
                key={round.id}
                id={round.id}
                name={round.name}
                status={round.status}
                pointTypesIDs={round.pointTypesIDs}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      }

    </div>
  );
}
