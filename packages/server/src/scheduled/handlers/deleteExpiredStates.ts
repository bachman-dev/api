import type { Env } from "../../types/cloudflare.js";
import { getDrizzle } from "../../db/index.js";
import { inArray } from "drizzle-orm";
import { twitchClientStates } from "../../db/schema.js";

const deleteExpiredStates: ExportedHandlerScheduledHandler<Env> = async (_controller, env, _context) => {
  const drizzle = getDrizzle(env.DB);
  const states = await drizzle.query.twitchClientStates.findMany({
    where: (state, { lt }) => lt(state.expires, new Date()),
  });
  const stateIds = states.map((state) => state.codeChallenge);
  await drizzle.delete(twitchClientStates).where(inArray(twitchClientStates.codeChallenge, stateIds));
};

export default deleteExpiredStates;
