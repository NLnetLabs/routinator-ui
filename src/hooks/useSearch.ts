import { useEffect, useState } from 'react';
import { Message } from '../components/prefix-check/Message';
import { isIp, parseIPAndPrefix } from '../core/ipRegex';
import { isValidASN } from '../core/util';
import { Search, ValidationResponse } from '../types';
import { Navigate, RouteParams } from './useRouter';
import { API_ENDPOINT, ROTO_ENDPOINT } from '../core/contants';

interface SearchParams {
  prefix: string;
  asn: string;
}

interface SearchProperties extends SearchParams {
  setPrefix: (v: string) => void;
  setAsn: (v: string) => void;
  validatePrefix: boolean;
  setValidatePrefix: (v: boolean) => void;
  exactMatch: boolean;
  setExactMatch: (v: boolean) => void;
  notification: null | Message;
  setNotification: (m: null | Message) => void;
  onSubmit: () => void;
  searchResult: null | Search;
  validationResult: null | ValidationResponse;
}

function updateNavigation(
  params: RouteParams,
  navigate: Navigate,
  prefix: string,
  asn: string,
  validatePrefix: boolean,
  exactMatch: boolean
) {
  const newParams: RouteParams = {
    ...params,
    prefix,
  };

  if (validatePrefix) {
    newParams['validate-bgp'] = 'true';
  } else {
    newParams.asn = asn;
    delete newParams['validate-bgp'];
  }

  if (exactMatch) {
    newParams['exact-match-only'] = 'true';
  } else {
    delete newParams['exact-match-only'];
  }

  if (!newParams.asn) {
    delete newParams.asn;
  }

  navigate('prefix-check', newParams);
}

function validate(
  prefix: string,
  asn: string,
  validatePrefix: boolean,
  setNotification: (m: null | Message) => void
): string | null {
  if (!prefix) {
    setNotification({
      message: 'Please enter a valid prefix',
      level: 'error',
    });
    return null;
  }

  if (!validatePrefix && !isValidASN(asn)) {
    setNotification({
      message:
        'Please enter a valid ASN or enable validating for an ASN found in BGP',
      level: 'error',
    });
    return null;
  }

  const parsed = parseIPAndPrefix(prefix);

  if (!parsed) {
    setNotification({
      message: 'Please enter a valid prefix',
      level: 'error',
    });
    return null;
  }

  setNotification(null);

  return parsed;
}

export default function useSearch(
  params: RouteParams,
  navigate: Navigate
): SearchProperties {
  const [prefix, setPrefix] = useState(params.prefix || '');
  const [asn, setAsn] = useState(params.asn || '');
  const [searchResult, setSearchResult] = useState<null | Search>(null);
  const [validatePrefix, setValidatePrefix] = useState(
    Object.keys(params).length > 0 ? params['validate-bgp'] === 'true' : true
  );
  const [exactMatch, setExactMatch] = useState(
    params['exact-match-only'] === 'true'
  );
  const [validationResult, setValidationResult] =
    useState<null | ValidationResponse>(null);
  const [notification, setNotification] = useState<Message | null>(null);
  const setError = (message = 'An error occurred') =>
    setNotification({ message, level: 'error' });

  // initial search if query params are set
  // update state based in navigation
  useEffect(() => {
    if (params.prefix !== prefix) {
      setPrefix(params.prefix || '');
    }

    if (params.asn !== asn) {
      setAsn(params.asn || '');
    }

    if (!params.prefix) {
      setSearchResult(null);
      setValidationResult(null);
      return;
    }

    const queryPrefix = validate(
      params.prefix,
      params.asn,
      validatePrefix,
      setNotification
    );

    if (!queryPrefix) {
      return;
    }

    const search = async () => {
      const response = await fetch(
        `${ROTO_ENDPOINT}/api/v1/prefix/${queryPrefix}/search`
      );

      if (response.status !== 200) {
        return setError();
      }

      const searchResult: Search = await response.json();

      if (searchResult.error_msg) {
        return setError(searchResult.error_msg);
      }

      setSearchResult(searchResult);

      let nextPrefix = params.prefix;
      let nextAsn = params.asn;

      // fill in the asn provided in the search result
      if (validatePrefix) {
        const resultAsn = searchResult.result.meta
          .map((m) => (m.originASNs ? m.originASNs[0] : null))
          .find((asn) => asn);

        if (resultAsn) {
          nextAsn = resultAsn;
          setAsn(nextAsn);
        } else {
          setNotification({
            message: 'Could not find an Origin ASN in BGP for this Prefix',
            level: 'warning',
          });
        }
      }

      // in case the user entered an IP, but not a prefix, we have to use the prefix returned in the search result
      if (isIp(prefix) && searchResult.result.prefix) {
        nextPrefix = searchResult.result.prefix;
        setPrefix(nextPrefix);
        setNotification({
          message: 'The prefix length was automatically inferred',
          level: 'success',
        });
      }

      if (nextAsn) {
        const validateResponse = await fetch(
          `${API_ENDPOINT}/api/v1/validity/${nextAsn}/${nextPrefix}`
        );
        setValidationResult(await validateResponse.json());
      } else {
        setValidationResult(null);
      }
    };

    search().catch(setError);
  }, [params.prefix, params.asn, validatePrefix]);

  // when the search form is submitted
  const onSubmit = () =>
    updateNavigation(params, navigate, prefix, asn, validatePrefix, exactMatch);

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
