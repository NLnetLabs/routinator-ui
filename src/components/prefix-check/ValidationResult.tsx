import React, { JSX } from 'react';
import ValidationResultTables from './ValidationResultTables';
import { ValidationResponse } from '../../types';

export interface ValidationResultProps {
  validationResult: ValidationResponse | null;
}

export default function ValidationResult({
  validationResult,
}: ValidationResultProps): JSX.Element | null {
  if (!validationResult) {
    return (
      <div id="validation-results">
        <h3>Validation</h3>
        <h4>No Origin ASN found for this Prefix in BGP.</h4>
        <p>
          <em>
            You can enter an ASN to validate this prefix against and try again.
          </em>
        </p>
      </div>
    );
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
