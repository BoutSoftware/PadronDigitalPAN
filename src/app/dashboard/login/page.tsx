'use client'

import React, { useContext, useState } from 'react'
import { Link, Input, Button, Skeleton } from "@nextui-org/react";
import Image from "next/image"
import Wave from "../../../../public/Ola-3.svg"

export default function Login() {

  // const { login } = useContext(AuthContext);
  // const [userName, setUserName] = useState("");
  // const [password, setPassword] = useState("");

  // const handleSubmit = async (e: { preventDefault: () => void; }) => {
  //   e.preventDefault();

  //   const reqBody = {
  //     username: userName,
  //     password: password
  //   }

  //   const resBody = await fetch("/api/admin/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(reqBody)
  //   }).then(res => res.json());

  //   if (resBody.code !== "OK") {
  //     alert(resBody.message);
  //     return;
  //   }

  //   login(resBody.data.token, resBody.data.type);
  // }


  return (
    <div className='h-screen overflow-hidden'>
      <div className="p-4">
        <header className="bg-background flex justify-between items-center min-h-12">
          <div className='flex flex-row gap-4 items-center'>
            <div id="image" className="w-16 h-16 bg-blue-200"></div>
            <h1 className="text-3xl font-normal text-[#113A5D]">Caminantes</h1>
          </div>

          {/* Development Credits */}
          <span className="text-small !text-gray-400">
            Desarrollado por <Link href="https://bout.sh" size="sm" className="text-gray-400" isExternal showAnchorIcon>Bout</Link>
          </span>
        </header>
        <div id='main' className='flex flex-row justify-between py-12 px-16 w-full'>
          <div id='form' className='flex flex-col gap-4 w-2/6'>
            <p className='text-2xl text-[#113A5D]'>Inicia sesión</p>
            <form className='flex flex-col gap-8'>
              <Input
                type="user"
                label="Usuario"
                placeholder='Usuario'
                labelPlacement='outside'
                size='sm'
                // value={userName}
                // onValueChange={setUserName}
                autoComplete="username"
                isRequired
                autoFocus
              />
              <Input
                type="password"
                label="Contraseña"
                placeholder='Contraseña'
                labelPlacement='outside'
                size='sm'
                // value={password}
                // onValueChange={setPassword}
                autoComplete="current-password"
                isRequired
              />
              <Button className='py-2 px-3 bg-[#FF3EA5] text-white w-28 md:w-32' type='submit'>
                Iniciar Sesión
              </Button>
            </form>
          </div>
          <div id="image" className="w-3/6 bg-blue-200"></div>
        </div>
      </div>
      <footer>
        <Image
          src={Wave}
          width={10}
          height={10}
          alt="Decoración"
          className='w-screen'
        />
        <div className='flex flex-row justify-between bg-[#163172] h-screen p-4 -mt-3'>
          <div className='flex flex-col gap-2'>
            <Skeleton className="h-3 w-36 rounded-lg bg-slate-50" />
            <Skeleton className="h-3 w-32 rounded-lg bg-slate-50" />
          </div>
          <div className='flex flex-col gap-2 text-center items-center'>
            <p className='text-xl text-slate-50'>Caminantes</p>
            <Skeleton className="h-3 w-36 rounded-lg bg-slate-50" />
            <Skeleton className="h-3 w-32 rounded-lg bg-slate-50" />
          </div>
          <div className='flex flex-col gap-2 items-end'>
            <Skeleton className="h-3 w-36 rounded-lg bg-slate-50" />
            <Skeleton className="h-3 w-32 rounded-lg bg-slate-50" />
          </div>
        </div>
      </footer>
    </div>
  );
}