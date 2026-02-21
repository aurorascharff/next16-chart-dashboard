import { Suspense } from 'react';
import { CategoryPieChart, CategoryChartSkeleton } from '@/components/dashboard/CategoryPieChart';
import { FilterPanel, FilterPanelSkeleton } from '@/components/dashboard/FilterPanel';
import { RevenueBarChart, RevenueChartSkeleton } from '@/components/dashboard/RevenueBarChart';
import { SummaryCards, SummaryCardsSkeleton } from '@/components/dashboard/SummaryCards';
import { UnitsAreaChart, UnitsChartSkeleton } from '@/components/dashboard/UnitsAreaChart';

import { getCategoryData, getMonthlyData, getSummaryData } from '@/data/queries/sales';
import { filterCache } from '@/lib/searchParams';

export default function Page({ searchParams }: PageProps<'/'>) {
  return (
    <div className="group mx-auto flex max-w-7xl flex-col gap-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-muted-foreground">Analyze sales data across regions, countries, and cities.</p>
        </div>
        <Suspense fallback={<FilterPanelSkeleton />}>
          <FilterPanel />
        </Suspense>
      </div>
      <div className="flex flex-col gap-6 group-has-data-pending:animate-pulse">
        <Suspense fallback={<SummaryCardsSkeleton />}>
          <SummaryCardsWrapper searchParams={searchParams} />
        </Suspense>
        <div className="grid gap-6 lg:grid-cols-2">
          <Suspense fallback={<RevenueChartSkeleton />}>
            <RevenueChartWrapper searchParams={searchParams} />
          </Suspense>
          <Suspense fallback={<UnitsChartSkeleton />}>
            <UnitsChartWrapper searchParams={searchParams} />
          </Suspense>
        </div>
        <Suspense fallback={<CategoryChartSkeleton />}>
          <CategoryChartWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

type WrapperProps = {
  searchParams: PageProps<'/'>['searchParams'];
};

async function SummaryCardsWrapper({ searchParams }: WrapperProps) {
  const { category, city, country, region, subcategory } = await filterCache.parse(searchParams);
  const dataPromise = getSummaryData({ category, city, country, region, subcategory });
  return <SummaryCards dataPromise={dataPromise} />;
}

async function RevenueChartWrapper({ searchParams }: WrapperProps) {
  const { category, city, country, region, subcategory } = await filterCache.parse(searchParams);
  const dataPromise = getMonthlyData({ category, city, country, region, subcategory });
  return <RevenueBarChart dataPromise={dataPromise} />;
}

async function UnitsChartWrapper({ searchParams }: WrapperProps) {
  const { category, city, country, region, subcategory } = await filterCache.parse(searchParams);
  const dataPromise = getMonthlyData({ category, city, country, region, subcategory });
  return <UnitsAreaChart dataPromise={dataPromise} />;
}

async function CategoryChartWrapper({ searchParams }: WrapperProps) {
  const { category, city, country, region, subcategory } = await filterCache.parse(searchParams);
  const dataPromise = getCategoryData({ category, city, country, region, subcategory });
  return <CategoryPieChart dataPromise={dataPromise} />;
}
