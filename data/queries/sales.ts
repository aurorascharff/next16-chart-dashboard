import 'server-only';

import { cacheLife } from 'next/cache';
import { cache } from 'react';
import { MOCK_SALES, type MockSaleRecord } from '@/data/mock/sales-data';
import { CATEGORIES, REGIONS_DATA } from '@/data/mock/sales-data';
import { checkAuth } from '@/data/queries/user';
import { slow } from '@/utils/slow';

type SalesFilters = {
  category?: string | null;
  city?: string | null;
  country?: string | null;
  region?: string | null;
  subcategory?: string | null;
};

function filterSales(filters: SalesFilters): MockSaleRecord[] {
  return MOCK_SALES.filter(sale => {
    if (filters.city && sale.city !== filters.city) return false;
    if (filters.country && sale.country !== filters.country) return false;
    if (filters.region && sale.region !== filters.region) return false;
    if (filters.subcategory && sale.subcategory !== filters.subcategory) return false;
    if (filters.category && sale.category !== filters.category) return false;
    return true;
  });
}

export const getMonthlyData = cache(async (filters: SalesFilters) => {
  await checkAuth();
  return getMonthlyDataCached(filters);
});

async function getMonthlyDataCached(filters: SalesFilters) {
  'use cache: remote';
  cacheLife('hours');
  await slow(3000);

  const sales = filterSales(filters);
  const revenueByMonth = new Map<string, number>();
  const unitsByMonth = new Map<string, number>();

  for (const sale of sales) {
    revenueByMonth.set(sale.month, (revenueByMonth.get(sale.month) ?? 0) + sale.revenue);
    unitsByMonth.set(sale.month, (unitsByMonth.get(sale.month) ?? 0) + sale.units);
  }

  return Array.from(revenueByMonth.entries()).map(([month, revenue]) => {
    return {
      month,
      revenue: Math.round(revenue),
      units: unitsByMonth.get(month) ?? 0,
    };
  });
}

export const getCategoryData = cache(async (filters: SalesFilters) => {
  await checkAuth();
  return getCategoryDataCached(filters);
});

async function getCategoryDataCached(filters: SalesFilters) {
  'use cache: remote';
  cacheLife('hours');
  await slow(2000);

  const sales = filterSales(filters);
  const revenueByCategory = new Map<string, number>();

  for (const sale of sales) {
    revenueByCategory.set(sale.category, (revenueByCategory.get(sale.category) ?? 0) + sale.revenue);
  }

  return Array.from(revenueByCategory.entries()).map(([category, revenue]) => {
    return {
      category,
      revenue: Math.round(revenue),
    };
  });
}

export const getSummaryData = cache(async (filters: SalesFilters) => {
  await checkAuth();
  return getSummaryDataCached(filters);
});

async function getSummaryDataCached(filters: SalesFilters) {
  'use cache: remote';
  cacheLife('hours');
  await slow(2000);

  const sales = filterSales(filters);

  return {
    totalRevenue: Math.round(
      sales.reduce((sum, s) => {
        return sum + s.revenue;
      }, 0),
    ),
    totalUnits: sales.reduce((sum, s) => {
      return sum + s.units;
    }, 0),
  };
}

export async function getCategories() {
  'use cache: remote';
  cacheLife('hours');

  await slow();

  return CATEGORIES.map(c => {
    return { name: c.name };
  }).sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

export async function getSubcategories(category: string) {
  'use cache: remote';
  cacheLife('hours');

  await slow();

  const categoryData = CATEGORIES.find(c => {
    return c.name === category;
  });
  if (!categoryData) return [];

  return categoryData.subcategories
    .map(name => {
      return { name };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
}

export async function getRegions() {
  'use cache: remote';
  cacheLife('hours');

  await slow();

  return REGIONS_DATA.map(r => {
    return { name: r.name };
  }).sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

export async function getCountries(region: string) {
  'use cache: remote';
  cacheLife('hours');

  await slow();

  const regionData = REGIONS_DATA.find(r => {
    return r.name === region;
  });
  if (!regionData) return [];

  return regionData.countries
    .map(c => {
      return { name: c.name };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
}

export async function getCities(region: string, country?: string | null) {
  'use cache: remote';
  cacheLife('hours');

  await slow();

  const regionData = REGIONS_DATA.find(r => {
    return r.name === region;
  });
  if (!regionData) return [];

  const countries = country
    ? regionData.countries.filter(c => {
        return c.name === country;
      })
    : regionData.countries;

  return countries
    .flatMap(c => {
      return c.cities.map(name => {
        return { name };
      });
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
}
