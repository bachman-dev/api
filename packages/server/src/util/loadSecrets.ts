import { InfisicalClient } from "@infisical/sdk";

export default async function loadSecrets(): Promise<void> {
  if (
    typeof process.env.INFISICAL_UNIVERSAL_AUTH_CLIENT_ID === "undefined" ||
    typeof process.env.INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET === "undefined" ||
    typeof process.env.INFISICAL_ENV === "undefined"
  ) {
    throw new Error("Missing Environment Variables for Infisical.");
  }

  const infisical = new InfisicalClient({});

  await infisical.listSecrets({
    projectId: "e51d5e47-977e-45e2-8fee-7720e1e6838f",
    environment: process.env.INFISICAL_ENV,
    path: "/node/api",
    attachToProcessEnv: true,
  });
}
