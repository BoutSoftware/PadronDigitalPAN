"use client";
import { Auxiliar, Enlace, GeoArea, Miembros, PointType, Structure } from "@/components/visor/teams/config/";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TeamInterface } from "@/utils/VisorInterfaces";
import { Button } from "@nextui-org/react";

export default function Page() {

  const [team, setTeam] = useState<TeamInterface | null>(null);
  const { id: teamId } = useParams();
  const router = useRouter();

  useEffect(() => {
    laodTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function laodTeam() {
    const teamData = await getUpdatedTeam();
    console.log(teamData);
    setTeam(teamData);
  }

  async function getUpdatedTeam() {
    const resBody = await fetch(`/dashboard/api/visor/teams/${teamId}`)
      .then(res => res.json())
      .catch(err => console.error(err));
    if (resBody.code !== "OK") {
      console.error(resBody.message);
      return;
    }
    return resBody.data;
  }

  const deleteTeam = async () => {
    const resBody = await fetch(`/dashboard/api/visor/teams/${teamId}`, {
      method: "DELETE"
    }).then((res) => res.json());

    if (resBody.code !== "OK") {
      return alert("Error al eliminar el Proyecto");
    }

    alert("Proyecto eliminado correctamente");
    router.push("/dashboard/visor/teams");
  };


  return (
    <div className="p-4 px-8 flex gap-8">

      <div className="flex flex-col flex-1 gap-4">

        {team && <Structure team={team} />}

        {team && <Auxiliar team={team} />}

        {team && <Enlace team={team} />}

        {team && <Miembros team={team} />}

      </div>

      <div className="flex flex-col flex-1 gap-4">

        {team && <GeoArea team={team} loadTeam={laodTeam} teamId={teamId.toString()} />}

        {team && <PointType team={team} loadTeam={laodTeam} teamId={teamId.toString()} />}

        <Button
          onPress={
            () => {
              if (confirm("¿Estás seguro de que deseas eliminar este Proyecto?")) {
                deleteTeam();
              }
            }
          }
          color="danger"
          className="self-end"
        >
          Eliminar Proyecto
        </Button>
      </div>
    </div>
  );
}