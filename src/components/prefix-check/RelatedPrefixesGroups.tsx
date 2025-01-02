import React, { JSX } from 'react';
import RelatedTable from './RelatedTable';
import { Search } from '../../types';
import { Message } from './Message';
import RelatedPrefixes from './RelatedPrefixes';

export interface RelatedPrefixesGroupsProps {
  search: Search;
  highlight: string[];
  setNotification: (m: Message | null) => void;
}

export default function RelatedPrefixesGroups({
  search,
  highlight,
  setNotification,
}: RelatedPrefixesGroupsProps): JSX.Element {
  if (!search.result.relations) {
    return (
      <div className="no-results">
        No less or more specific prefixes in either Allocations and BGP, or
        prefixes for the same organisation were found.
      </div>
    );
  }

  const rir = search.result.relations
    .find((r) => r.type === 'same-org')
    ?.members[0]?.meta.find((r) => r.sourceType === 'rir-alloc')?.sourceID;

  return (
    <div id="related-prefixes">
      <h3>Related Prefixes</h3>
      <p>
        Best Matching Prefix in Allocations and/or BGP
        {rir && <span className="tag">Region {rir}</span>}
      </p>
      {search.result.prefix && 
      <RelatedTable
        members={[search.result]}
        highlight={highlight}
        showAllocated={true}
        setNotification={setNotification}
        showFilter={false}
      />}
      <RelatedPrefixes
        type="more-specific"
        label="more specific"
        param="related_more_specific"
        highlight={highlight}
        showAllocated={true}
        relations={search.result.relations}
        setNotification={setNotification}
      />
      <RelatedPrefixes
        type="less-specific"
        label="less specific"
        param="related_less_specific"
        highlight={highlight}
        showAllocated={true}
        relations={search.result.relations}
        setNotification={setNotification}
      />
      <RelatedPrefixes
        type="same-org"
        label="allocated to the same organization"
        param="related_alloc"
        highlight={highlight}
        showAllocated={false}
        relations={search.result.relations}
        setNotification={setNotification}
      />
      <RelatedPrefixes
        type="bgp-origin-asn"
        label="same origin ASN"
        param="related_asn"
        highlight={highlight}
        showAllocated={false}
        relations={search.result.relations}
        setNotification={setNotification}
      />
    </div>
  );
}
