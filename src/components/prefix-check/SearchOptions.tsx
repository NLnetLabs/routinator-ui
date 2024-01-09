import React, { JSX } from 'react';
import Help from '../Help';

export interface SearchOptionsProps {
  validatePrefix: boolean;
  setValidatePrefix: (b: boolean) => void;
  exactMatch: boolean;
  setExactMatch: (b: boolean) => void;
  setAsn: (b: string) => void;
}

export default function SearchOptions({
  exactMatch,
  setExactMatch,
  setValidatePrefix,
  validatePrefix,
  setAsn,
}: SearchOptionsProps): JSX.Element {
  return (
    <div id="search-options">
      <h2>
        ASN Lookup
        <Help>
          <h2>ASN Lookup</h2>
          <p>
            Enabling this will use the validation ASN to be looked up using an
            Origin ASN from BGP announcements for the requested prefix.
          </p>
        </Help>
      </h2>
      <p>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={validatePrefix}
            onChange={(e) => {
              if (e.target.checked) {
                setAsn('');
              }
              setValidatePrefix(e.target.checked);
            }}
          />
          <span>Validate Prefixes for ASN found in BGP</span>
        </label>
      </p>
      <h2>
        Origin ASN Validation Source
        <Help>
          <h2>Origin ASN Validation Source</h2>
          <p>If the &quot;ASN Lookup&quot; setting was enabled you can:</p>
          <ul>
            <li>
              use the ASN from BGP announcements for the exact match of the
              requested prefix, or
            </li>
            <li>use the ASN found for the longest matching prefix</li>
          </ul>
          <p>of the requested prefix.</p>
        </Help>
      </h2>
      <p>
        <label className="checkbox radio">
          <input
            type="radio"
            checked={exactMatch}
            onChange={() => setExactMatch(true)}
          />
          <span>Longest Matching Prefix</span>
        </label>
        <label className="checkbox radio">
          <input
            type="radio"
            checked={!exactMatch}
            onChange={() => setExactMatch(false)}
          />
          <span>Exact Match only</span>
        </label>
      </p>
    </div>
  );
}
