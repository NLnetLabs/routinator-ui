import { useEffect, useState } from 'react';
import { Message } from '../components/prefix-check/Message';
import { isIp, parseIPAndPrefix } from '../core/ipRegex';
import {
  arrayFromCommaSeperated,
  arrayToCommaSeperated,
  isValidASN,
} from '../core/util';
import { Search, ValidationResponse } from '../types';
import { Navigate, RouteParams } from './useRouter';
import { API_ENDPOINT, ROTO_ENDPOINT } from '../core/contants';

interface SearchParams {
  prefix: string;
  asnString: string;
}

interface SearchProperties extends SearchParams {
  setPrefix: (v: string) => void;
  setAsnString: (v: string) => void;
  validatePrefix: boolean;
  setValidatePrefix: (v: boolean) => void;
  exactMatch: boolean;
  setExactMatch: (v: boolean) => void;
  notification: null | Message;
  setNotification: (m: null | Message) => void;
  onSubmit: () => void;
  searchResult: null | Search;
  validationResults: null | ValidationResponse[];
}

function updateNavigation(
  params: RouteParams,
  navigate: Navigate,
  prefix: string,
  asns: string[],
  validatePrefix: boolean,
  exactMatch: boolean
) {
  const newParams: RouteParams = {
    ...params,
    prefix,
  };

  if (validatePrefix) {
    newParams['validate-bgp'] = 'true';
    delete newParams['asns'];
  } else {
    newParams.asns = arrayToCommaSeperated(asns);
    delete newParams['validate-bgp'];
  }

  if (exactMatch && validatePrefix) {
    newParams['exact-match-only'] = 'true';
  } else {
    delete newParams['exact-match-only'];
  }

  if (!newParams.asns) {
    delete newParams.asns;
  }

  navigate('prefix-check', newParams);
}

function validate(
  prefix: string,
  asns: string[],
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

  if (!validatePrefix) {
    let valid = true;
    for (const asn of asns) {
      if (!isValidASN(asn)) {
        valid = false;
        break;
      }
    }
    if (!valid || asns.length == 0) {
      setNotification({
        message:
          'Please enter a valid ASN or enable validating for an ASN found in BGP',
        level: 'error',
      });
      return null;
    }
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
  const [asnString, setAsnString] = useState(params.asns || '');
  const [searchResult, setSearchResult] = useState<null | Search>(null);
  const [validatePrefix, setValidatePrefix] = useState(
    Object.keys(params).length > 0 ? params['validate-bgp'] === 'true' : true
  );
  const [exactMatch, setExactMatch] = useState(
    params['exact-match-only'] === 'true'
  );
  const [validationResults, setValidationResults] = useState<
    null | ValidationResponse[]
  >(null);
  const [notification, setNotification] = useState<Message | null>(null);
  const setError = (message = 'An error occurred') =>
    setNotification({ message, level: 'error' });

  // initial search if query params are set
  // update state based in navigation
  useEffect(() => {
    if (params.prefix !== prefix) {
      setPrefix(params.prefix || '');
    }

    if (params.asns !== asnString) {
      setAsnString(params.asns || '');
    }

    if (!params.prefix) {
      setSearchResult(null);
      setValidationResults(null);
      return;
    }

    const queryPrefix = validate(
      params.prefix,
      arrayFromCommaSeperated(params.asns),
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
        // TODO as soon as we get a JSON error message via https://github.com/NLnetLabs/routinator/issues/925
        //  we should display them to the user
        return setError();
      }

      const searchResult: Search = await response.json();

      if (searchResult.error_msg) {
        return setError(searchResult.error_msg);
      }

      setSearchResult(searchResult);

      let nextPrefix = params.prefix.trim();
      let nextAsns = arrayFromCommaSeperated(params.asns);

      // fill in the asn provided in the search result
      if (validatePrefix) {
        const resultAsns = searchResult.result.meta
          .map((m) => (m.originASNs ? m.originASNs : null))
          .find((asns) => asns);

        if (
          resultAsns &&
          (searchResult.result.type === 'exact-match' || !exactMatch)
        ) {
          nextAsns = resultAsns;
          setAsnString(arrayToCommaSeperated(nextAsns));
        } else {
          setNotification({
            message: 'Could not find an Origin ASN in BGP for this Prefix',
            level: 'warning',
          });
          setValidationResults(null);
          return;
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

      const res: ValidationResponse[] = [];
      for (const asn of nextAsns) {
        const validateResponse = await fetch(
          `${API_ENDPOINT}/api/v1/validity/${asn}/${nextPrefix}`
        );
        res.push(await validateResponse.json());
      }
      setValidationResults(res);
    };

    search().catch(setError);
  }, [params.prefix, params.asns, validatePrefix, exactMatch]);

  // when the search form is submitted
  const onSubmit = () =>
    updateNavigation(
      params,
      navigate,
      prefix,
      arrayFromCommaSeperated(asnString),
      validatePrefix,
      exactMatch
    );

  return {
    prefix,
    setPrefix,
    validatePrefix,
    setValidatePrefix,
    asnString,
    setAsnString,
    notification,
    setNotification,
    exactMatch,
    setExactMatch,
    onSubmit,
    searchResult,
    validationResults,
  };
}
