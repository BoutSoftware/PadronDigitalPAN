export function hasIncompleteFields(object: object) {
  return Object.values(object).some((value) => value === undefined || value === null);
  // return Object.entries(object).filter(([, value]) => value === undefined || value === null);
}

export function hasPermission<Role>(currentRole: Role | null, rolesAllowed: (Role | null)[]) {
  return rolesAllowed.includes(currentRole) || currentRole === "Admin";
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const generatePassword = (length: number, numbers: boolean, caps: boolean, symbols: boolean) => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const symbs = "@#$%&*()_+-/";

  length = Number(length);
  numbers = numbers === true;
  caps = caps === true;
  symbols = symbols === true;

  let password = "";
  let charSet = lower;
  charSet += numbers ? nums : "";
  charSet += caps ? upper : "";
  charSet += symbols ? symbs : "";

  let valid = false;
  while (!valid) {
    password = "";
    for (let i = 0; i < length; i++) {
      password += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    valid = true;
    if (numbers && !password.match(/[\d]/)) {
      valid = false;
    }
    if (caps && !password.match(/[A-Z]/)) {
      valid = false;
    }
    if (symbols && !password.match(/[\W]/)) {
      valid = false;
    }
  }

  return password;
};