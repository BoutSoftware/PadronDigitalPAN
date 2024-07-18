"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { Card, Skeleton, Button } from "@nextui-org/react";
import FiltroModal from "@/components/visor/maps/FiltroModal";

export default function BasePlatformWelcome() {
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleLoad = () => {
    setIsLoaded(!isLoaded);
  };

  return (
    <div className="flex flex-grow flex-col p-8">
      <Header title="Bienvenido" />

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
        <FiltroModal/>
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
