import React, { Fragment, useContext } from 'react';
import { t } from '../core/util';
import { StatusContext } from '../hooks/useStatus';

const METRICS = [
  {
    group: 'tal-detailed.ROAs',
    fields: {
      'tal-detailed.valid': 'validROAs',
      'tal-detailed.invalid': 'invalidROAs',
    },
  },
  {
    group: 'tal-detailed.VRPs',
    fields: {
      'tal-detailed.total': 'vrpsTotal',
      'tal-detailed.unsafe': 'vrpsUnsafe',
      'tal-detailed.duplicate': 'vrpsDuplicate',
      'tal-detailed.final': 'vrpsFinal',
      'tal-detailed.locallyFiltered': 'vrpsLocallyFiltered',
    },
  },
  {
    group: 'tal-detailed.publicationPoints',
    fields: {
      'tal-detailed.valid': 'validPublicationPoints',
      'tal-detailed.rejected': 'rejectedPublicationPoints',
    },
  },
  {
    group: 'tal-detailed.manifests',
    fields: {
      'tal-detailed.valid': 'validManifests',
      'tal-detailed.invalid': 'invalidManifests',
      'tal-detailed.stale': 'staleManifests',
      'tal-detailed.missing': 'missingManifests',
    },
  },
  {
    group: 'tal-detailed.CRLs',
    fields: {
      'tal-detailed.valid': 'validCRLs',
      'tal-detailed.invalid': 'invalidCRLs',
      'tal-detailed.stale': 'staleCRLs',
      'tal-detailed.stray': 'strayCRLs',
    },
  },
  {
    group: 'tal-detailed.certs',
    fields: {
      'tal-detailed.validCA': 'validCACerts',
      'tal-detailed.validEE': 'validEECerts',
      'tal-detailed.invalid': 'invalidCerts',
    },
  },
  {
    group: 'tal-detailed.GBRs',
    fields: {
      'tal-detailed.valid': 'validGBRs',
      'tal-detailed.invalid': 'invalidGBRs',
    },
  },
  {
    group: 'tal-detailed.otherObjects',
    fields: {
      'tal-detailed.otherObjects': 'otherObjects',
    },
  },
];

export default function Metrics() {
  const { status } = useContext(StatusContext);

  return (
    <div id="metrics">
      {Object.entries(status.tals).map(([talName, tal]) => (
        <div key={talName}>
          <h4 className={talName}>{talName}</h4>
          {METRICS.map(({ group, fields }) => (
            <Fragment key={group}>
              <h5>{t(group)}</h5>
              <dl>
                {Object.entries(fields).map(([key, value]) => (
                  <Fragment key={key}>
                    {group !== key && <dt>{t(key)}</dt>}
                    <dd>{(tal[value] || 0).toLocaleString('en')}</dd>
                  </Fragment>
                ))}
              </dl>
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
