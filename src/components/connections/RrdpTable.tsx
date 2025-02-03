import React, { useContext, useState } from 'react';
import { t, tryFormatNumber } from '../../core/util';
import { Rrdp } from '../../types';
import Duration from './Duration';
import { StatusContext } from '../../hooks/useStatus';

type RrdpKey = keyof Rrdp;

const RRDP_FIELDS: RrdpKey[] = [
  'duration',
  'status',
  'notifyStatus',
  'payloadStatus',
  'serial',
  'delta',
  'snapshot_reason',
  'session',
];

export default function RrdpTable() {
  const { status } = useContext(StatusContext);
  const [sort, setSort] = useState<RrdpKey | null>(null);
  let values = Object.entries(status.rrdp);
  values = values.sort((a, b) => {
    if (sort === null) {
      return a[0].localeCompare(b[0]);
    } else if (typeof a[1][sort] === "number") {
      return ((b[1][sort] as number) || 0) - ((a[1][sort] as number) || 0);
    } else {
      return ("" + a[1][sort]).localeCompare("" + b[1][sort])
    }
  });


  const maxDuration = Object.values(status.rrdp).reduce(
    (acc, i) => Math.max(acc, i.duration),
    0
  );

  return (
    <div id="rrdp" className="scroll-table">
      <div>
        <table>
          <thead>
            <tr>
              <th
                onClick={() => setSort(null)}
                className={`${sort === null ? 'active' : ''}`}                
              >URL</th>
              {RRDP_FIELDS.map((key) => (
                <th key={key}
                  onClick={() => setSort(key)}
                  className={`${sort === key ? 'active' : ''}`}
>{t(`connections.${key}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values.map(([key, rrdp]: [string, Rrdp]) => (
              <tr key={key}>
                <th role="column" title={key}>
                  <a href={key} target="_blank" rel="noreferrer">
                    {key}
                  </a>
                </th>
                <td>
                  <Duration value={rrdp.duration} max={maxDuration} />
                </td>
                {RRDP_FIELDS.slice(1).map((key: RrdpKey) => (
                  <td key={key}>{tryFormatNumber(rrdp[key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
