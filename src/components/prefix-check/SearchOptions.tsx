import React, { JSX } from 'react';
import Help from '../Help';

export interface SearchOptionsProps {
  validatePrefix: boolean;
  setValidatePrefix: (b: boolean) => void;
  exactMatch: boolean;
  setExactMatch: (b: boolean) => void;
  setAsnString: (b: string) => void;
  onSubmit: () => void;
}

export default function SearchOptions({
  exactMatch,
  setExactMatch,
  setValidatePrefix,
  validatePrefix,
  setAsnString,
  onSubmit,
}: SearchOptionsProps): JSX.Element {
  const disabled = validatePrefix ? '' : 'disabled';
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
                setAsnString('');
              }
              setValidatePrefix(e.target.checked);
              setExactMatch(false);
              onSubmit();
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
      <p className={disabled}>
        <label className="checkbox radio">
          <input
            type="radio"
            checked={!exactMatch}
            onChange={() => {
              setExactMatch(false);
              onSubmit();
            }}
            disabled={!validatePrefix}
          />
          <span>Longest Matching Prefix</span>
        </label>
        <label className="checkbox radio">
          <input
            type="radio"
            checked={exactMatch}
            onChange={() => {
              setExactMatch(true);
              onSubmit();
            }}
            disabled={!validatePrefix}
          />
          <span>Exact Match only</span>
        </label>
      </p>
    </div>
  );
}
