import React, { JSX } from 'react';
import SearchOptions from './prefix-check/SearchOptions';
import DataFreshness from './prefix-check/DataFreshness';
import SearchForm from './prefix-check/SearchForm';
import Notification from './prefix-check/Message';
import RelatedPrefixesGroups from './prefix-check/RelatedPrefixesGroups';
import useSearch from '../hooks/useSearch';
import ValidationResult from './prefix-check/ValidationResult';

export default function PrefixCheck(): JSX.Element {
  const {
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
  } = useSearch();

  const searched = validationResult?.prefix || searchResult;

  return (
    <div id="prefix-check" className={searched ? 'searched' : 'initial'}>
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
        {validationResult && (
          <ValidationResult
            prefix={validationResult.prefix}
            asn={validationResult.asn}
            setNotification={setNotification}
          />
        )}
        {searchResult && (
          <RelatedPrefixesGroups
            highlight={validatePrefix ? asn : ''}
            search={searchResult}
            setNotification={setNotification}
          />
        )}
      </div>
    </div>
  );
}
