import { act, renderHook } from '@testing-library/react-hooks';
import useSearch from './useSearch';
import * as searchResult from '../test/searchResult.json';

function fetchMock(url: string): Promise<Response> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        status: 200,
        json: async () => {
          if (url.endsWith('/search')) {
            return searchResult;
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

it('useStaleRefresh hook runs correctly', async () => {
  const { result, waitForValueToChange } = renderHook(() => useSearch());
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

  act(() => {
    result.current.setValidatePrefix(false);
  });

  act(() => {
    result.current.setAsn('incorrect-asn');
  });

  act(() => {
    result.current.onSubmit();
  });

  expect(result.current.validatePrefix).toEqual(false);
  expect(result.current.notification?.message).toEqual('Please enter a valid ASN or enable validating for an ASN found in BGP');
  expect(result.current.validationResult?.asn).toEqual('AS15169');
});
