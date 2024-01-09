import React, { useContext, useState } from 'react';
import { t } from '../core/util';
import { Repository } from '../types';
import { StatusContext } from '../hooks/useStatus';

type RepositoryKey = keyof Repository;

const columns: RepositoryKey[] = [
  'repository',
  'type',
  'vrpsTotal',
  'vrpsUnsafe',
  'vrpsLocallyFiltered',
  'vrpsDuplicate',
  'vrpsFinal',
  'validPublicationPoints',
  'rejectedPublicationPoints',
  'validManifests',
  'invalidManifests',
  'staleManifests',
  'missingManifests',
  'validCRLs',
  'invalidCRLs',
  'staleCRLs',
  'strayCRLs',
  'validCACerts',
  'validEECerts',
  'invalidCerts',
  'validROAs',
  'invalidROAs',
  'validGBRs',
  'invalidGBRs',
  'otherObjects',
];

export default function Repositories() {
  const { status } = useContext(StatusContext);
  const [sort, setSort] = useState<RepositoryKey | null>(null);
  let values = Object.entries(status.repositories);

  if (sort) {
    values = values.sort((a, b) => {
      return ((b[1][sort] as number) || 0) - ((a[1][sort] as number) || 0);
    });
  }

  return (
    <div id="repositories" className="scroll-table">
      <div>
        <table>
          <thead>
            <tr>
              {columns.map((key) => (
                <th
                  key={key}
                  onClick={() => setSort(key)}
                  className={`${sort === key ? 'active' : ''}`}
                >
                  {t(`repositories.${key}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values.map(([key, repository]: [string, Repository]) => (
              <tr key={key}>
                <th scope="row" title={key}>
                  <a href={key} target="_blank" rel="noreferrer">
                    {key}
                  </a>
                </th>
                {columns.slice(1).map((key: RepositoryKey) => (
                  <td key={key}>
                    {(repository[key] || 0).toLocaleString('en')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
