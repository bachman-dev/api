import type { Env } from "../types/cloudflare.js";

export default function getOrigin(env: Env): string {
  return ["true", "yes", "on", "enabled"].includes(env.USE_LOCAL_HOST)
    ? `http://localhost:8787`
    : `https://api.bachman.dev`;
}
