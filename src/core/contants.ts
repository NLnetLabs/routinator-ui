export const ROTO_ENDPOINT =
  typeof ROTO_API_HOST === 'undefined'
    ? 'https://rest.bgp-api.net'
    : ROTO_API_HOST;
export const API_ENDPOINT =
  typeof ROUTINATOR_API_HOST === 'undefined'
    ? 'https://nate.nlnetlabs.nl'
    : ROUTINATOR_API_HOST;
