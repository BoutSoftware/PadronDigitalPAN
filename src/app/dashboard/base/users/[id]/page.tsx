"use client";

import React from "react";
import Header from "@/components/Header";
import { Button, Divider } from "@nextui-org/react";
import Roles from "@/components/Roles";

export default function IndividualUserPage() {
  const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="flex flex-grow flex-col p-8">
      <Header title="[Nombre de Persona]" />

      <main id="main" className="mt-4">
        <div id="userInfoContainer" className="flex flex-row mt-8 gap-8">
          <div id="image" className="w-48 h-48 bg-blue-200"></div>
          <div id="userInfo" className="flex flex-row gap-x-8">
            <div className="flex flex-col gap-4">
              <p>Nombre: Nombre de la persona</p>
              <p>Número telefónico: 000 000 0000</p>
              <p>CURP: Contenido de la CURP</p>
              <div className="mt-8">
                <Button
                  startContent={<span className="material-symbols-outlined">lock</span>}
                  className="bg-content1 drop-shadow-md"
                >
                  Cambiar contraseña
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p>Admin: 4 módulos</p>
              <p>Estado: Activo</p>
              <p>Usuario: Nombre de usuario</p>
              <div className="mt-8">
                <Button
                  startContent={<span className="material-symbols-outlined">account_tree</span>}
                  className="bg-content1 drop-shadow-md"
                >
                  Llevar a la estructura
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-10 max-w-5xl" />

        <div id="roles" className="flex flex-col p-8 rounded-xl max-w-4xl border border-divider shadow-lg">
          <h1 className="text-4xl">Roles</h1>
          <div className="flex flex-col gap-6 mt-4">
            {numeros.map((numero) => (
              <Roles key={numero} numero={numero} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
