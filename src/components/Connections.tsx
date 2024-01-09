import React from 'react';
import RrdpTable from './connections/RrdpTable';
import RsyncTable from './connections/RsyncTable';
import Status from './connections/Status';

export default function Connections() {
  return (
    <div id="connections">
      <h3>Rrdp</h3>
      <RrdpTable />
      <div className="side-by-side">
        <div>
          <h3>Rsync</h3>
          <RsyncTable />
        </div>
        <div>
          <h3>Status</h3>
          <Status />
        </div>
      </div>
    </div>
  );
}
