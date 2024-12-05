"use client";

import { Button, Input } from "@nextui-org/react";
import React from "react";

export default function DirectoryPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Directorio</h1>

      <section className="w-full max-w-sm">
        <h2 className="text-xl font-semibold">Crear Persona</h2>

        <CreatePersonForm />
      </section>
    </main>
  );
}

function CreatePersonForm() {
  const [form, setForm] = React.useState({
    name: "",
    fatherLastName: "",
    motherLastName: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resBody = await fetch("/dashboard/api/directory/persons", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (resBody.code !== "OK") {
      console.error(resBody.message);
      alert("Ocurrió un error al crear la persona");
      return;
    }

    alert("Persona creada exitosamente");
    setForm({
      name: "",
      fatherLastName: "",
      motherLastName: "",
      email: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Apellido Paterno" value={form.fatherLastName} onChange={(e) => setForm({ ...form, fatherLastName: e.target.value })} />
      <Input label="Apellido Materno" value={form.motherLastName} onChange={(e) => setForm({ ...form, motherLastName: e.target.value })} />
      <Input label="Correo Electrónico" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <Button type="submit">Crear</Button>
    </form>
  );
}