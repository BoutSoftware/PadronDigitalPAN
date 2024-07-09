import { Card, Button } from "@nextui-org/react";

interface RoundsCardProps {
  id: string;
  status: "activo" | "pausada" | "futuras";
}

export default function RoundsCard({ id, status }: RoundsCardProps) {
  const getClassNames = () => {
    switch (status) {
      case "activo":
        return "bg-secondary text-primary-foreground";
      case "pausada":
        return "bg-primary-200 text-primary-foreground";
      case "futuras":
        return "bg-content2 text-content2-foreground";
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
        <div className="flex flex-row gap-4">
          {status === "activo" && (
            <>
              <Button isIconOnly className="" aria-label="Detener" color="default" variant="light" size="md">
                <span className="material-symbols-outlined text-white">pause</span>
              </Button>
            </>
          )}
          {status === "pausada" && (
            <>
              <Button isIconOnly className="" aria-label="Detener" color="default" variant="light" size="md">
                <span className="material-symbols-outlined">stop_circle</span>
              </Button>
              <Button isIconOnly className="" aria-label="Reproducir" color="default" variant="light" size="md">
                <span className="material-symbols-outlined">play_arrow</span>
              </Button>
            </>
          )}
          {status === "futuras" && (
            <>
              <Button isIconOnly className="" aria-label="Eliminar" color="danger" variant="light" size="md">
                <span className="material-symbols-outlined">delete</span>
              </Button>
              <Button isIconOnly className="" aria-label="Editar" color="default" variant="light" size="md">
                <span className="material-symbols-outlined">edit</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
