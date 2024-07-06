"use client";
import { Auxiliar, Enlace, GeoArea, Miembros, PointType, Structure } from "@/components/visor/teams/config/";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TeamInterface } from "@/utils/VisorInterfaces";

export default function Page() {

  const [team, setTeam] = useState<TeamInterface | null>(null);
  const { id: teamId } = useParams();

  useEffect(() => {
    setTeamInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setTeamInfo() {
    const teamData = await getTeamInfo();
    setTeam(teamData);
  }

  async function getTeamInfo() {
    const resBody = await fetch(`/dashboard/api/visor/teams/${teamId}`)
      .then(res => res.json())
      .catch(err => console.error(err));
    if (resBody.code !== "OK") {
      console.error(resBody.message);
      return;
    }
    return resBody.data;
  }


  return (
    <div className="p-4 flex gap-4">

      <div className="flex flex-col flex-1 gap-4">

        {team && <Structure team={team} />}

        {team && <Auxiliar team={team} />}

        {team && <Enlace team={team} />}

        {team && <Miembros team={team} />}

      </div>

      <div className="flex flex-col flex-1 gap-4">

        {team && <GeoArea team={team} setTeam={setTeam} teamId={teamId.toString()} />}

        {team && <PointType team={team} teamId={teamId.toString()} />}

      </div>
    </div>
  );
}