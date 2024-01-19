import { act, renderHook } from '@testing-library/react-hooks';
import useSearch from './useSearch';
import * as searchResult from '../test/searchResult.json';
import * as validationResult from '../test/validationResult.json';
import * as validationResultAS15168 from '../test/validationResultAS15168.json';
import * as searchResultInferPrefixLen from '../test/seachResultInferPrefixLen.json';
import * as searchResultMultipleASN from '../test/seachResultMultipleASN.json';
import { RouteParams } from './useRouter';
import { useState } from 'react';

function fetchMock(url: string): Promise<Response> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        status: 200,
        json: async () => {
          if (url.endsWith('104.154.0.0/15/search')) {
            return searchResult;
          }

          if (url.endsWith('/validity/AS15169/104.154.0.0/15')) {
            return validationResult;
          }

          if (url.endsWith('/validity/AS15168/104.154.0.0/15')) {
            return validationResultAS15168;
          }

          if (url.endsWith('104.154.0.0/32/search')) {
            return searchResultInferPrefixLen;
          }

          if (url.endsWith('104.154.0.0/17/search')) {
            return searchResultMultipleASN;
          }

          return null;
        },
      } as Response);
    }, Math.random() * 100)
  );
}

beforeAll(() => {
  //@ts-ignore
  jest.spyOn(global, 'fetch').mockImplementation(fetchMock);
});

afterAll(() => {
  //@ts-ignore
  global.fetch.mockClear();
});

it('useSearch hook runs correctly', async () => {
  const { result, waitForValueToChange } = renderHook(() => {
    const [params, setParams] = useState({});
    const navigate = (route: string, p: RouteParams) => setParams(p);

    return useSearch(params, navigate);
  });
  const prefix = '104.154.0.0/15';

  act(() => {
    result.current.setPrefix(prefix);
  });

  act(() => {
    result.current.onSubmit();
  });

  await waitForValueToChange(() => result.current.searchResult);

  expect(result.current.prefix).toEqual(prefix);
  expect(result.current.searchResult?.result.relations?.length).toEqual(3);

  await waitForValueToChange(() => result.current.validationResults);

  if (result.current.validationResults) {
    expect(
      result.current.validationResults[0].validated_route.route.origin_asn
    ).toEqual('AS15169');
  }

  act(() => {
    result.current.setValidatePrefix(false);
  });

  act(() => {
    result.current.setAsnString('incorrect-asn');
  });

  act(() => {
    result.current.onSubmit();
  });

  expect(result.current.validatePrefix).toEqual(false);
  expect(result.current.notification?.message).toEqual(
    'Please enter a valid ASN or enable validating for an ASN found in BGP'
  );
});

it('BGP based ASN fill works after manual change', async () => {
  const { result, waitForValueToChange, waitFor } = renderHook(() => {
    const [params, setParams] = useState({});
    const navigate = (route: string, p: RouteParams) => setParams(p);

    return useSearch(params, navigate);
  });
  const prefix = '104.154.0.0/15';

  act(() => {
    result.current.setPrefix(prefix);
  });

  act(() => {
    result.current.onSubmit();
  });

  await waitForValueToChange(() => result.current.searchResult);

  expect(result.current.prefix).toEqual(prefix);
  expect(result.current.searchResult?.result.relations?.length).toEqual(3);

  await waitForValueToChange(() => result.current.validationResults);

  act(() => {
    result.current.setValidatePrefix(false);
  });

  act(() => {
    result.current.setAsnString('AS15168');
  });

  act(() => {
    result.current.onSubmit();
  });

  await waitForValueToChange(() => result.current.validationResults);
  await waitFor(() => !!result.current.validationResults);
  expect(result.current.validatePrefix).toEqual(false);
  if (!result.current.validationResults) return;
  expect(
    result.current.validationResults[0].validated_route.validity.state
  ).toEqual('invalid');
  expect(
    result.current.validationResults[0].validated_route.validity.reason
  ).toEqual('as');

  act(() => {
    result.current.setValidatePrefix(true);
  });
  act(() => {
    result.current.onSubmit();
  });
  await waitForValueToChange(() => result.current.validationResults);
  await waitFor(() => !!result.current.validationResults);
  expect(result.current.validatePrefix).toEqual(true);
  if (!result.current.validationResults) return;
  expect(
    result.current.validationResults[0].validated_route.validity.state
  ).toEqual('valid');
});

it('Automatically infer prefix length', async () => {
  const { result, waitForValueToChange } = renderHook(() => {
    const [params, setParams] = useState({});
    const navigate = (route: string, p: RouteParams) => setParams(p);

    return useSearch(params, navigate);
  });
  const prefix = '104.154.0.0/20';

  act(() => {
    result.current.setPrefix('104.154.0.0');
  });

  act(() => {
    result.current.onSubmit();
  });

  await waitForValueToChange(() => result.current.searchResult);

  expect(result.current.prefix).toEqual(prefix);
});

it('Validate two ASNs', async () => {
  const { result, waitForValueToChange } = renderHook(() => {
    const [params, setParams] = useState({});
    const navigate = (route: string, p: RouteParams) => setParams(p);

    return useSearch(params, navigate);
  });
  const prefix = '104.154.0.0/17';

  act(() => {
    result.current.setPrefix(prefix);
  });

  act(() => {
    result.current.onSubmit();
  });

  await waitForValueToChange(() => result.current.searchResult);

  expect(result.current.prefix).toEqual(prefix);
  expect(result.current.asnString).toEqual('AS15169,AS396982');
  await waitForValueToChange(() => result.current.validationResults);
  expect(result.current.validationResults?.length).toEqual(2);
});
