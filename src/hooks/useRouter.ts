import { createContext, useEffect, useState } from 'react';

export type RouteName = string;
export type RouteParams = Record<string, string>;
export type Navigate = (name: RouteName, params: RouteParams) => void;

export interface Route {
  name: RouteName;
  label: string;
  path: string;
}

export interface RouterContextProps {
  route: Route;
  params: RouteParams;
  navigate: Navigate;
}

export const routes = [
  {
    name: 'prefix_check',
    label: 'Prefix Check',
    path: './',
  },
  {
    name: 'metrics',
    label: 'Metrics',
    path: './foo',
  },
  {
    name: 'repositories',
    label: 'Repositories',
    path: './repositories',
  },
  {
    name: 'connections',
    label: 'Connections',
    path: './connections',
  },
];

export function matchPath(path: string): Route {
  return routes.find((r) => r.path === path) || routes[0];
}

export function matchName(name: RouteName): Route {
  return routes.find((r) => r.name === name) || routes[0];
}

export const RouterContext = createContext<RouterContextProps>({
  route: routes[0],
  params: {},
  navigate: () => {},
});

export default function useRouter(): RouterContextProps {
  const currentPath = window.location.pathname;
  const [route, setRoute] = useState<Route>(matchPath(currentPath));

  const queryString = new URLSearchParams(window.location.search);
  const [params, setParams] = useState<RouteParams>(
    Object.fromEntries(queryString)
  );

  // handle back / forward events
  useEffect(() => {
    window.addEventListener('popstate', (event) => {
      if (event.state?.routeName) {
        setRoute(matchName(event.state.routeName));
      } else {
        setRoute(matchPath(window.location.pathname));
        setParams({});
      }
      if (event.state?.routeParams) {
        setParams(event.state.routeParams);
      }
    });
  }, []);

  // navigate to a new route
  const navigate = (name: RouteName, params: RouteParams) => {
    const newRoute = matchName(name);

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      const fullPath = `${newRoute.path}?${searchParams}`;
      window.history.pushState(
        { routeName: name, routeParams: params },
        '',
        fullPath
      );
      setRoute(newRoute);
      setParams(params);
    } else {
      window.history.pushState(
        { routeName: name, routeParams: {} },
        '',
        newRoute.path
      );
      setRoute(newRoute);
      setParams({});
    }
  };

  return {
    params,
    route,
    navigate,
  };
}
