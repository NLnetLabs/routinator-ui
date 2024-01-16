function getRotoEndpoint() {
  if (typeof window !== 'undefined' && window.ROTO_API_HOST !== 'ROTO_API_HOST_PLACEHOLDER') {
    return window.ROTO_API_HOST;
  }

  if (typeof ROTO_API_HOST !== 'undefined') {
    return ROTO_API_HOST;
  }

  return 'https://rest.bgp-api.net';
}

// public endpoint: https://routinator.do.nlnetlabs.nl
function getApiEndpoint() {
  if (typeof window !== 'undefined' && window.ROUTINATOR_API_HOST !== 'ROUTINATOR_API_HOST_PLACEHOLDER') {
    return window.ROUTINATOR_API_HOST;
  }

  if (typeof ROUTINATOR_API_HOST !== 'undefined') {
    return ROUTINATOR_API_HOST;
  }

  return '';
}

export const ROTO_ENDPOINT = getRotoEndpoint();
export const API_ENDPOINT = getApiEndpoint();
