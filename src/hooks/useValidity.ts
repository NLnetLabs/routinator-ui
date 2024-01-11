import { useEffect, useState } from 'react';
import { Message } from '../components/prefix-check/Message';
import { ValidationResponse } from '../types';
import { API_ENDPOINT } from '../core/contants';

export default function useValidity(
  prefix: string,
  asn: string | null,
  setNotification: (message: Message | null) => void
) {
  const [result, setResult] = useState<null | ValidationResponse>(null);

  useEffect(() => {
    if (!asn || !prefix) {
      return;
    }
    
    fetch(`${API_ENDPOINT}/api/v1/validity/${asn}/${prefix}`)
      .then((response) => response.json())
      .then(setResult)
      .catch(() =>
        setNotification({ message: 'An error occurred', level: 'error' })
      );
  }, [asn, prefix]);

  return result;
}
