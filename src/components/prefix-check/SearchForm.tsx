import React, { FormEvent, JSX } from 'react';

interface SearchFormProps {
  onSubmit: () => void;
  setPrefix: (v: string) => void;
  prefix: string;
  setAsnString: (v: string) => void;
  asnString: string;
  validatePrefix: boolean;
  setValidatePrefix: (v: boolean) => void;
}

export default function SearchForm({
  onSubmit,
  setPrefix,
  prefix,
  setAsnString,
  asnString,
  validatePrefix,
  setValidatePrefix,
}: SearchFormProps): JSX.Element {
  const placeholder = validatePrefix ? 'Will be filled by BGP' : 'e.g. 64511';

  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <p>
        <label htmlFor="prefix">Prefix or IP Address (optional)</label>
        <input
          type="text"
          onChange={(e) => setPrefix(e.target.value)}
          value={prefix}
          id="prefix"
          placeholder="e.g. 192.0.2.0/24"
        />
      </p>
      <p>
        <label htmlFor="asn">Origin ASN (optional)</label>
        <input
          type="text"
          onChange={(e) => setAsnString(e.target.value)}
          value={asnString}
          id="asn"
          placeholder={placeholder}
          readOnly={validatePrefix}
          onClick={() => validatePrefix && setValidatePrefix(false)}
        />
      </p>
      <p>
        <button type="submit" className="button">
          Validate
        </button>
      </p>
    </form>
  );
}
