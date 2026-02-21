import { createSearchParamsCache, parseAsString } from 'nuqs/server';

export const filterSearchParams = {
  city: parseAsString,
  country: parseAsString,
  region: parseAsString,
};

export const filterCache = createSearchParamsCache(filterSearchParams);
