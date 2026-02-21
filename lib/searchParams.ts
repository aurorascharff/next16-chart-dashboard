import { createSearchParamsCache, parseAsString } from 'nuqs/server';

export const filterSearchParams = {
  category: parseAsString,
  city: parseAsString,
  country: parseAsString,
  region: parseAsString,
  subcategory: parseAsString,
};

export const filterCache = createSearchParamsCache(filterSearchParams);
