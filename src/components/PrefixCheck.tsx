import React, { JSX, useContext } from 'react';
import SearchOptions from './prefix-check/SearchOptions';
import DataFreshness from './prefix-check/DataFreshness';
import SearchForm from './prefix-check/SearchForm';
import Notification from './prefix-check/Message';
import RelatedPrefixesGroups from './prefix-check/RelatedPrefixesGroups';
import useSearch from '../hooks/useSearch';
import ValidationResults from './prefix-check/ValidationResult';
import { RouterContext } from '../hooks/useRouter';
import { arrayFromCommaSeperated } from '../core/util';

export default function PrefixCheck(): JSX.Element {
  const { params, navigate } = useContext(RouterContext);
  const {
    prefix,
    setPrefix,
    asnString,
    setAsnString,
    validatePrefix,
    setValidatePrefix,
    exactMatch,
    setExactMatch,
    notification,
    setNotification,
    onSubmit,
    searchResult,
    validationResults,
  } = useSearch(params, navigate);

  return (
    <div id="prefix-check" className={searchResult ? 'searched' : 'initial'}>
      <div className="sidebar">
        <SearchForm
          onSubmit={onSubmit}
          setPrefix={setPrefix}
          prefix={prefix}
          setAsnString={setAsnString}
          asnString={asnString}
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
          setAsnString={setAsnString}
          onSubmit={onSubmit}
        />
        <DataFreshness />
      </div>
      <div className="results">
        {searchResult && (
          <>
            <ValidationResults validationResults={validationResults} />
            <RelatedPrefixesGroups
              highlight={arrayFromCommaSeperated(asnString)}
              search={searchResult}
              setNotification={setNotification}
            />
          </>
        )}
      </div>
    </div>
  );
}
