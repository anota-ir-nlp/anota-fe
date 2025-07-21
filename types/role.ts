export const ParkirRole = [
  "admin",
  "verifikator",
  "operator_mitra",
  "user",
] as const;
export type ParkirRole = (typeof ParkirRole)[number];

export const keycloakUserRoleToParkirRole = (role: string): ParkirRole => {
  let roleMap: Record<ParkirRole, string[]> = {
    admin: ["admin"],
    verifikator: ["verifikator"],
    operator_mitra: ["operator_mitra"],
    user: ["mahasiswa", "staf", "dosen", "Non-Civitas"],
  };

  for (const [key, value] of Object.entries(roleMap)) {
    if (value.includes(role)) {
      return key as ParkirRole;
    }
  }
  throw new Error(`Unknown role: ${role}`);
};

export const AnotaRoles = [
  "Anotator",
  "Peninjau",
  "Admin",
  "Kepala Riset",
] as const;
export type AnotaRole = (typeof AnotaRoles)[number];
