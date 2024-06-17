import React, { useContext } from 'react';
import {
  RouteName,
  RouteParams,
  RouterContext,
  matchName,
} from '../hooks/useRouter';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  routeName?: RouteName;
  params?: RouteParams;
  keepParams?: boolean;
  onClick?: () => void;
}

export default function Link({
  routeName,
  params,
  keepParams,
  className,
  onClick,
  ...props
}: LinkProps) {
  const {
    route: currentRoute,
    params: currentParams,
    navigate,
  } = useContext(RouterContext);
  const targetRouteName = routeName || currentRoute.name;
  const targetParams = keepParams
    ? { ...currentParams, ...(params || {}) }
    : params || {};
  const route = matchName(targetRouteName);
  const active = currentRoute.name === targetRouteName;
  const fullClassName = `${className || ''} ${active ? 'active' : ''}`.trim();
  const click = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    navigate(targetRouteName, targetParams);
  };
  const displayPath = `.${route.path}`;

  return (
    <a {...props} href={displayPath} className={fullClassName} onClick={click}>
      {props.children || route.label}
    </a>
  );
}
