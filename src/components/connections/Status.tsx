import React, { useContext } from 'react';
import { formatDate, t } from '../../core/util';
import { StatusContext } from '../../hooks/useStatus';

export default function Status() {
  const { status } = useContext(StatusContext);

  return (
    <dl className="status-list">
      <dt>{t('connections.serial')}</dt>
      <dd>{status.serial}</dd>
      <dt>{t('connections.lastupdatestart')}</dt>
      <dd>{formatDate(status.lastUpdateStart)}</dd>
      <dt>{t('connections.lastupdateend')}</dt>
      <dd>{formatDate(status.lastUpdateDone)}</dd>
      <dt>{t('connections.lastupdateduration')}</dt>
      <dd>
        {status.lastUpdateDuration} {t('connections.seconds')}
      </dd>
      <dt>{t('connections.vrpsaddedlocally')}</dt>
      <dd>{status.vrpsAddedLocally}</dd>
      <dt>RTR</dt>
      <dd>
        <dl>
          <dt>{t('connections.currentconnections')}</dt>
          <dd>{status.rtr.currentConnections}</dd>
          <dt>{t('connections.bytesread')}</dt>
          <dd>{status.rtr.bytesRead.toLocaleString('en')}</dd>
          <dt>{t('connections.byteswritten')}</dt>
          <dd>{status.rtr.bytesWritten.toLocaleString('en')}</dd>
        </dl>
      </dd>
      <dt>HTTP</dt>
      <dd>
        <dl>
          <dt>{t('connections.totalconnections')}</dt>
          <dd>{status.http.totalConnections.toLocaleString('en')}</dd>
          <dt>{t('connections.currentconnections')}</dt>
          <dd>{status.http.currentConnections.toLocaleString('en')}</dd>
          <dt>{t('connections.requests')}</dt>
          <dd>{status.http.requests.toLocaleString('en')}</dd>
          <dt>{t('connections.bytesread')}</dt>
          <dd>{status.http.bytesRead.toLocaleString('en')}</dd>
          <dt>{t('connections.byteswritten')}</dt>
          <dd>{status.http.bytesWritten.toLocaleString('en')}</dd>
        </dl>
      </dd>
    </dl>
  );
}
