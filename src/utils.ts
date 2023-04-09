export const defaultTo64IfUndefined = (value: number | undefined): number =>
  typeof value === "number" ? value : 64;
