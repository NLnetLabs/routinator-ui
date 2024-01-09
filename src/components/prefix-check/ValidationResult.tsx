import React, { JSX } from 'react';
import ValidationResultTables from './ValidationResultTables';
import { Message } from './Message';
import useValidity from '../../hooks/useValidity';

export interface ValidationResultProps {
  prefix: string;
  asn: string;
  setNotification: (m: Message | null) => void;
}

export default function ValidationResult({
  prefix,
  asn,
  setNotification,
}: ValidationResultProps): JSX.Element | null {
  const validationResult = useValidity(prefix, asn, setNotification);

  if (!validationResult) {
    return null;
  }

  const { route, validity } = validationResult.validated_route;

  return (
    <div id="validation-results">
      <h3>Validation</h3>
      <p>
        Results for {route.prefix} - {route.origin_asn}
        <span className={validity.state}>{validity.state}</span>
      </p>
      <p>
        <em>
          {validity.reason} {validity.description}
        </em>
      </p>
      <ValidationResultTables
        matched={validity.VRPs.matched}
        unmatched_as={validity.VRPs.unmatched_as}
        unmatched_length={validity.VRPs.unmatched_length}
      />
    </div>
  );
}
