"use client";
import { Select, SelectItem, Input, Button, Selection } from "@nextui-org/react";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TIPOS_PUNTO } from "@/configs/catalogs/visorCatalog";
import { useParams } from "next/navigation";
import Map from "@/components/visor/maps/Map";
import Circle from "@/components/visor/maps/Circle";

interface Form {
  name: string
  pointTypesKeys: Selection
  createdBy: string
  checkPoints: {
    id: string
    lat: number
    lng: number
  }[]
}

export default function CreateRoundPage() {

  const [form, setForm] = useState<Form>({ name: "", checkPoints: [], createdBy: "", pointTypesKeys: new Set([]) });

  const { currentUser } = useAuth();
  const { id: teamId } = useParams();

  /*
    TODO: Solve this

    !Problem creating round.

    Current User is undefinded. So I can´t access to currentUser.id (I need it to create a round)
    
    By the way. I tried to make fetch with "66184825fa95c423182a0894", which is
    an ID that is returned when in AuthContext.jsx:62 as a result of the login
    in the APP.

    The API route /dashboard/api/visor/teams/${teamId}/rounds response "USER_NOT_FOUND"

    !Problem removing circles in the map.

    Circles can be drawed in the map. And they also are collected in the form state, the problem
    is removing their from the map. They do it in the state, but the circles still watching in the map

    This is because, the map conserves the circles. They need to be removed by using circle.setMap(null)

    Something I think can work (i didn´t try it before) is:

    useEffect return a callback, for each circle, we can delete it with circle.setMap(null). So, every
    time the form.checkpoints change we desmount the state (and execute circle.setMap(null)). And then
    we draw all the current form.checkpoints
  */

  useEffect(() => {
    console.log(currentUser);
    console.log(currentUser?.id);
    setForm({ ...form, createdBy: currentUser?.id || "66184825fa95c423182a0894" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreateRound(e: FormEvent) {

    e.preventDefault();
    if (formHasEmptyFields()) return;

    const roundName = form.name;
    const creator = form.createdBy;
    const checkpoints = form.checkPoints.map(({ lat, lng }) => ({ latitud: lat, longitude: lng }));
    const pointTypesIDs = Array.from(form.pointTypesKeys).map(pointTypeId => pointTypeId.toString());

    const data = await createRound(roundName, creator, checkpoints, pointTypesIDs);

    if (!data) return;

    // Do what is needed if always is OK
  }

  async function createRound(name: string, createdById: string, checkPoints: { latitud: number, longitude: number }[], pointTypesIDs: string[]) {
    const resBody = await fetch(`/dashboard/api/visor/teams/${teamId}/rounds`, {
      method: "POST",
      body: JSON.stringify({ name, createdById, checkPoints, pointTypesIDs })
    })
      .then(res => res.json())
      .catch(err => console.error(err));

    console.log(resBody);

    if (resBody.code !== "OK") return;

    return resBody.data;
  }

  function handleDeleteCheckPoint(i: number) {
    // TODO: Make this work
    // I think this isn´t working because I am retiring the points of the state, but not the points in the MAP.

    const newCheckPoints = [...form.checkPoints].filter((point, index) => index != i);
    setForm({ ...form, checkPoints: newCheckPoints });
  }

  function handleClick(e: google.maps.MapMouseEvent) {
    if (!e.latLng) return;
    setForm(prevForm => ({
      ...prevForm,
      checkPoints: [
        ...prevForm.checkPoints,
        {
          id: crypto.randomUUID(),
          lat: e.latLng!.lat(),
          lng: e.latLng!.lng()
        }
      ]
    }
    ));
  }

  function formHasEmptyFields(): boolean {
    if (form.checkPoints.length == 0) return true;
    if (form.createdBy.length == 0) return true;
    if (form.name.length == 0) return true;
    if (Array.from(form.pointTypesKeys).length == 0) return true;

    return false;
  }

  return (
    <div className="flex gap-4 p-4 flex-1 overflow-auto">
      <form className="flex flex-col gap-4 w-60" onSubmit={(e) => handleCreateRound(e)}>
        <Select
          label="Tipo de punto"
          placeholder="Selecciona un tipo de punto"
          selectionMode="multiple"
          selectedKeys={form.pointTypesKeys}
          onSelectionChange={(pointTypesKeys) => setForm({ ...form, pointTypesKeys })}
          items={TIPOS_PUNTO}
        >
          {
            (pointType) => <SelectItem key={pointType.id}>{pointType.nombre}</SelectItem>
          }
        </Select>

        <Input
          value={form.name}
          onValueChange={(name) => setForm({ ...form, name })}
          label="Nombre de la ronda"
          placeholder="Escribe el nombre de la ronda"
        />

        <div className="flex flex-col flex-1 overflow-auto gap-4">
          {
            form.checkPoints.map((point, index) => (
              <PointDescription
                key={index}
                index={index}
                handleDeleteCheckPoint={() => handleDeleteCheckPoint(index)}
                {...point}
              />
            ))
          }
        </div>

        <Button
          fullWidth
          color="primary"
          size="lg"
          type="submit"
        >
          Crear ronda
        </Button>

      </form>

      <Map
        className="flex flex-1"
        onClick={handleClick}>
        {
          form.checkPoints.map(({ id, lat, lng }, index) => {
            console.log(id, lat, lng);
            return (
              <Circle
                key={id}
                center={{ lat, lng }}
                radius={5}
              />
            );
          })
        }
      </Map>
    </div>
  );
}

interface Props {
  index: number
  lat: number
  lng: number
  handleDeleteCheckPoint: () => void
}

function PointDescription({ index, lat, lng, handleDeleteCheckPoint }: Props) {

  return (
    <div className="flex flex-col w-full p-4 rounded-md bg-foreground-50">
      <div className="flex flex-1 justify-between items-center mb-4">
        <span className="text-foreground-700">Punto {index + 1}</span>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          radius="full"
          onPress={handleDeleteCheckPoint}
        >
          <span className="material-symbols-outlined !text-[16px]">close</span>
        </Button>
      </div>
      <span className="text-sm">Latitud: <span className="text-foreground-600">{lat}</span></span>
      <span className="text-sm">Longitud: <span className="text-foreground-600">{lng}</span></span>
    </div>
  );
}