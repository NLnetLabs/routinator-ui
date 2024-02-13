import { useContext } from 'react';
import { RouterContext } from './useRouter';
import { Relation, RelationType, SourceID } from '../types';

interface RelatedPrefixesArgs {
  type: RelationType;
  param: string;
  relations: Relation[];
}

interface RelatedPrefixesData {
  items?: Relation;
  show: boolean;
  rir?: SourceID;
  clickToggle: () => void;
}

export default function useRelatedPrefixes({
  type,
  param,
  relations,
}: RelatedPrefixesArgs): RelatedPrefixesData {
  const { route, params, navigate } = useContext(RouterContext);
  const items = relations?.find((r) => r.type == type);
  const include = params.include?.split(',') || [];
  const show = include.includes(param);
  const rir = items?.members[0]?.meta.find(
    (r) => r.sourceType === 'rir-alloc'
  )?.sourceID;
  const toggle = show
    ? include.filter((p) => p !== param)
    : [...include, param];
  const clickToggle = () =>
    navigate(route.name, {
      ...params,
      include: toggle.filter((v) => v).join(','),
    });

  return {
    items,
    show,
    rir,
    clickToggle,
  };
}
