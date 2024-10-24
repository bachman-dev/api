import type { Env } from "../types/cloudflare.js";
import deleteExpiredStates from "./handlers/deleteExpiredStates.js";

const everyMinute: ExportedHandlerScheduledHandler<Env> = async (controller, env, context) => {
  await deleteExpiredStates(controller, env, context);
};

export default everyMinute;
