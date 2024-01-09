import React, { useContext } from 'react';
import { t, tryFormatNumber } from '../../core/util';
import { Rsync } from '../../types';
import Duration from './Duration';
import { StatusContext } from '../../hooks/useStatus';

type RsyncKey = keyof Rsync;

const RSYNC_FIELDS: RsyncKey[] = ['duration', 'status'];

export default function RsyncTable() {
  const { status } = useContext(StatusContext);
  const maxDuration = Object.values(status.rsync).reduce(
    (acc, i) => Math.max(acc, i.duration),
    0
  );

  return (
    <div id="rsync" className="scroll-table">
      <div>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              {RSYNC_FIELDS.map((key) => (
                <th key={key}>{t(`connections.${key}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(status.rsync).map(
              ([key, rsync]: [string, Rsync]) => (
                <tr key={key}>
                  <th role="column" title={key}>
                    <a href={key} target="_blank" rel="noreferrer">
                      {key}
                    </a>
                  </th>
                  <td>
                    <Duration value={rsync.duration} max={maxDuration} />
                  </td>
                  {RSYNC_FIELDS.slice(1).map((key: RsyncKey) => (
                    <td key={key}>{tryFormatNumber(rsync[key])}</td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
