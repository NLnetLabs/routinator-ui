import React, { JSX } from 'react';
import { Member, MemberWithAsn } from '../../types';
import RelatedTableRow from './RelatedTableRow';
import { Message } from './Message';
import { t } from '../../core/util';
import useMemberFilter from '../../hooks/useMemberFilter';

export interface RelatedTableProps {
  members: Member[];
  highlight: string;
  showAllocated: boolean;
  showFilter: boolean;
  setNotification: (m: Message | null) => void;
}

export default function RelatedTable({
  members,
  highlight,
  showAllocated,
  showFilter,
  setNotification,
}: RelatedTableProps): JSX.Element {
  const { membersWithAsn, filter, setFilter } = useMemberFilter(members);

  return (
    <>
      {showFilter && (
        <form action="">
          <input
            type="search"
            placeholder="Filter on Prefix (regex allowed)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th></th>
            <th className="prefix-container">{t('common.prefix')}</th>
            <th>{t('common.originasn')}</th>
            <th>{t('common.rpkistatus')}</th>
          </tr>
        </thead>
        <tbody>
          {membersWithAsn.map((member: MemberWithAsn, counter: number) => (
            <RelatedTableRow
              key={member.key}
              index={counter}
              prefix={member.prefix}
              asn={member.asn}
              isAllocated={showAllocated && member.isAllocated}
              highlightAsn={highlight === member.asn}
              setNotification={setNotification}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
