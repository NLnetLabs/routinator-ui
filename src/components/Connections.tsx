import React, { useState } from 'react';
import RrdpTable from './connections/RrdpTable';
import RsyncTable from './connections/RsyncTable';
import Status from './connections/Status';

export default function Connections() {
  const [level, setLevel] = useState<number>(5);

  return (
    <div id="connections">
      <h3>Minimum log level</h3>
      <label>
        <input 
          type='radio'
          name='log-level'
          value='0'
          checked={level === 0}
          onChange={e => setLevel(Number(e.target.value))}
          /> 
        <span className='log-label ERROR'>ERROR</span>
      </label>
      <label>
        <input 
          type='radio'
          name='log-level'
          value='1'
          checked={level === 1}
          onChange={e => setLevel(Number(e.target.value))}
          /> 
        <span className='log-label WARN'>WARN</span>
      </label>
      <label>
        <input 
          type='radio'
          name='log-level'
          value='2'
          checked={level === 2}
          onChange={e => setLevel(Number(e.target.value))}
          /> 
        <span className='log-label INFO'>INFO</span>
      </label>
      <label>
        <input 
          type='radio'
          name='log-level'
          value='3'
          checked={level === 3}
          onChange={e => setLevel(Number(e.target.value))}
          /> 
        <span className='log-label DEBUG'>DEBUG</span>
      </label>
      <label>
        <input 
          type='radio'
          name='log-level'
          value='4'
          checked={level === 4}
          onChange={e => setLevel(Number(e.target.value))}
          /> &nbsp;
        <span className='log-label TRACE'>TRACE</span>
      </label>
      <label>
        <input 
          type='radio'
          name='log-level'
          value='5'
          checked={level === 5}
          onChange={e => setLevel(Number(e.target.value))}
          /> 
        Display all
      </label>
      <h3>Rrdp</h3>
      <RrdpTable level={level} />
      <div className="side-by-side">
        <div>
          <h3>Rsync</h3>
          <RsyncTable level={level} />
        </div>
        <div>
          <h3>Status</h3>
          <Status />
        </div>
      </div>
    </div>
  );
}
