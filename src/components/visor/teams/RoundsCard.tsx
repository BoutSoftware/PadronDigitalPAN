import { Card, Button } from "@nextui-org/react";

interface RoundsCardProps {
  id: string;
  status: "activo" | "pausada" | "futuras";
}

export default function RoundsCard({ id, status }: RoundsCardProps) {
  const getClassNames = () => {
    switch (status) {
      case "activo":
        return "bg-blue-500 text-white";
      case "pausada":
        return "bg-primary text-white";
      case "futuras":
        return "bg-accent text-white";
      default:
        return "";
    }
  };

  return (
    <Card key={id} className={`flex flex-row w-full p-4 gap-2 items-center ${getClassNames()}`}>
      <div className="w-1/2">
        <h1 className="text-2xl">Nombre de la Ronda</h1>
      </div>
      <div className="flex flex-row justify-between w-full items-center">
        <p className="text-sm">Publicidad, Necesidades</p>
        <div className="flex flex-row gap-8">
          {status === "pausada" && (
            <>
              <Button isIconOnly className="bg-transparent text-white" aria-label="Detener">
                <span className="material-symbols-outlined">stop_circle</span>
              </Button>
              <Button isIconOnly className="bg-transparent text-white" aria-label="Reproducir">
                <span className="material-symbols-outlined">play_arrow</span>
              </Button>
            </>
          )}
          {status === "futuras" && (
            <>
              <Button isIconOnly className="bg-transparent text-white" aria-label="Eliminar">
                <span className="material-symbols-outlined">delete</span>
              </Button>
              <Button isIconOnly className="bg-transparent text-white" aria-label="Editar">
                <span className="material-symbols-outlined">edit</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
