import { createContext, useEffect, useState } from 'react';
import { RoutinatorStatus, RotoStatus } from '../types';
import { API_ENDPOINT, ROTO_ENDPOINT } from '../core/contants';

export interface StatusContextProps {
  status: RoutinatorStatus;
  roto: RotoStatus | null;
}

export const StatusContext = createContext<StatusContextProps>({
  status: {} as RoutinatorStatus,
  roto: null,
});

interface StatusResult {
  status: RoutinatorStatus | null;
  roto: RotoStatus | null;
}

export default function useStatus(): StatusResult {
  const [status, setStatus] = useState<RoutinatorStatus | null>(null);
  const [roto, setRotoStatus] = useState<RotoStatus | null>(null);

  useEffect(() => {
    fetch(`${API_ENDPOINT}/api/v1/status`)
      .then((r) => r.json())
      .then(setStatus);

    fetch(`${ROTO_ENDPOINT}/api/v1/status`)
      .then((r) => r.json())
      .then(setRotoStatus);
  }, []);

  return { status, roto };
}
