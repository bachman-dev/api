import { initContract } from "@ts-rest/core";
import { z } from "zod";

const tsr = initContract();

const contract = tsr.router({
  sayHello: {
    method: "GET",
    path: "/",
    responses: {
      200: z.object({
        greeting: z.literal("Hello, World!"),
      }),
    },
  },
});

export default contract;
