'use client'

import React from "react";
import Header from "@/components/Header";
import { Button } from "@nextui-org/react";
import Roles from "@/components/Roles";

export default function IndividualUserPage() {
  const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div>
      <Header title="Nombre de Usuario" />
      <div id="main" className="w-3/4 h-full m-8">
        <div id="userInfo" className="flex flex-row mt-8 gap-8">
          <div id="image" className="w-48 h-48 bg-blue-200"></div>
          <div className="flex flex-row gap-x-8">
            <div className="flex flex-col gap-4">
              <p>Nombre: Nombre de la persona</p>
              <p>Número telefónico: 000 000 0000</p>
              <p>CURP: Contenido de la CURP</p>
              <div className="mt-8">
                <Button startContent={<span className="material-symbols-outlined">
                  lock
                </span>} className="bg-white drop-shadow-md">
                  Cambiar contraseña
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p>Admin: 4 módulos</p>
              <p>Estado: Activo</p>
              <p>Usuario: Nombre de usuario</p>
              <div className="mt-8">
                <Button startContent={<span className="material-symbols-outlined">
                  account_tree
                </span>} className="bg-white drop-shadow-md">
                  Llevar a la estructura
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div id="roles" className="flex flex-col mt-16 border shadow-lg p-8 rounded-xl">
          <h1 className="text-4xl">Roles</h1>
          <div className="flex flex-col gap-4 mt-4">
            {numeros.map((numero) => (
              <div key={numero}>
                <Roles key={numero} numero={numero} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
