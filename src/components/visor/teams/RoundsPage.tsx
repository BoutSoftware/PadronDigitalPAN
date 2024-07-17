import { useState, useEffect } from "react";
import { Button, Divider } from "@nextui-org/react";
import RoundsCard from "./RoundsCard";

interface Round {
  id: string;
  name: string;
  status: "activa" | "pausada" | "noiniciada";
  pointTypesIDs: string[];
}

interface RoundsPageProps {
  teamId: string;
}

export default function RoundsPage({ teamId }: RoundsPageProps) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching rounds for teamId:", teamId); // Log para verificar el teamId
    const fetchRounds = async () => {
      try {
        const response = await fetch(`/dashboard/api/visor/teams/${teamId}/rounds`);
        const data = await response.json();
        console.log("API response:", data);
        if (data.code === "OK" && data.data) {
          setRounds(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching rounds:", error);
      }
    };

    fetchRounds();
  }, [teamId]);

  useEffect(() => {
    console.log("Rounds state updated:", rounds);
    const activeRounds = rounds.filter((round) => round.status === "activa");
    const pausedRounds = rounds.filter((round) => round.status === "pausada");

    if (activeRounds.length > 1) {
      setAlertMessage("Sólo puede haber una ronda activa. Ajustando las rondas...");
      const adjustedRounds = rounds.map((round, index) => {
        if (round.status === "activa" && index > 0) {
          return { ...round, status: "noiniciada" };
        }
        return round;
      });
      setRounds(adjustedRounds as Round[]);
    }

    if (pausedRounds.length > 1) {
      setAlertMessage("Sólo puede haber una ronda pausada. Ajustando las rondas...");
      const adjustedRounds = rounds.map((round, index) => {
        if (round.status === "pausada" && index > 0) {
          return { ...round, status: "noiniciada" };
        }
        return round;
      });
      setRounds(adjustedRounds as Round[]);
    }
  }, [rounds]);

  const handleStatusChange = (id: string, newStatus: "activa" | "pausada" | "noiniciada") => {
    setRounds((prevRounds) =>
      prevRounds.map((round) =>
        round.id === id ? { ...round, status: newStatus } : round
      )
    );
  };

  const activeRound = rounds.find((round) => round.status === "activa");
  const pausedRound = rounds.find((round) => round.status === "pausada");
  const futureRounds = rounds.filter((round) => round.status === "noiniciada");

  console.log("Active Round:", activeRound);
  console.log("Paused Round:", pausedRound);
  console.log("Future Rounds:", futureRounds);

  return (
    <div className="flex flex-col px-4 gap-8">
      {alertMessage && (
        <div className="alert alert-warning flex justify-between items-center p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg" role="alert">
          <span>{alertMessage}</span>
          <Button isIconOnly className="bg-transparent" aria-label="Cerrar alerta" onPress={() => setAlertMessage(null)}>
            <span className="material-symbols-outlined">close</span>
          </Button>
        </div>
      )}
      {activeRound && (
        <div className="flex flex-col gap-4 w-full -mt-4">
          <h1 className="text-3xl">Ronda Activa</h1>
          <div className="w-full">
            <RoundsCard
              id={activeRound.id}
              name={activeRound.name}
              status={activeRound.status}
              pointTypesIDs={activeRound.pointTypesIDs}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      )}
      {pausedRound && (
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-3xl">Ronda Pausada</h1>
          <div>
            <RoundsCard
              id={pausedRound.id}
              name={pausedRound.name}
              status={pausedRound.status}
              pointTypesIDs={pausedRound.pointTypesIDs}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      )}
      {futureRounds.length > 0 && (
        <>
          <Divider />
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-row justify-between">
              <h1 className="text-3xl">Futuras Rondas</h1>
              <Button color="primary">Añadir nueva ronda</Button>
            </div>
            <div className="flex flex-col gap-4">
              {futureRounds.map((round) => (
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
        </>
      )}
    </div>
  );
}
