"use server";

import { cookies } from "next/headers";

export async function getCookie(name: string) {
  const cookieStore = cookies();
  return cookieStore.get(name)?.value;
}

export async function setCookie(name: string, value: string) {
  const cookieStore = cookies();
  cookieStore.set(name, value, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function deleteCookie(name: string) {
  const cookieStore = cookies();
  cookieStore.delete(name);
}

