import React, { useContext } from 'react';
import { StatusContext } from '../hooks/useStatus';

export default function Footer() {
  const { status } = useContext(StatusContext);

  return (
    <footer>
      <div>
        <span>&copy; {new Date().getFullYear()} Stichting NLnet Labs</span>
        <span>-</span>
        <span>Version {status.version}</span>
        <span>-</span>
        <span>UI version {APP_VERSION || 'dev'}</span>
      </div>
      <div>
        <a
          href="https://nlnetlabs.nl/services/contracts/"
          target="_blank"
          rel="noreferrer"
        >
          Support contracts
        </a>
        <span>-</span>
        <a
          href="https://routinator.docs.nlnetlabs.nl/"
          target="_blank"
          rel="noreferrer"
        >
          Documentation
        </a>
        <span>-</span>
        <a
          href="https://github.com/NLnetLabs/routinator/issues/new"
          target="_blank"
          rel="noreferrer"
        >
          Report a problem
        </a>
      </div>
    </footer>
  );
}
