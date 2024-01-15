import { useEffect, useState } from 'react';
import { Member, MemberWithAsn } from '../types';

interface MemberFilterResult {
  filter: string;
  setFilter: (v: string) => void;
  membersWithAsn: MemberWithAsn[];
}

export default function useMemberFilter(members: Member[]): MemberFilterResult {
  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter, setDebouncedFilter] = useState<RegExp | null>(null);

  // debounced regex filtering
  useEffect(() => {
    const filterTimeout = setTimeout(() => {
      if (filter) {
        setDebouncedFilter(new RegExp(filter.replace('.', '\\.')));
      } else {
        setDebouncedFilter(null);
      }
    }, 100);

    return () => clearTimeout(filterTimeout);
  }, [filter]);

  // combine member with an ASN and apply filter
  const membersWithAsn: MemberWithAsn[] = members
    .filter(
      (member) => !debouncedFilter || member.prefix.match(debouncedFilter)
    )
    .map((member) => {
      const withAsn = member.meta
        .filter((meta) => meta.originASNs)
        .map(
          (meta) =>
            meta.originASNs?.map((asn) => ({
              ...member,
              asn,
              key: member.prefix + asn,
              isAllocated: member.meta.some(
                (m) => m.sourceType === 'rir-alloc'
              ),
            })) || []
        )
        .flat();

      if (withAsn.length > 0) {
        return withAsn;
      }

      return [
        {
          ...member,
          asn: null,
          key: member.prefix,
          isAllocated: member.meta.some((m) => m.sourceType === 'rir-alloc'),
        },
      ];
    })
    .flat();

  return {
    filter,
    setFilter,
    membersWithAsn,
  };
}
