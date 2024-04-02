export function nAccesses(object: {
  visor: string | null;
  whats: string | null;
}) {
  return Object.values(object).filter((role) => role !== null).length;
}
