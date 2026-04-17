import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Issue } from '../types';

interface LogMessagesProps {
  text: string;
  issues: Issue[];
  type: string;
}

export default function LogMessages({ text, issues, type }: LogMessagesProps) {
  const [show, setShow] = useState<boolean>(false);

  // Please make sure you check that issues.length > 0
  const logLevels = ["ERROR", "WARN", "INFO", "DEBUG", "TRACE", "NONE"];
  let logLevel = Math.min(...issues.map(issue => logLevels.indexOf(issue.level)));
  let logLevelText = logLevels[logLevel];

  return (
    <>
      <span onClick={() => setShow(!show)}>  
        <div className='log-label-container'>
          <span className={`log-label ${logLevelText}`}>{logLevelText.slice(0, 1)}</span>
        </div>
        <a href='#'>
          {text}
        </a>
      </span>
      {createPortal(
        <>
          <div
            className={`log-overlay ${show ? 'visible' : 'hidden'}`}
            onClick={() => setShow(false)}
          >
            <div className="bar">{show && <>
              <h2>{type} log messages</h2> 
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
