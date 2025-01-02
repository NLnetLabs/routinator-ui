import en from '../locales/en.json';

export function t(key: string): string {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key.split('.').reduce((o: any, i: string) => o[snakeToCamel(i)], en) || key
  );
}

export function snakeToCamel(input: string): string {
  return input.replace(/(_[a-z])/g, (g) => g.toUpperCase().replace('_', ''));
}

export function formatDate(date: Date): string {
  return (
    new Date(date).toISOString().substring(0, 19).split('T').join(' ') + ' UTC'
  );
}

export function isValidASN(asn: string): boolean {
  if (asn) {
    if (asn.toLowerCase().startsWith('as')) {
      return !Number.isNaN(parseInt(asn.slice(2), 10));
    }
    return !Number.isNaN(parseInt(asn, 10));
  }
  return false;
}

export function parseASN(asn: string): number {
  if (asn.toLowerCase().startsWith('as')) {
    return parseInt(asn.slice(2), 10);
  }
  return parseInt(asn, 10);
}

export function arrayFromCommaSeperated(commaSeparated: string): string[] {
  if (!commaSeparated) {
    return [];
  }
  return commaSeparated.split(',').reduce((arr: string[], asn) => {
    if (asn.trim()) {
      arr.push(asn.trim());
    }
    return arr;
  }, []);
}

export function arrayToCommaSeperated(arr: string[]): string {
  if (arr.length == 0) {
    return '';
  }
  return arr.reduce((sum, str) => `${sum},${str}`);
}

export function tryFormatNumber(
  v: string | number | boolean | null | undefined
) {
  return Number.isInteger(v) ? (v || 0).toLocaleString('en') : v;
}

export function timeAgo(input: Date | string) {
  const date = input instanceof Date ? input : new Date(input);
  const formatter = new Intl.RelativeTimeFormat('en');
  const ranges = [
    ['years', 3600 * 24 * 365],
    ['months', 3600 * 24 * 30],
    ['weeks', 3600 * 24 * 7],
    ['days', 3600 * 24],
    ['hours', 3600],
    ['minutes', 60],
    ['seconds', 1],
  ] as const;
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;

  for (const [rangeType, rangeVal] of ranges) {
    if (rangeVal < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / rangeVal;

      return formatter.format(Math.round(delta), rangeType);
    }
  }
}
