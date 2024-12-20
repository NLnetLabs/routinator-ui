import React, { JSX, useContext } from 'react';
import { formatDate, timeAgo } from '../../core/util';
import { StatusContext } from '../../hooks/useStatus';
import Help from '../Help';

export default function DataFreshness(): JSX.Element {
  const { status, roto } = useContext(StatusContext);
  const bgpStatus = roto?.sources.find((s) => s.type === 'bgp')?.lastUpdated;
  const ra = roto?.sources
    .filter((s) => s.type === 'rir-alloc')
    .sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated));

  return (
    <div id="data-freshness">
      <h2>
        Data Freshness
        <Help>
          <h2>Data Sources</h2>
          <h3>RPKI</h3>
          <p>
            Data collected from the RPKI Trust Anchors and Publication Servers.
            Update interval in the order of minutes.
          </p>
          <h3>BGP</h3>
          <p>
            <a href="https://www.ris.ripe.net/dumps/">RISWhois</a> data,
            collected from the RIPE NCC
            <br />
            <a href="https://ris.ripe.net">Route Information Service</a>.
            Updated every 8 hours.
          </p>
          <h3>RIR Allocations</h3>
          <p>
            Delegated-extended statistics from all five Regional Internet
            Registries (RIRs). Updated daily.
          </p>
          <ul>
            <li>
              <a href="https://ftp.afrinic.net/pub/stats/afrinic/delegated-afrinic-extended-latest">
                AFRINIC
              </a>
            </li>
            <li>
              <a href="https://ftp.apnic.net/stats/apnic/delegated-apnic-extended-latest">
                APNIC
              </a>
            </li>
            <li>
              <a href="https://ftp.arin.net/pub/stats/arin/delegated-arin-extended-latest">
                ARIN
              </a>
            </li>
            <li>
              <a href="https://ftp.lacnic.net/pub/stats/lacnic/delegated-lacnic-extended-latest">
                LACNIC
              </a>
            </li>
            <li>
              <a href="https://ftp.ripe.net/pub/stats/ripencc/delegated-ripencc-extended-latest">
                RIPE NCC
              </a>
            </li>
          </ul>
        </Help>
      </h2>
      <table>
        <tbody>
          <tr>
            <th scope="row">RPKI</th>
            <td>
              <pre>{formatDate(status.lastUpdateDone)}</pre>
              <span className="ago">({timeAgo(status.lastUpdateDone)})</span>
            </td>
          </tr>
          {bgpStatus && (
            <tr>
              <th scope="row">BGP</th>
              <td>
                <pre>{formatDate(bgpStatus)}</pre>
                <span className="ago">({timeAgo(bgpStatus)})</span>
              </td>
            </tr>
          )}
          {ra && (
            <tr>
              <th scope="row">RIR</th>
              <td>
                {ra.map(r => (<span key={r.id}><span>{r.id.toUpperCase()}</span> <pre>{formatDate(r.lastUpdated)}</pre></span>))}
                <span className="ago">({timeAgo(ra[ra.length - 1].lastUpdated)})</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
