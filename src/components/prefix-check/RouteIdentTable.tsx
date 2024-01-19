import React from 'react';
import { RouteIdent } from '../../types';
import { t } from '../../core/util';

export interface RouteIdentTableProps {
  type: string;
  routeIdents: RouteIdent[];
}

export default function RouteIdentTable({
  type,
  routeIdents,
}: RouteIdentTableProps) {
  return (
    <div className={type}>
      <h5>{t(`home.${type}`)}</h5>
      <table>
        <thead>
          <tr>
            <th className="prefix-container">{t('common.prefix')}</th>
            <th>{t('common.maxlength')}</th>
            <th>{t('common.asn')}</th>
          </tr>
        </thead>
        <tbody>
          {/* FIXME */}
          {routeIdents.map((route, index) => (
            <tr
              key={JSON.stringify(route)}
              className={index % 2 === 0 ? 'even' : 'odd'}
            >
              <td className="prefix-container">{route.prefix}</td>
              <td>{route.max_length}</td>
              <td>{route.asn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
