"use client";
import Map from "@/components/visor/maps/Map";
import { useEffect } from "react";

export default function FieldMapLayout() {

  useEffect(() => {
    const userLocationInterval = setInterval(getUserLocation, 3000);

    function getUserLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Position... ");
          console.log(position.coords.latitude, position.coords.longitude);
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

  TRIED TO THIS

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
      <Map className="flex flex-1 w-full">
        XD
      </Map>
    </div>
  );
}