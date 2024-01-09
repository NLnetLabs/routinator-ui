import React, { JSX, useState } from 'react';
import ValidationResultTables from './ValidationResultTables';
import { Message } from './Message';
import useValidity from '../../hooks/useValidity';
import Link from '../Link';

export interface RelatedTableRowProps {
  index: number;
  prefix: string;
  asn: string;
  isAllocated: boolean;
  highlightAsn: boolean;
  setNotification: (m: Message | null) => void;
}

export default function RelatedTableRow({
  prefix,
  asn,
  index,
  isAllocated,
  highlightAsn,
  setNotification,
}: RelatedTableRowProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const validationResult = useValidity(prefix, asn, setNotification);
  const validity = validationResult?.validated_route.validity;

  return (
    <>
      <tr className={index % 2 === 0 ? 'even' : 'odd'}>
        <td className="button-container">
          <button
            onClick={() => setExpanded(!expanded)}
            className={expanded ? 'collapse' : 'expand'}
          >
            <span>
              <span>{expanded ? 'collapse' : 'expand'}</span>
            </span>
          </button>
        </td>
        <td className="prefix-container">
          <Link params={{ prefix, 'validate-bgp': 'true' }}>{prefix}</Link>
          {isAllocated && <span className="tag">Allocated</span>}
        </td>
        <td className={highlightAsn ? 'higlighted' : ''}>
          <span>{asn}</span>
        </td>
        <td>
          {validity && <span className={validity.state}>{validity.state}</span>}
        </td>
      </tr>
      {expanded && validity && (
        <tr>
          <td colSpan={4} className="sub-table">
            <p>{validity.description}</p>
            <ValidationResultTables
              matched={validity.VRPs.matched}
              unmatched_as={validity.VRPs.unmatched_as}
              unmatched_length={validity.VRPs.unmatched_length}
            />
          </td>
        </tr>
      )}
    </>
  );
}
