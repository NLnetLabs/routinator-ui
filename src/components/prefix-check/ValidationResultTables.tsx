import { RouteIdent } from '../../types';
import RouteIdentTable from './RouteIdentTable';
import React from 'react';

export interface ValidationResultTablesProps {
  matched?: RouteIdent[];
  unmatched_as?: RouteIdent[];
  unmatched_length?: RouteIdent[];
}

export default function ValidationResultTables({
  matched,
  unmatched_as,
  unmatched_length,
}: ValidationResultTablesProps) {
  return (
    <>
      {matched && matched.length > 0 && (
        <RouteIdentTable type="matched" routeIdents={matched} />
      )}
      {unmatched_as && unmatched_as.length > 0 && (
        <RouteIdentTable type="unmatchedasn" routeIdents={unmatched_as} />
      )}
      {unmatched_length && unmatched_length.length > 0 && (
        <RouteIdentTable
          type="unmatchedlength"
          routeIdents={unmatched_length}
        />
      )}
    </>
  );
}
