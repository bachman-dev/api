import type Router from "find-my-way";
import { apiVersion } from "@bachman-dev/api-types";

const calVersionConstraint: Router.ConstraintStrategy<Router.HTTPVersion.V1, unknown> = {
  name: "version",
  deriveConstraint: (req) => req.headers["x-api-version"],
  storage: () => {
    const versions: Record<string, Router.Handler<Router.HTTPVersion.V1>> = {};
    return {
      get: (version): Router.Handler<Router.HTTPVersion.V1> | null => {
        if (typeof version === "string") {
          const result = apiVersion.safeParse(version);
          if (!result.success) {
            return null;
          }
          let foundVersion: string | null = null;
          Object.keys(versions).forEach((key) => {
            if (new Date(key) <= new Date(version)) {
              foundVersion = key;
            }
          });
          if (typeof foundVersion === "string" && typeof versions[foundVersion] !== "undefined") {
            return versions[foundVersion] ?? null;
          }
          return null;
        }
        return null;
      },
      set: (version, store): void => {
        if (typeof version !== "string") {
          throw new TypeError("Version must be a string.");
        }
        apiVersion.parse(version);
        versions[version] = store;
      },
    };
  },
  validate(value) {
    apiVersion.parse(value);
  },
};

export default calVersionConstraint;
