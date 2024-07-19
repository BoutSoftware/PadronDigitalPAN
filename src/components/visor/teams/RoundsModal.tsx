"use client";

import { useState, useEffect } from "react";
import { Button, Divider } from "@nextui-org/react";
import RoundsCard from "@/components/visor/teams/RoundsCard";
import { useParams } from "next/navigation";

interface Round {
  id: string;
  name: string;
  status: "activa" | "pausada" | "noiniciada";
  pointTypesIDs: string[];
}

interface Rounds {
  active: Round[];
  paused: Round[];
  noStarted: Round[];
}

export default function RoundsModal() {
  const { id: teamId } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [rounds, setRounds] = useState<Rounds>({
    active: [],
    noStarted: [],
    paused: []
  });

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const getRounds = async () => {
    try {
      console.log(`Fetching rounds for teamId: ${teamId}`);
      const response = await fetch(`/dashboard/api/visor/teams/${teamId}/rounds`);
      const data = await response.json();

      if (data.code === "OK" && data.data) {
        console.log("Fetched rounds:", data.data);
        const activeRounds = data.data.active;
        const pausedRounds = data.data.paused;
        const noStartedRounds = data.data.noStarted;
        console.log("Active rounds:", activeRounds);
        console.log("Paused rounds:", pausedRounds);
        console.log("No started rounds:", noStartedRounds);
        setRounds({
          active: activeRounds,
          paused: pausedRounds,
          noStarted: noStartedRounds
        });
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching rounds:", error);
    }
  };

  useEffect(() => {
    console.log(`Component mounted, teamId: ${teamId}`);
    if (teamId) {
      getRounds();
    }
  }, [teamId]);

  const handleStatusChange = () => {
    getRounds();
  };

  return (
    <div className="relative mx-auto w-full max-w-[740px] transition-all duration-500">
      <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2">
        <Button
          isIconOnly
          color="default"
          variant="light"
          size="md"
          onPress={toggleExpand}
        >
          <span className="material-symbols-outlined">
            {isExpanded ? "arrow_circle_up" : "arrow_circle_down"}
          </span>
        </Button>
      </div>
      <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? "h-[600px] pt-8 overflow-y-auto" : "h-0"}`}>
        {isExpanded && (
          <div className="p-4">
            {rounds.active.length > 0 && (
              <div className="flex flex-col gap-4 w-full">
                <h1 className="text-3xl">Rondas Activas</h1>
                <div>
                  {rounds.active.map(activeRound => (
                    <RoundsCard
                      key={activeRound.id}
                      id={activeRound.id}
                      name={activeRound.name}
                      status={activeRound.status}
                      pointTypesIDs={activeRound.pointTypesIDs}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
                <Divider />
              </div>
            )}
            {rounds.paused.length > 0 && (
              <div className="flex flex-col gap-4 w-full">
                <h1 className="text-3xl">Rondas Pausadas</h1>
                <div>
                  {rounds.paused.map(pausedRound => (
                    <RoundsCard
                      key={pausedRound.id}
                      id={pausedRound.id}
                      name={pausedRound.name}
                      status={pausedRound.status}
                      pointTypesIDs={pausedRound.pointTypesIDs}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
                <Divider />
              </div>
            )}
            {rounds.noStarted.length > 0 && (
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-row justify-between">
                  <h1 className="text-3xl">Futuras Rondas</h1>
                </div>
                <div className="flex flex-col gap-4">
                  {rounds.noStarted.map(round => (
                    <RoundsCard
                      key={round.id}
                      id={round.id}
                      name={round.name}
                      status={round.status}
                      pointTypesIDs={round.pointTypesIDs}
                      onStatusChange={handleStatusChange}
                      showEditDeleteButtons={false} // Se pasa la prop para ocultar botones de editar y eliminar
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
