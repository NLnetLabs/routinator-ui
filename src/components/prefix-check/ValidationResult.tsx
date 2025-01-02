import React, { JSX } from 'react';
import ValidationResultTables from './ValidationResultTables';
import { ValidationResponse } from '../../types';

export interface ValidationResultProps {
  validationResults: ValidationResponse[] | null;
}

export default function ValidationResult({
  validationResults,
}: ValidationResultProps): JSX.Element | null {
  if (!validationResults) {
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

  if (validationResults.length == 0) {
    // This is the case when we only check for ASNs without prefix
    return (<div id="validation results" />);
  }

  return (
    <div id="validation-results">
      <h3>Validation</h3>
      {validationResults.map((validationResult) => {
        const { route, validity } = validationResult.validated_route;
        return (
          <>
            <p>
              Results for {route.prefix} - {route.origin_asn}
              <span className={validity.state}>{validity.state}</span>
            </p>
            <p>
              <em>{validity.description}</em>
            </p>
            <ValidationResultTables
              matched={validity.VRPs.matched}
              unmatched_as={validity.VRPs.unmatched_as}
              unmatched_length={validity.VRPs.unmatched_length}
            />
          </>
        );
      })}
    </div>
  );
}
