"use client";
import { useParams, useRouter } from "next/navigation";

export default function IdTeam() {
  const router = useRouter();
  const params = useParams();
  router.push(`/dasboard/visor/teams/${params.id}/members`);
}