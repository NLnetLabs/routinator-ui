export interface RoutinatorStatus {
  version: string;
  serial: number;
  now: Date;
  lastUpdateStart: Date;
  lastUpdateDone: Date;
  lastUpdateDuration: number;
  payload: Payload;
  tals: Tals;
  repositories: { [key: string]: Repository };
  vrpsAddedLocally: number;
  rsync: { [key: string]: Rsync };
  rrdp: { [key: string]: Rrdp };
  rtr: Rtr;
  http: HTTP;
}

export interface RotoStatus {
  version: string;
  sources: RotoSource[];
}

export interface RotoSource {
  type: string;
  id: string;
  serial: number;
  lastUpdated: Date;
}

export interface HTTP {
  totalConnections: number;
  currentConnections: number;
  requests: number;
  bytesRead: number;
  bytesWritten: number;
}

export interface Payload {
  routeOriginsIPv4: Route;
  routeOriginsIPv6: Route;
  routerKeys: Route;
}

export interface Route {
  total: number;
  unsafe?: number;
  locallyFiltered: number;
  duplicate: number;
  final: number;
}

export interface Repository {
  repository?: string;
  type?: string;
  vrpsTotal: number;
  vrpsUnsafe: number;
  vrpsLocallyFiltered: number;
  vrpsDuplicate: number;
  vrpsFinal: number;
  payload: Payload;
  validPublicationPoints: number;
  rejectedPublicationPoints: number;
  validManifests: number;
  invalidManifests: number;
  prematureManifests: number;
  staleManifests: number;
  missingManifests: number;
  validCRLs: number;
  invalidCRLs: number;
  staleCRLs: number;
  strayCRLs: number;
  validCACerts: number;
  validEECerts: number;
  validRouterCerts: number;
  invalidCerts: number;
  validROAs: number;
  invalidROAs: number;
  validGBRs: number;
  invalidGBRs: number;
  otherObjects: number;
}

export interface Rrdp {
  status: number;
  notifyStatus: number;
  payloadStatus: number;
  duration: number;
  // optional
  serial?: number | null;
  session?: null | string;
  delta?: boolean;
  snapshot_reason?: null;
}

export interface Rsync {
  status: number;
  duration: number;
}

export interface Rtr {
  currentConnections: number;
  bytesRead: number;
  bytesWritten: number;
}

export interface Tals {
  afrinic: Repository;
  apnic: Repository;
  arin: Repository;
  lacnic: Repository;
  ripe: Repository;
}

/** https://github.com/NLnetLabs/roto-api#response **/
export interface Search {
  error_msg?: string;
  prefix: string;
  type: MatchType;
  result: SearchResult;
}

/** https://github.com/NLnetLabs/roto-api#matchtype **/
export type MatchType = 'longest-match' | 'exact-match' | 'empty-match';

/** https://github.com/NLnetLabs/roto-api#result **/
export interface SearchResult {
  prefix: string;
  meta: SearchResultMeta[];
  relations?: Relation[];
  type: MatchType;
}

export type SourceID =
  | 'riswhois'
  | 'afrinic'
  | 'apnic'
  | 'arin'
  | 'lacnic'
  | 'ripe';

/** https://github.com/NLnetLabs/roto-api#meta **/
export interface SearchResultMeta {
  sourceType: 'rir-alloc' | 'bgp';
  sourceID: SourceID;
  originASNs?: string[];
}

export type RelationType =
  | 'same-org'
  | 'more-specific'
  | 'less-specific'
  | 'bgp-origin-as';

export interface Relation {
  type: RelationType;
  members: Member[];
}

export interface SearchAPIError {
  results: null;
  error: true;
  error_msg: string;
}

export interface Member {
  prefix: string;
  meta: SearchResultMeta[];
}

export interface MemberWithAsn extends Member {
  key: string;
  asn: string | null;
  isAllocated: boolean;
}

export interface ValidationResponse {
  validated_route: ValidatedRoute;
  generatedTime: string;
}

export interface ValidatedRoute {
  route: Route;
  validity: Validity;
}

export interface Route {
  origin_asn: string;
  prefix: string;
}

export interface Validity {
  state: 'valid' | 'not-found' | 'invalid';
  description: string;
  reason?: string;
  VRPs: Vrps;
}

export interface Vrps {
  matched: RouteIdent[];
  unmatched_as: RouteIdent[];
  unmatched_length: RouteIdent[];
}

export interface RouteIdent {
  asn: string;
  prefix: string;
  max_length: string;
}

declare global {
  interface Window {
    ROUTINATOR_API_HOST: string;
    ROTO_API_HOST: string;
  }
}
