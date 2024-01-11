import React from 'react';
import { routes } from '../hooks/useRouter';
import Link from './Link';

export default function Nav() {
  return (
    <header>
      <h1>
        <span>Routinator</span>
      </h1>
      <menu>
        <ul>
          {routes.map(({ name }) => (
            <li key={name}>
              <Link routeName={name} />
            </li>
          ))}
        </ul>
      </menu>
    </header>
  );
}
