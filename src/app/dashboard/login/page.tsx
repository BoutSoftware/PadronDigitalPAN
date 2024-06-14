"use client";

import React, { useContext, useState } from "react";
import { Link, Input, Button, Skeleton } from "@nextui-org/react";
import Image from "next/image";
import Wave from "../../../../public/Ola-3.svg";
import { authContext } from "@/contexts/AuthContext";

export default function Login() {
  const { login } = useContext(authContext);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const reqBody = {
      username: userName,
      password: password,
    };

    try {
      const res = await fetch("/dashboard/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      const resBody = await res.json();

      if (resBody.code !== "OK") {
        throw new Error(resBody.message);
      }

      login(resBody.data.token);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col justify-between items-center">
      <header className="flex justify-between items-center p-8 w-full">
        <div className="flex flex-row gap-4 items-center">
          <div id="image" className="w-16 h-16 bg-content3"></div>
          <h1 className="text-3xl font-normal text-foreground">Caminantes</h1>
        </div>

        {/* Development Credits */}
        <span className="text-small !text-gray-400">
          Desarrollado por{" "}
          <Link
            href="https://bout.sh"
            size="sm"
            className="text-gray-400"
            isExternal
            showAnchorIcon
          >
            Bout
          </Link>
        </span>
      </header >

      <div className="flex flex-row justify-between max-w-5xl w-full px-16">
        <div className="flex flex-col gap-4 w-2/6">
          <h2 className="text-2xl text-foreground">Inicia sesión</h2>

          <form
            className="flex flex-col items-start gap-8"
            onSubmit={handleSubmit}
          >
            <Input
              type="user"
              label="Usuario"
              placeholder="Usuario"
              labelPlacement="outside"
              value={userName}
              onValueChange={setUserName}
              autoComplete="username"
              isRequired
              autoFocus
            />
            <Input
              type="password"
              label="Contraseña"
              placeholder="Contraseña"
              labelPlacement="outside"
              value={password}
              onValueChange={setPassword}
              autoComplete="current-password"
              isRequired
            />
            <Button className="py-2 px-3 bg-accent text-white" type="submit">
              Iniciar Sesión
            </Button>
          </form>
        </div>

        {/* TODO: Add image */}
        <div id="image" className="w-3/6 bg-content3"></div>
      </div>

      <footer>
        <Image
          src={Wave}
          width={10}
          height={10}
          alt="Decoración"
          className="w-screen h-20"
        />

        <div className="flex flex-row justify-between bg-secondary p-8 -mt-1">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-36 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-lg" />
          </div>
          <div className="flex flex-col gap-2 text-center items-center">
            <p className="text-xl text-primary-foreground">Caminantes</p>
            <Skeleton className="h-3 w-36 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-lg" />
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Skeleton className="h-3 w-36 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-lg" />
          </div>
        </div>
      </footer>
    </div >
  );
}
