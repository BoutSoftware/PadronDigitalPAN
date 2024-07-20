"use server";

import { cookies } from "next/headers";

export const getCookie = async (name: string) => {
  cookies().get(name)?.value;
};

export const setCookie = async (name: string, value: string) => {
  cookies().set(name, value, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};

export const deleteCookie = async (name: string) => {
  cookies().delete(name);
};



