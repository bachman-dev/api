import type { Route } from "@bachman-dev/api-types";

export default function validateRoutes(contractRoutes: Route[], setRoutes: Route[]): void {
  const missingRoutes: Route[] = [];
  contractRoutes.forEach((route) => {
    const isRouteFound = setRoutes.find(
      (searchRoute) => searchRoute.method === route.method && searchRoute.path === route.path,
    );
    if (!isRouteFound) {
      missingRoutes.push(route);
    }
  });
  if (missingRoutes.length > 0) {
    const errorText = `Server Missing Routes from Contract:`;
    console.error(errorText);
    missingRoutes.forEach((route) => {
      console.error(`  - ${route.method} ${route.path}`);
    });
    throw new Error(errorText);
  }
}
