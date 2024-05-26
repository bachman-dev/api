import type { HTTPMethods, RouteOptions } from "fastify";
import type { Route } from "@bachman-dev/api-types";

export default function collectSetRoutes(
  routeOptions: RouteOptions,
  contractRoutes: Route[],
  setRoutes: Route[],
): void {
  console.log(contractRoutes);
  let method: HTTPMethods = "GET";
  if (Array.isArray(routeOptions.method)) {
    method = routeOptions.method[0] ?? "GET";
  } else {
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring
    method = routeOptions.method;
  }
  const checkedRoute: Route = {
    method: "GET",
    path: routeOptions.url,
  };
  switch (method) {
    case "DELETE":
    case "delete":
      checkedRoute.method = "DELETE";
      break;
    case "GET":
      break;
    case "get":
      checkedRoute.method = "GET";
      break;
    case "HEAD":
    case "head":
      checkedRoute.method = "HEAD";
      break;
    case "OPTIONS":
    case "options":
      checkedRoute.method = "OPTIONS";
      break;
    case "PATCH":
    case "patch":
      checkedRoute.method = "PATCH";
      break;
    case "POST":
    case "post":
      checkedRoute.method = "POST";
      break;
    case "PUT":
    case "put":
      checkedRoute.method = "PUT";
      break;
    default:
      throw new Error(`Unsupported Set Route Method ${method}`);
  }
  const foundRoute = contractRoutes.find(
    (route) => route.method === checkedRoute.method && route.path === checkedRoute.path,
  );
  if (typeof foundRoute === "undefined") {
    throw new Error(`Set Route Not Found in Contract: ${method} ${routeOptions.url}`);
  }
  setRoutes.push(checkedRoute);
}
