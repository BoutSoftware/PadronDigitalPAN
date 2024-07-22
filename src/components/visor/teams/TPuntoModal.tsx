import { Card, Button } from "@nextui-org/react";

interface TPuntoModalProps {
  pointTypes: string[];
  onBackToRounds: () => void;
  selectedRoundId: string; // ID de la ronda seleccionada
  onStatusChange: (id: string, newStatus: "activa" | "pausada" | "noiniciada") => void;
}

export default function TPuntoModal({ pointTypes, onBackToRounds, selectedRoundId, onStatusChange }: TPuntoModalProps) {

  const updateStatus = async (action: "start" | "pause" | "stop") => {
    try {
      const response = await fetch(`/dashboard/api/visor/rounds/${selectedRoundId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (data.code === "OK") {
        const newStatus = action === "start" ? "activa" : action === "pause" ? "pausada" : "noiniciada";
        onStatusChange(selectedRoundId, newStatus);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePause = () => {
    updateStatus("pause");
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[740px] max-h-[600px]">
      <h1 className="text-md text-center">Selecciona el tipo de punto</h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {pointTypes.map((type, index) => (
          <Card
            key={index}
            isPressable
            className="flex flex-col w-[80px] h-[80px] p-4 gap-2 items-center text-primary-foreground"
            radius="sm"
          >
            <div className="flex-1 text-left content-center">
              <h1 className="text-xs truncate text-foreground-700">{capitalizeFirstLetter(type)}</h1>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex flex-row gap-4 justify-between">
        <Button isIconOnly color="default" variant="light" size="md" onPress={onBackToRounds}>
          <span className="material-symbols-outlined">arrow_back</span>
        </Button>
        <Button color="danger" onPress={handlePause}>
          Pausar ronda
        </Button>
      </div>
    </div>
  );
}
