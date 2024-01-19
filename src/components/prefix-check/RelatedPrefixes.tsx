import React, { JSX } from 'react';
import RelatedTable from './RelatedTable';
import { Relation, RelationType } from '../../types';
import { Message } from './Message';
import useRelatedResources from '../../hooks/useRelatedPrefixes';

interface RelatedPrefixesProps {
  type: RelationType;
  label: string;
  param: string;
  highlight: string[];
  showAllocated: boolean;
  relations: Relation[];
  setNotification: (m: Message | null) => void;
}

export default function RelatedPrefixes({
  type,
  label,
  param,
  highlight,
  showAllocated,
  relations,
  setNotification,
}: RelatedPrefixesProps): JSX.Element | null {
  const { items, show, rir, clickToggle } = useRelatedResources({
    type,
    param,
    relations,
  });

  if (!items || items.members.length === 0) {
    return null;
  }

  return (
    <div className="related-prefixes-group">
      <h4 onClick={clickToggle} className={`${show ? 'collapse' : 'expand'}`}>
        <span className="arrow">
          <span>{show ? 'collapse' : 'expand'}</span>
        </span>
        {items.members.length} {label}
        {type === 'same-org' && <span className="tag">Region {rir}</span>}
      </h4>
      {show && (
        <RelatedTable
          highlight={highlight}
          showAllocated={showAllocated}
          members={items.members}
          setNotification={setNotification}
          showFilter={true}
        />
      )}
    </div>
  );
}
