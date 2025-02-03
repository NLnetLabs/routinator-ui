import React, { useContext, useState } from 'react';
import { t, tryFormatNumber } from '../../core/util';
import { Rsync } from '../../types';
import Duration from './Duration';
import { StatusContext } from '../../hooks/useStatus';

type RsyncKey = keyof Rsync;

const RSYNC_FIELDS: RsyncKey[] = ['duration', 'status'];

export default function RsyncTable() {
  const { status } = useContext(StatusContext);
  const [sort, setSort] = useState<RsyncKey | null>(null);
  let values = Object.entries(status.rsync);
  values = values.sort((a, b) => {
    if (sort === null) {
      return a[0].localeCompare(b[0]);
    } else if (typeof a[1][sort] === "number") {
      return ((b[1][sort] as number) || 0) - ((a[1][sort] as number) || 0);
    } else {
      return ("" + a[1][sort]).localeCompare("" + b[1][sort])
    }
  });

  

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
              <th
                onClick={() => setSort(null)}
                className={`${sort === null ? 'active' : ''}`}                                
              >URL</th>
              {RSYNC_FIELDS.map((key) => (
                <th key={key}
                  onClick={() => setSort(key)}
                  className={`${sort === key ? 'active' : ''}`}
                >{t(`connections.${key}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values.map(
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
