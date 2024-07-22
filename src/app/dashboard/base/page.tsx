"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { Card, Skeleton, Button } from "@nextui-org/react";
import { BellSlashSvgrepoCom, CalculatorSvgrepoCom, TriangleSvgrepoCom } from "@/icons";

export default function BasePlatformWelcome() {
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleLoad = () => {
    setIsLoaded(!isLoaded);
  };

  return (
    <div className="flex flex-grow flex-col p-8">
      <Header title="Bienvenido" />
      <CalculatorSvgrepoCom fillColor="#ff0000" strokeColor="#ff00f0" size="5em"/>
      <CalculatorSvgrepoCom fillColor="#00ff00"/>
      <CalculatorSvgrepoCom fillColor="#0000ff" size="2em"/>
      <BellSlashSvgrepoCom fillColor="#ff00ff" size="3em"/>
      <TriangleSvgrepoCom fillColor="#00ffff" size="4em"/>


      {/* Welcome */}
      <section>
        <h2 className="py-4">Siguiente evento</h2>
        <Card className="w-[200px] space-y-5 p-4" radius="lg">
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>
      </section>

      {/* Next Events */}
      <section className="mt-12">
        <h2 className="">Proximos Eventos</h2>
        <div className="flex flex-row gap-8 mt-8">
          <Card className="w-[200px] space-y-5 p-4" radius="lg">
            <Skeleton isLoaded={isLoaded} className="rounded-lg">
              <div className="h-24 rounded-lg bg-secondary"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-300"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
              </Skeleton>
            </div>
            <div className="w-full text-right">
              <Button size="sm" variant="solid" color="secondary" onPress={toggleLoad} className="w-2/3">
                {isLoaded ? "Show" : "Hide"} Skeleton
              </Button>
            </div>
          </Card>
          <Card className="w-[200px] space-y-5 p-4" radius="lg">
            <Skeleton isLoaded={isLoaded} className="rounded-lg">
              <div className="h-24 rounded-lg bg-secondary"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-300"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
              </Skeleton>
            </div>
            <div className="w-full text-right">
              <Button size="sm" variant="solid" color="secondary" onPress={toggleLoad} className="w-2/3">
                {isLoaded ? "Show" : "Hide"} Skeleton
              </Button>
            </div>
          </Card>
          <Card className="w-[200px] space-y-5 p-4" radius="lg">
            <Skeleton isLoaded={isLoaded} className="rounded-lg">
              <div className="h-24 rounded-lg bg-secondary"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-300"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
              </Skeleton>
            </div>
            <div className="w-full text-right">
              <Button size="sm" variant="solid" color="secondary" onPress={toggleLoad} className="w-2/3">
                {isLoaded ? "Show" : "Hide"} Skeleton
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
