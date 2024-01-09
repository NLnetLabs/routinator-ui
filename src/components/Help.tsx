import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface HelpProps {
  children: JSX.Element | JSX.Element[];
}

export default function Help({ children }: HelpProps) {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <button className="help" onClick={() => setShow(!show)}>
        <span>?</span>
      </button>
      {createPortal(
        <div
          className={`help-overlay ${show ? 'visible' : 'hidden'}`}
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
