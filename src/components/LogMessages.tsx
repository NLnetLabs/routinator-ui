import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Issue } from '../types';
import { lowestLogLevel } from '../core/util';

interface LogMessagesProps {
  text: string;
  issues: Issue[];
  type: string;
}

export default function LogMessages({ text, issues, type }: LogMessagesProps) {
  const [show, setShow] = useState<boolean>(false);

  let logLevel = lowestLogLevel(issues);
  return (
    <>
      <div className='log-column' onClick={() => setShow(!show)}>  
        <div className='log-label-container'>
          <span className={`log-label ${logLevel.text}`}>{logLevel.text.slice(0, 1)}</span>
        </div>
        <div>
        {text}
        </div>
        <div>
        <a href='#' style={{
          float: 'right'
        }}>
          (open logs)
        </a>
        </div>
      </div>
      {createPortal(
        <>
          <div
            className={`log-overlay ${show ? 'visible' : 'hidden'}`}
            onClick={() => setShow(false)}
          >
            <div className="bar">{show && <>
              <h2>{type} log messages for {text}</h2> 
              <div className='log-messages'>
              {issues.map(issue => <div className=''>
                <div className='log-label-container'>
                  <span className={`log-label ${issue.level}`}>{issue.level}</span>
                </div>
                <span className='message'>{issue.messages}</span>
              </div>)}
              </div>
            </>}
            </div>
          </div>
        </>,
        document.body,
        'log-messages'
      )}
    </>
  );
}
