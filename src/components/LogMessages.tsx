import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface LogMessagesProps {
  text: string;
  children: JSX.Element | JSX.Element[];
}

export default function LogMessages({ text, children }: LogMessagesProps) {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <a href='#' onClick={() => setShow(!show)}>
        {text}
      </a>
      {createPortal(
        <div
          className={`log-overlay ${show ? 'visible' : 'hidden'}`}
          onClick={() => setShow(false)}
        >
          <div className="bar">{show && children}</div>
        </div>,
        document.body,
        'help'
      )}
    </>
  );
}
