import React from 'react';
import { routes } from '../hooks/useRouter';
import Link from './Link';
import Help from './Help';

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
        <Help>
          <h2>Introduction</h2>
          <p>
            This page displays statistics from the last validation run
            Routinator has performed.
          </p>
          <p>
            You can also use this page to verify the RPKI origin validation
            status of an AS Number and IP Prefix combination. You can enter an
            existing BGP announcement or an ASN and prefix of your choice, for
            example for an announcement you are planning to do.
          </p>
          <p>
            The returned RPKI validity state will be Valid, Invalid or Not Found
            and is based on the current set of Validated ROA Payloads (VRPs) in
            the cache. Routinator will provide an overview of all VRPs that led
            to the result, along with the reason for the outcome.
          </p>
          <h2>Quick Glossary</h2>
          <p>
            This overview provides a quick definition of the terms used in this
            user interface. For a complete overview, please refer to the
            <a
              href="https://rpki.readthedocs.io/en/latest/routinator/"
              rel="noreferrer"
              target="_blank"
            >
              Routinator documentation
            </a>
            .
          </p>
          <h3>Route Origin Attestation (ROA)</h3>
          <p>
            A cryptographically signed statement authorising one or more
            prefixes to be originated from a specific Autonomous System.
          </p>
          <h3>Validated ROA Payload (VRP)</h3>
          <p>
            A verified object that contains a single IP prefix, a maximum prefix
            length, and an origin AS number. When comparing the total set of
            VRPs to a BGP announcement, it can be RPKI Valid, Invalid or
            NotFound.
          </p>
          <h3>Unsafe VRP</h3>
          <p>
            VRPs that have IP address prefixes overlapping with resources of
            rejected Certificate Authorities (CAs)
          </p>
          <h3>Stale Object</h3>
          <p>
            An object is considered stale if the time given in their
            &quote;next-update&quote; field is in the past, indicating that an
            update to the object was scheduled but didn’t happen.
          </p>
          <h3>RPKI Repository Delta Protocol (RRDP)</h3>
          <p>
            A retrieval mechanism that relies on snapshot and delta files which
            are retrieved using HTTPS. It is designed to replace the original
            transport used for RPKI, rsync.
          </p>
          <h3>RPKI to Router (RTR) Protocol</h3>
          <p>A protocol to deliver VRPs to a router in a lightweight manner.</p>
        </Help>
      </menu>
    </header>
  );
}
