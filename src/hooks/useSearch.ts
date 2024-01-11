import { useContext, useEffect, useState } from 'react';
import { Message } from '../components/prefix-check/Message';
import { isIp, parseIPAndPrefix } from '../core/ipRegex';
import { isValidASN } from '../core/util';
import { Search } from '../types';
import { Navigate, RouteParams, RouterContext } from './useRouter';
import { ROTO_ENDPOINT } from '../core/contants';

interface SearchProperties {
  prefix: string;
  setPrefix: (v: string) => void;
  validatePrefix: boolean;
  setValidatePrefix: (v: boolean) => void;
  asn: string;
  setAsn: (v: string) => void;
  notification: null | Message;
  setNotification: (m: null | Message) => void;
  exactMatch: boolean;
  setExactMatch: (v: boolean) => void;
  onSubmit: () => void;
  searchResult: null | Search;
  validationResult: null | { asn: string; prefix: string };
}

function updateNavigation(
  params: RouteParams,
  navigate: Navigate,
  prefix: string,
  asn: string,
  validatePrefix: boolean,
  exactMatch: boolean
) {
  params.prefix = prefix;

  if (validatePrefix) {
    params['validate-bgp'] = 'true';
  } else {
    params.asn = asn;
    delete params['validate-bgp'];
  }

  if (exactMatch) {
    params['exact-match-only'] = 'true';
  } else {
    delete params['exact-match-only'];
  }

  if (!params.asn) {
    delete params.asn;
  }

  navigate('prefix-check', params);
}

function validate(
  prefix: string,
  asn: string,
  validatePrefix: boolean,
  setNotification: (m: null | Message) => void
): false | string {
  setNotification(null);

  let queryPrefix;
  if (!prefix) {
    setNotification({
      message: 'Please enter a valid prefix',
      level: 'error',
    });
    return false;
  }

  try {
    const [ip, prefixLength] = parseIPAndPrefix(prefix);
    queryPrefix = `${ip}/${prefixLength}`;
  } catch (e) {
    setNotification({
      message: 'Please enter a valid prefix',
      level: 'error',
    });
    return false;
  }

  if (!validatePrefix && !isValidASN(asn)) {
    setNotification({
      message:
        'Please enter a valid ASN or enable validating for an ASN found in BGP',
      level: 'error',
    });
    return false;
  }

  return queryPrefix;
}

async function search(
  prefix: string,
  setSearchResult: (v: null | Search) => void,
  setNotification: (m: null | Message) => void
) {
  fetch(`${ROTO_ENDPOINT}/api/v1/prefix/${prefix}/search`)
    .then((response) =>
      response.json().then((result) => [response.status, result])
    )
    .then(([status, result]) => {
      if (status === 200) {
        setSearchResult(result);
      } else if (result.error_msg) {
        setNotification({ message: result.error_msg, level: 'error' });
      } else {
        setNotification({ message: 'An error occurred', level: 'error' });
      }
    })
    .catch(() =>
      setNotification({ message: 'An error occurred', level: 'error' })
    );
}

export default function useSearch(): SearchProperties {
  const { params, navigate } = useContext(RouterContext);
  const paramsSet = Object.keys(params).length > 0;
  const [prefix, setPrefix] = useState(params.prefix || '');
  const [asn, setAsn] = useState(params.asn || '');
  const [searchResult, setSearchResult] = useState<null | Search>(null);
  const [validatePrefix, setValidatePrefix] = useState(
    paramsSet ? params['validate-bgp'] === 'true' : true
  );
  const [exactMatch, setExactMatch] = useState(
    params['exact-match-only'] === 'true'
  );
  const [validationResult, setValidationResult] = useState<null | {
    asn: string;
    prefix: string;
  }>(null);
  const [notification, setNotification] = useState<Message | null>(null);

  // when the search form is submitted
  const onSubmit = () => {
    const queryPrefix = validate(prefix, asn, validatePrefix, setNotification);

    if (!queryPrefix) {
      return;
    }

    updateNavigation(params, navigate, prefix, asn, validatePrefix, exactMatch);

    search(queryPrefix, setSearchResult, setNotification);
  };

  // initial search if query params are set
  // update state based in navigation
  useEffect(() => {
    if (paramsSet) {
      let newPrefix = prefix;
      let newAsn = asn;

      if (params.prefix !== prefix) {
        newPrefix = params.prefix || '';
        setPrefix(newPrefix);
      }

      if (params.asn !== asn) {
        newAsn = params.asn || '';
        setAsn(newAsn);
      }

      const queryPrefix = validate(
        newPrefix,
        newAsn,
        validatePrefix,
        setNotification
      );

      if (!queryPrefix) {
        return;
      }

      search(queryPrefix, setSearchResult, setNotification);
    } else if (prefix || asn) {
      setPrefix('');
      setAsn('');
      setSearchResult(null);
      setValidationResult(null);
    }

  }, [params.asn, params.prefix]);

  // fill asn from search result
  useEffect(() => {
    let nextAsn = asn;
    let nextPrefix = prefix;

    if (searchResult) {
      if (validatePrefix) {
        const asn = searchResult.result.meta
          .filter((m) => m.originASNs)
          .map((m) => m.originASNs)[0];

        if (asn) {
          nextAsn = asn[0];
          setAsn(nextAsn);
        }
      }

      if (isIp(prefix)) {
        // in case the user entered an IP, but not a prefix, we have to use the prefix returned in the search result
        nextPrefix = searchResult.result.prefix;
        setPrefix(nextPrefix);
        setNotification({
          message: 'The prefix length was automatically inferred',
          level: 'success',
        });
      }
    }

    setValidationResult({ asn: nextAsn, prefix: nextPrefix });
  }, [searchResult]);

  return {
    prefix,
    setPrefix,
    validatePrefix,
    setValidatePrefix,
    asn,
    setAsn,
    notification,
    setNotification,
    exactMatch,
    setExactMatch,
    onSubmit,
    searchResult,
    validationResult,
  };
}
