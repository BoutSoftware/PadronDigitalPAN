"use client";
import Circle from "@/components/visor/maps/Circle";
import Map from "@/components/visor/maps/Map";
import { useEffect, useState } from "react";

interface Location {
  lat: number
  lng: number
}

export default function FieldMapLayout() {
  const [userLocation, setUserLocation] = useState<Location | undefined>(undefined);

  useEffect(() => {
    const userLocationInterval = setInterval(getUserLocation, 3000);

    function getUserLocation() {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          console.log("Position... ", latitude, longitude);
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => console.log("Error: ", err),
        {
          maximumAge: 0
        }
      );
    }

    return () => {
      clearInterval(userLocationInterval);
    };
  }, []);
  /*

  TRIED TO DO THIS

  The following should work as the previous, but it doesn´t

  navigator.geolocation.watchPosition(
    (position) => {
      console.log("Position");
      console.log(position.coords.longitude, position.coords.latitude);
    },
    (err) => console.log("Error: ", err),
    {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0
    }
  );
  */

  return (
    <div className="flex flex-col flex-1 w-full">
      {

        <Map className="flex flex-1 w-full" center={userLocation} zoom={18}>
          {
            userLocation ? (
              <Circle
                center={userLocation}
                radius={10}
                fillColor="#4592D8"
                fillOpacity={0.8}
                strokeWeight={4}
                strokeColor="#E2E2E2"
              />
            ) : (
              <></>
            )
          }
        </Map>
      }
    </div>
  );
}