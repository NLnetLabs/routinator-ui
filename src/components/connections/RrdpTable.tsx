import React, { useContext } from 'react';
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
              <th>URL</th>
              {RRDP_FIELDS.map((key) => (
                <th key={key}>{t(`connections.${key}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(status.rrdp).map(([key, rrdp]: [string, Rrdp]) => (
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
