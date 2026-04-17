import React, { useState } from 'react';
import RrdpTable from './connections/RrdpTable';
import RsyncTable from './connections/RsyncTable';
import Status from './connections/Status';
import Help from './Help';

export default function Connections() {
  const [level, setLevel] = useState<number>(5);

  return (
    <div id="connections">
      <h3>Maximum log level
        <Help>
          <h2>Maximum log level</h2>
          <p>
            The maximum log level determines which publication points are 
            shown in the RRDP and rsync tables. By selecting <span className='log-label WARN'>WARN</span>, only 
            publication points with an <span className='log-label ERROR'>ERROR</span> and/or <span className='log-label WARN'>WARN</span> log message
            are shown.
          </p>
          <p>
            The log messages that can be shown also depends on the <code>log-level</code> setting in your Routinator config. If your <code>log-level</code> is
            set to <code>WARN</code>, the UI will never show any <span className='log-label INFO'>INFO</span> messages.
          </p>
        </Help>
      </h3>

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
