import { Card, Button } from "@nextui-org/react";

interface RoundsCardProps {
  id: string;
  name: string;
  status: "activa" | "pausada" | "noiniciada";
  pointTypesIDs: string[];
  onStatusChange: (id: string, newStatus: "activa" | "pausada" | "noiniciada") => void;
  showEditDeleteButtons?: boolean; // Nueva prop opcional
}

export default function RoundsCard({ id, name, status, pointTypesIDs, onStatusChange, showEditDeleteButtons = true }: RoundsCardProps) {
  const getClassNames = () => {
    switch (status) {
      case "activa":
        return "bg-secondary text-primary-foreground";
      case "pausada":
        return "bg-primary-200 text-primary-foreground";
      case "noiniciada":
        return "bg-content2 text-content2-foreground";
      default:
        return "";
    }
  };

  const updateStatus = async (action: "start" | "pause" | "stop") => {
    try {
      const response = await fetch(`/dashboard/api/visor/rounds/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (data.code === "OK") {
        const newStatus = action === "start" ? "activa" : action === "pause" ? "pausada" : "noiniciada";
        onStatusChange(id, newStatus);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePause = () => {
    if (status === "activa") {
      updateStatus("pause");
    }
  };

  const handlePlay = () => {
    if (status === "pausada") {
      updateStatus("start");
    }
  };

  const handleStop = () => {
    if (status !== "noiniciada") {
      updateStatus("stop");
    }
  };

  return (
    <Card key={id} className={`flex flex-col sm:flex-row w-full p-4 gap-2 items-center ${getClassNames()}`}>
      <div className="flex-1">
        <h1 className="text-2xl">{name}</h1>
      </div>
      <div className="flex-1 text-center">
        <p className="text-sm">{pointTypesIDs.slice(0, 3).join(", ")}{pointTypesIDs.length > 3 && "..."}</p>
      </div>
      <div className="flex flex-row gap-4 justify-end flex-1">
        {status === "activa" && (
          <Button isIconOnly aria-label="Pausar" color="default" variant="light" size="md" onPress={handlePause}>
            <span className="material-symbols-outlined text-white">pause</span>
          </Button>
        )}
        {status === "pausada" && (
          <>
            <Button isIconOnly aria-label="Detener" color="default" variant="light" size="md" onPress={handleStop}>
              <span className="material-symbols-outlined">stop_circle</span>
            </Button>
            <Button isIconOnly aria-label="Reproducir" color="default" variant="light" size="md" onPress={handlePlay}>
              <span className="material-symbols-outlined">play_arrow</span>
            </Button>
          </>
        )}
        {status === "noiniciada" && showEditDeleteButtons && (
          <>
            <Button isIconOnly aria-label="Eliminar" color="danger" variant="light" size="md" onPress={() => { /* Lógica para eliminar */ }}>
              <span className="material-symbols-outlined">delete</span>
            </Button>
            <Button isIconOnly aria-label="Editar" color="default" variant="light" size="md" onPress={() => { /* Lógica para editar */ }}>
              <span className="material-symbols-outlined">edit</span>
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
