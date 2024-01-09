import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
import PrefixCheck from './PrefixCheck';
import useRouter, { RouterContext } from '../hooks/useRouter';
import Metrics from './Metrics';
import useStatus, { StatusContext } from '../hooks/useStatus';
import Repositories from './Repositories';
import Connections from './Connections';

export default function App() {
  const routerState = useRouter();
  const { status, roto } = useStatus();
  const routeName = routerState.route.name;

  return (
    <RouterContext.Provider value={routerState}>
      <Nav />
      {status && (
        <StatusContext.Provider value={{ status, roto }}>
          <div className={`content route-${routeName}`}>
            {routeName === 'prefix_check' && <PrefixCheck />}
            {routeName === 'metrics' && <Metrics />}
            {routeName === 'repositories' && <Repositories />}
            {routeName === 'connections' && <Connections />}
          </div>
          <Footer />
        </StatusContext.Provider>
      )}
    </RouterContext.Provider>
  );
}
