import 'server-only';

import { cacheLife } from 'next/cache';
import { cache } from 'react';
import { checkAuth } from '@/data/queries/user';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';

type SalesFilters = {
  category?: string | null;
  city?: string | null;
  country?: string | null;
  region?: string | null;
  subcategory?: string | null;
};

export const getMonthlyData = cache(async (filters: SalesFilters) => {
  await checkAuth();
  return getMonthlyDataCached(filters);
});

async function getMonthlyDataCached(filters: SalesFilters) {
  'use cache: remote';
  cacheLife('hours');

  await slow(3000);

  const sales = await prisma.salesData.findMany({
    orderBy: { month: 'asc' },
    where: buildWhere(filters),
  });

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

  const sales = await prisma.salesData.findMany({
    include: { subcategory: { include: { category: true } } },
    where: buildWhere(filters),
  });

  const revenueByCategory = new Map<string, number>();

  for (const sale of sales) {
    const categoryName = sale.subcategory.category.name;
    revenueByCategory.set(categoryName, (revenueByCategory.get(categoryName) ?? 0) + sale.revenue);
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

  const sales = await prisma.salesData.findMany({
    where: buildWhere(filters),
  });

  const totalRevenue = sales.reduce((sum, s) => {
    return sum + s.revenue;
  }, 0);
  const totalUnits = sales.reduce((sum, s) => {
    return sum + s.units;
  }, 0);

  return {
    totalRevenue: Math.round(totalRevenue),
    totalUnits,
  };
}

function buildWhere(filters: SalesFilters): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  // Location filters (cascading)
  if (filters.city) {
    where.city = { name: filters.city };
  } else if (filters.country) {
    where.city = { country: { name: filters.country } };
  } else if (filters.region) {
    where.city = { country: { region: { name: filters.region } } };
  }

  // Category filters (cascading)
  if (filters.subcategory) {
    where.subcategory = { name: filters.subcategory };
  } else if (filters.category) {
    where.subcategory = { category: { name: filters.category } };
  }

  return where;
}
