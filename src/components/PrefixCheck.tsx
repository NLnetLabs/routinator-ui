import React, { JSX, useContext } from 'react';
import SearchOptions from './prefix-check/SearchOptions';
import DataFreshness from './prefix-check/DataFreshness';
import SearchForm from './prefix-check/SearchForm';
import Notification from './prefix-check/Message';
import RelatedPrefixesGroups from './prefix-check/RelatedPrefixesGroups';
import useSearch from '../hooks/useSearch';
import ValidationResult from './prefix-check/ValidationResult';
import { RouterContext } from '../hooks/useRouter';

export default function PrefixCheck(): JSX.Element {
  const { params, navigate } = useContext(RouterContext);
  const {
    prefix,
    setPrefix,
    asn,
    setAsn,
    validatePrefix,
    setValidatePrefix,
    exactMatch,
    setExactMatch,
    notification,
    setNotification,
    onSubmit,
    searchResult,
    validationResult,
  } = useSearch(params, navigate);

  return (
    <div id="prefix-check" className={searchResult ? 'searched' : 'initial'}>
      <div className="sidebar">
        <SearchForm
          onSubmit={onSubmit}
          setPrefix={setPrefix}
          prefix={prefix}
          setAsn={setAsn}
          asn={asn}
          validatePrefix={validatePrefix}
          setValidatePrefix={setValidatePrefix}
        />
        {notification && (
          <Notification
            notification={notification}
            setNotification={setNotification}
          />
        )}
        <SearchOptions
          exactMatch={exactMatch}
          setExactMatch={setExactMatch}
          validatePrefix={validatePrefix}
          setValidatePrefix={setValidatePrefix}
          setAsn={setAsn}
        />
        <DataFreshness />
      </div>
      <div className="results">
        {searchResult && (
          <>
            <ValidationResult validationResult={validationResult} />
            <RelatedPrefixesGroups
              highlight={validatePrefix ? asn : ''}
              search={searchResult}
              setNotification={setNotification}
            />
          </>
        )}
      </div>
    </div>
  );
}
